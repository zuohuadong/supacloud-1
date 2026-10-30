# Transactional Business Outbox

This template implements the pattern described in
`docs/hasura-patterns-and-supacloud.zh-CN.md`:

```text
business transaction
  -> domain write + app.outbox insert (same commit)
  -> worker claims with FOR UPDATE SKIP LOCKED
  -> handler / external call with idempotency key
  -> delivered | retry_scheduled | dead_lettered
```

## Files

- `outbox.sql`: table, indexes, grants and atomic claim/complete/retry/dead-letter
  functions.
- `outbox-worker.ts`: Edge Function worker using `@supacloud/commands`'
  `createOutboxDispatcher` and the Supabase service-role client.

## Rules

1. **Same transaction.** The outbox insert must be in the transaction that
   commits the business change. Never write the outbox from a client callback
   after the business commit.
2. **At-least-once.** Delivery can repeat after a crash or lost acknowledgement.
   Consumers must deduplicate by `idempotency_key`.
3. **No secrets in payload.** Store identifiers and immutable versions. Read
   current domain data in the worker.
4. **CDC is only a wakeup.** If you use `pg_notify`, it may reduce latency but
   the outbox row remains the source of truth.
5. **Bounded retries.** The SQL template uses `attempts` / `max_attempts`;
   dead-lettered rows require an explicit operator replay.
6. **No direct trigger HTTP.** A database trigger may insert the outbox row, but
   must not call an external URL.

## Adoption

1. Copy `outbox.sql` into an application migration and review the grants/role
   names for the target project.
2. Add the outbox insert to the appropriate domain RPC/Command transaction.
3. Copy the worker into `supabase/functions/app-worker/` and register the
   topics you own.
4. Deploy the worker as a background or dedicated process with service-role
   credentials. Never ship the service-role key to a browser.
5. Test: commit then kill the worker; restart and verify eventual delivery;
   force a handler error and verify retry/dead-letter; replay the same
   idempotency key and verify the consumer does not duplicate effects.
