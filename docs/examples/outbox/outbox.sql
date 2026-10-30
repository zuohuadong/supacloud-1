-- Transactional business outbox template.
-- Apply as an application-owned migration, not as a platform schema.
-- The outbox row MUST be written in the same transaction as the business change.

create schema if not exists app;

create table if not exists app.outbox (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  aggregate_type text not null,
  aggregate_id text not null,
  payload jsonb not null default '{}'::jsonb,
  headers jsonb not null default '{}'::jsonb,
  idempotency_key text not null,
  status text not null default 'pending'
    check (status in ('pending', 'claimed', 'delivered', 'retry_scheduled', 'dead_lettered', 'cancelled')),
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  locked_by text,
  last_error text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  unique (idempotency_key)
);

create index if not exists outbox_ready_idx
  on app.outbox (available_at, created_at)
  where status in ('pending', 'retry_scheduled');

create index if not exists outbox_aggregate_idx
  on app.outbox (aggregate_type, aggregate_id, created_at desc);

-- Only the trusted worker can access the table. Never grant this to anon or
-- authenticated; consumers should use a domain read model, not the outbox.
revoke all on table app.outbox from public;
-- Replace service_role with the role used by your worker if it differs.
grant select, insert, update, delete on table app.outbox to service_role;

-- Claim due rows atomically. FOR UPDATE SKIP LOCKED lets several workers share
-- the queue without claiming the same row.
create or replace function app.outbox_claim(
  p_limit integer default 10,
  p_worker text default 'outbox-worker'
)
returns setof app.outbox
language sql
security definer
set search_path = app, pg_temp
as $$
  with claimed as (
    select id
    from app.outbox
    where status in ('pending', 'retry_scheduled')
      and available_at <= now()
    order by available_at asc, created_at asc
    limit greatest(1, least(coalesce(p_limit, 10), 100))
    for update skip locked
  )
  update app.outbox o
  set status = 'claimed',
      attempts = o.attempts + 1,
      locked_at = now(),
      locked_by = p_worker
  from claimed c
  where o.id = c.id
  returning o.*;
$$;

create or replace function app.outbox_complete(p_id uuid)
returns void
language sql
security definer
set search_path = app, pg_temp
as $$
  update app.outbox
  set status = 'delivered',
      delivered_at = now(),
      locked_at = null,
      locked_by = null,
      last_error = null
  where id = p_id and status = 'claimed';
$$;

create or replace function app.outbox_retry(
  p_id uuid,
  p_error text,
  p_available_at timestamptz
)
returns void
language sql
security definer
set search_path = app, pg_temp
as $$
  update app.outbox
  set status = 'retry_scheduled',
      available_at = p_available_at,
      locked_at = null,
      locked_by = null,
      last_error = left(coalesce(p_error, ''), 2048)
  where id = p_id and status = 'claimed';
$$;

create or replace function app.outbox_dead_letter(p_id uuid, p_error text)
returns void
language sql
security definer
set search_path = app, pg_temp
as $$
  update app.outbox
  set status = 'dead_lettered',
      locked_at = null,
      locked_by = null,
      last_error = left(coalesce(p_error, ''), 2048)
  where id = p_id and status = 'claimed';
$$;

revoke all on function app.outbox_claim(integer, text) from public;
revoke all on function app.outbox_complete(uuid) from public;
revoke all on function app.outbox_retry(uuid, text, timestamptz) from public;
revoke all on function app.outbox_dead_letter(uuid, text) from public;
grant execute on function app.outbox_claim(integer, text) to service_role;
grant execute on function app.outbox_complete(uuid) to service_role;
grant execute on function app.outbox_retry(uuid, text, timestamptz) to service_role;
grant execute on function app.outbox_dead_letter(uuid, text) to service_role;

-- Example business transaction. Adapt the table/status transition to your domain.
-- begin;
-- update app.orders set status = 'paid' where id = p_order_id and status = 'pending';
-- insert into app.outbox (topic, aggregate_type, aggregate_id, payload, idempotency_key)
-- values ('order.paid', 'order', p_order_id, jsonb_build_object('orderId', p_order_id),
--         'order.paid:' || p_order_id);
-- commit;
