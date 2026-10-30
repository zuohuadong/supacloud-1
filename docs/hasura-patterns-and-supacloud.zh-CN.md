# Hasura 能力借鉴与 SupaCloud 落地方案

> 状态：本轮范围已实施。本文保留模式、边界与分阶段说明，不承诺 Hasura 全量功能对等。
>
> 已落地：
> - `packages/db/src/matrix.ts`：角色矩阵；
> - `packages/commands/src/http-action.ts`：HTTP Actions 适配器；
> - `packages/commands/src/outbox.ts` + `docs/examples/outbox/`：事务内 outbox 调度器与 SQL/Worker 模板；
> - `scheduled_function_runs` 运行账本、`FOR UPDATE SKIP LOCKED`、重试/死信与运行历史 API；
> - Lite 与 Management API 的 GraphQL document/hash allowlist；
> - 控制台角色矩阵与定时函数运行历史页面。
>
> 结论先行：Hasura 真正值得学习的不是“用一个 GraphQL 引擎包住数据库”，而是把数据库能力产品化为**可声明、可授权、可调度、可观测、可回放**的资源。SupaCloud 应借鉴这层产品化方法，但继续以 PostgreSQL 的 grants/RLS/RPC 为权限与一致性权威，以现有 Compiler、Management API、PGMQ、Edge Functions 和 outbox 为执行载体。

## 1. 先判断：哪些值得学，哪些不该照搬

| Hasura 能力 | 本质价值 | 借鉴结论 | SupaCloud 当前对应物 |
| --- | --- | --- | --- |
| 行/列级权限、session variables、inherited roles | 把授权规则变成可读、可测、可预览的产品能力 | **借鉴交互与可解释性，不引入第二套权限引擎** | PostgreSQL RLS/grants、`@supacloud/db` 治理、Command 权限、SupAuth 适配、RLS Tester、角色化 GraphQL 快照 |
| 聚合查询（count/sum/avg/min/max/group by） | 常用分析读模型，减少为每个指标写一次性接口 | **借鉴“聚合是一等契约”** | 自定义 PostgREST schema、SQL view/RPC、`pg_graphql` 快照、Compiler 类型生成 |
| Actions（外部 REST webhook 映射为 GraphQL 字段） | 把外部服务纳入统一 API 契约，并复用认证/授权/观测 | **借鉴契约与治理，不用 GraphQL 代理实现** | Edge Functions、Elysia Controller/Command、`@supacloud/commands` 外部适配器、OpenAPI/生成客户端 |
| Event Triggers（行变更触发 HTTP，带重试/死信/日志） | 把数据库变更可靠地送达外部系统 | **借鉴投递语义，不用“触发器直接发 HTTP”** | `webhook_outbox`/`webhook_deliveries`、PGMQ、Durable Workflows、Lite CDC webhooks |
| Scheduled/Cron Triggers | 定时任务是一等资源，有运行历史、重试、手工触发 | **重点借鉴，补上持久化运行账本** | `scheduled_functions` 配置、`scheduled-function.worker`、Lite `CronService` |
| Metadata / migrations / allowlist / API limits | 声明式管理 API 面，可 diff、可审计、可限制 | **借鉴声明式清单与发布门禁，不复制动态 metadata server** | `app.manifest.json`、`db.manifest.json`、`graphql.manifest.json`、`graphql/policy.json`、PostgREST/GraphQL 运行时限制 |
| Remote Schemas / remote joins | 联邦多个 GraphQL 服务 | **暂不照搬** | 由 BFF/Elysia 组合，或应用侧 typed client；不新增核心 GraphQL 联邦层 |
| Subscriptions | GraphQL 实时订阅 | **不照搬** | Realtime（Postgres Changes）已独立存在；GraphQL subscriptions 仍不在 HTTP 契约内 |

### 1.1 最重要的一条边界

不要为了“像 Hasura”而新增以下任一组件：

- 第二个 GraphQL resolver / schema 运行时；
- 第二套权限数据库，或把业务权限从 RLS 搬到 JSON metadata；
- 第二个调度器；
- 允许租户配置任意 URL、任意 SQL、任意 HTTP 头的“万能触发器”；
- 用 best-effort HTTP 调用冒充可靠事件投递。

SupaCloud 现有的核心优势是：**数据库是事实来源，控制面是配置权威，执行面是可替换的**。Hasura 的 metadata 模式很容易把这三者混在一起；借鉴时应保留这条分层。

## 2. 当前架构基线

### 2.1 全量平台

```text
Caddy Gateway
  ├─ PostgREST（每项目独立进程）──> 租户 PostgreSQL
  ├─ GoTrue（每项目或共享 SupAuth）─> auth schema / 外部身份中心
  ├─ Management API（Elysia）──────> 控制面数据库、项目生命周期、配置
  └─ Edge Runtime ─────────────────> Bun/Elysia Functions、后台任务

租户 PostgreSQL
  ├─ public / 自定义暴露 schema
  ├─ pg_graphql（opt-in）
  ├─ PGMQ / Durable Workflows
  ├─ supacloud_commands / 审批账本
  └─ RLS、RPC、触发器、审计表
```

与本议题直接相关的已实现能力：

- **数据库治理**：`@supacloud/db` 的 `defineDatabaseModule` 已把 policies、functions、triggers、grants 变成可对账资源；`reconcileModule` 读取 PostgreSQL Catalog，`lintModule` 做静态检查。
- **GraphQL**：`pg_graphql` 是唯一执行器；Compiler 只做本地 schema/operation 校验、角色快照、feature matrix、复杂度/深度/字段数/分页预算；不提供第二套 resolver。
- **权限**：平台控制面 RBAC 与业务 RLS/RPC 分离；Command 通过 `permission` 与 SupAuth 风格授权适配器执行；RLS Tester 提供受限的只读角色模拟。
- **异步执行**：Background Functions、PGMQ、Durable Workflows、`supacloud_commands`，已有 at-least-once、重试、租约、幂等回执等语义。
- **定时**：Management API 的 `scheduled_functions` 配置 + 进程内 worker，每 60 秒扫描项目配置并按 5 字段 cron 触发 Edge Function；不依赖租户是否启用 `pg_cron`。
- **Webhook**：控制面已有 `project_webhooks`、`webhook_outbox`、`webhook_deliveries`，支持签名、重试、死信、回放；出站 HTTP 经过 `safeOutboundFetch` 的 DNS/IP 校验和响应大小限制。
- **Lite**：同一套 Supabase wire protocol；`CronService` 读取 `cron.job` 并记录 `cron.job_run_details`，`NetService` 排空 `net.http_request_queue`，`WebhooksService` 基于 CDC 触发 HTTP。

### 2.2 当前关键缺口

| 缺口 | 影响 | 不应采用的补法 |
| --- | --- | --- |
| 聚合没有统一契约，依赖手写 view/RPC | 指标口径分散，类型与权限测试容易漏 | 在 Node 侧拉全量数据再聚合 |
| 权限声明与 RLS 事实之间缺少“角色矩阵”视图 | 评审者难以回答“anon/authenticated 能对这张表做什么” | 把 USING 表达式复制到 metadata |
| 定时任务没有持久化 run 账本、重试、时区、去重 | 多实例可能重复触发，失败不可追踪，无法补跑 | 引入第二套 cron 服务 |
| 事件触发器没有通用租户表事件契约 | 业务事件要么写在应用代码，要么用不可靠的触发器 HTTP | 在数据库触发器里直接 `http_post` |
| 外部 REST 调用缺少统一 Action 清单与出站策略 | 凭据、超时、幂等、SSRF 边界分散 | 在 metadata 中保存任意 URL 和密钥 |
| allowlist/limits 只在编译期或单点运行时生效 | 手工请求可绕过生成客户端 | 只依赖 Compiler 校验 |

## 3. 借鉴原则

1. **声明在应用仓库，执行在受控运行时，事实在 PostgreSQL。**
   - 声明：Manifest、迁移、Command/Route 契约、schedule/action 配置。
   - 执行：Management API、Edge Functions、PGMQ、Workers。
   - 事实：`pg_policy`、`pg_proc`、grants、运行账本、outbox。

2. **一个能力只有一个权威。**
   - 权限权威是 RLS/grants/RPC，不是 JWT 里的业务角色。
   - GraphQL 权威是 `pg_graphql`，不是新的 resolver。
   - 调度权威是平台 scheduler，不是每个项目各跑一个 cron。
   - 事件投递权威是 outbox，不是数据库触发器里的 HTTP 调用。

3. **异步副作用默认 at-least-once，靠幂等键收敛。**
   - 不承诺 exactly-once。
   - 每个外部副作用必须有稳定 operation ID、去重键或对账流程。

4. **所有外部目标默认不可信。**
   - URL 必须经过 allowlist + DNS/IP 解析校验 + 重定向复验。
   - 密钥只来自项目密钥/Vault/环境变量，不进入 schedule/action 的明文配置。
   - 响应体、超时、重试次数、并发都必须有上限。

5. **产品化能力必须可解释。**
   - 权限要能回答“为什么拒绝”。
   - 聚合要能回答“口径、时间范围、租户范围、成本”。
   - 调度要能回答“上次何时跑、结果如何、下次何时跑”。
   - 事件要能回答“是否投递、重试几次、能否回放”。

## 4. 逐项落地方案

### 4.1 聚合：把指标做成受治理的数据库契约

#### 现状

- `pg_graphql` 会反射数据库对象；Compiler 的 `graphqlFeatureMatrix` 只检测快照里是否出现 aggregate 形状，不生成聚合实现。
- PostgREST 支持 `Prefer: count=exact` 这类计数，但没有业务语义的 `sum/avg/group by` DSL。
- 现有推荐做法是自定义 PostgREST schema + view/RPC，但还缺少统一的声明、权限测试和成本约束。

#### 建议

按“简单聚合”和“参数化聚合”分开处理，二者都落在 SQL，不在 Node 侧拼数据。

**A. 简单、固定维度的聚合：`security_invoker` view**

适合按天/按状态/按租户的固定报表，直接暴露给 PostgREST 和 `pg_graphql`。

```sql
create schema if not exists api;

create or replace view api.order_daily_stats
with (security_invoker = true)
as
select
  o.tenant_id,
  date_trunc('day', o.created_at)::date as day,
  count(*)::bigint as order_count,
  coalesce(sum(o.amount), 0)::numeric as gmv
from public.orders o
where o.deleted_at is null
group by o.tenant_id, date_trunc('day', o.created_at)::date;

grant select on api.order_daily_stats to authenticated;
-- 不授予 anon；service_role 是否授予由项目策略决定
```

关键点：

- `security_invoker = true` 让基表 RLS 以调用者身份生效，避免视图绕过租户隔离。
- 视图只暴露必要列；不要 `select *` 后让前端自己过滤。
- 若业务需要“按任意时间范围”，不要做无界视图，改用参数化 RPC。

**B. 参数化聚合：`security invoker` SQL 函数 + PostgREST `/rpc`**

适合时间范围、分页、维度可选的分析查询。

```sql
create or replace function api.order_stats(
  p_from timestamptz,
  p_to timestamptz
)
returns table (
  day date,
  order_count bigint,
  gmv numeric
)
language sql
stable
security invoker
set search_path = public, pg_temp
as $$
  select
    date_trunc('day', o.created_at)::date as day,
    count(*)::bigint as order_count,
    coalesce(sum(o.amount), 0)::numeric as gmv
  from public.orders o
  where o.created_at >= p_from
    and o.created_at <  p_to
    and o.deleted_at is null
  group by 1
  order by 1;
$$;

revoke all on function api.order_stats(timestamptz, timestamptz) from public;
grant execute on function api.order_stats(timestamptz, timestamptz) to authenticated;
```

PostgREST 调用：

```http
POST /rest/v1/rpc/order_stats
Content-Type: application/json

{"p_from":"2026-10-01T00:00:00Z","p_to":"2026-11-01T00:00:00Z"}
```

关键点：

- `security invoker` + RLS 是默认；只有明确需要跨租户平台统计时才考虑 `security definer`，并且必须固定 `search_path`、单独授权、加审计。
- 参数必须有边界：最大时间跨度、最大返回行数、必填租户/主体条件。
- 不要把 `tenant_id` 作为前端可任意传入的参数；优先从 JWT/RLS 上下文取，或由 RPC 内部校验。

#### 契约与工具链

建议做增量扩展，而不是新框架：

1. **`@supacloud/db` 增加只读视图声明**（可选，若现有 `FunctionDecl` 足够则先不加）：

```ts
export const orderDb = defineDatabaseModule({
  name: "order",
  tables: ["public.orders"],
  // 新增 ViewDecl：source、roles、tests、security: "invoker"
  views: [
    {
      name: "api.order_daily_stats",
      source: "views/order_daily_stats.sql",
      security: "invoker",
      roles: ["authenticated"],
      tests: ["tests/order_daily_stats_rls.test.sql"],
    },
  ],
  functions: [
    {
      name: "api.order_stats",
      source: "functions/order_stats.sql",
      security: "invoker",
      transaction: "none",
      tests: ["tests/order_stats.test.sql"],
    },
  ],
});
```

2. **Catalog 对账增加检查**：
   - view/function 是否存在；
   - 是否 `security_invoker`；
   - 是否错误地授予 `PUBLIC`/`anon`；
   - 是否有对应的角色测试；
   - 是否缺少 `search_path`（definer 函数）。

3. **Compiler 不生成聚合实现，只生成调用契约**：
   - 对 view：从导出的 GraphQL/OpenAPI 快照生成字段类型。
   - 对 RPC：沿用现有 route/procedure 契约生成 typed client。
   - 在 manifest 中记录“聚合口径”与限制（最大时间跨度/最大行数），供审查和运行时校验。

4. **运行时限制**：
   - PostgREST：`db-max-rows`、statement timeout。
   - GraphQL：已有 body 大小、statement timeout、慢查询阈值；再配合 `graphql/policy.json` 的深度/字段/复杂度/分页预算。
   - 数据库：函数内部或事务级 `set local statement_timeout`。

#### 不建议

- 不要在 Edge Function 中 `select *` 后在 JS 里 `reduce` 聚合；这会放大传输、内存和权限绕过风险。
- 不要为每个前端图表新增一张物化视图；先确认真实查询频率与刷新成本。
- 不要把 `security definer` 当作让聚合“能跑通”的快捷方式。

#### 验收

```gherkin
Scenario: 租户隔离的聚合
  Given 两个租户的 orders 数据
  When 租户 A 的 authenticated 用户查询 order_daily_stats
  Then 只返回租户 A 的行
  And 返回的 count/sum 不包含租户 B

Scenario: 参数化聚合的成本边界
  Given order_stats 的最大时间跨度为 90 天
  When 调用者请求 365 天
  Then 请求被拒绝且不执行全表扫描

Scenario: 权限失败而非空结果
  Given anon 没有 order_daily_stats 的 select 权限
  When anon 查询该视图
  Then 返回权限错误
  And 不返回空数组伪装成“无数据”
```

### 4.2 权限：借鉴 Hasura 的可解释性，保留 RLS 的权威性

#### 现状

- 平台 RBAC 管控制面；业务应用自己拥有关系型授权（ReBAC）与工作流授权。
- RLS 与 `SECURITY DEFINER` RPC 是数据库读写的最终边界。
- Command 有 `permission` 声明、SupAuth 授权适配器、权限目录版本/摘要校验。
- GraphQL 支持按 `anon`/`authenticated`/`service_role` 导出不同 schema 快照。
- RLS Tester 已支持在回滚事务中做只读角色模拟。

#### 值得借鉴的 Hasura 体验

1. **角色 × 表 × 操作矩阵**：一眼看到谁能 select/insert/update/delete。
2. **session variables**：把 JWT claims（`sub`、`tenant_id`、`role`）映射到策略输入。
3. **inherited roles**：角色继承的可读表达。
4. **列级权限**：同一张表不同角色可见列不同。
5. **“为什么拒绝”**：不是只返回 403，而是能解释缺哪条策略/哪个 claim。
6. **角色预览**：以某个角色和一组 claims 试跑查询。

#### 建议实现

**A. 角色矩阵由 Catalog 生成，而不是手写第二份权限配置**

在 `@supacloud/db` 增加只读报告（不改变策略执行）：

```text
db matrix --schema public --roles anon,authenticated,service_role

table                  role             select  insert  update  delete  rls
public.orders          anon             -       -       -       -       on
public.orders          authenticated    yes     yes     own     -       on
public.order_items     authenticated    yes     yes     own     own     on
```

数据来源：

- `pg_class.relrowsecurity`
- `pg_policy`
- `information_schema.role_table_grants` / `pg_class` ACL
- `@supacloud/db` manifest 中的声明
- 测试文件声明

输出应区分：

- **声明了但数据库没有**（drift）；
- **数据库有但 manifest 没声明**（undeclared）；
- **RLS 开启但没有策略**（默认拒绝，通常是配置错误）；
- **授予 PUBLIC**（高风险）；
- **列级 grant 与表级 grant 冲突**。

**B. 扩展 RLS Tester 为“角色 + claims”预览**

现有 RLS Tester 已是只读、单语句、回滚事务。建议增加：

```json
{
  "role": "authenticated",
  "claims": {
    "sub": "user-123",
    "tenant_id": "tenant-a",
    "app_metadata": { "roles": ["reviewer"] }
  },
  "sql": "select * from public.orders"
}
```

执行时在事务内设置：

```sql
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"user-123","tenant_id":"tenant-a"}', true);
-- 只允许 SELECT / WITH；禁止 DML、锁、危险函数
```

返回：

- 行数/结果预览（受上限约束）；
- 实际使用的策略名（可通过 `EXPLAIN (VERBOSE)` 或策略目录辅助）；
- 是否因 RLS 返回 0 行，还是因 grant 被拒绝；
- 建议的修复方向（缺少 policy、claim 名称不匹配、grant 缺失）。

注意：这只是**开发/运维诊断**，不是运行时鉴权；不要把 claim 注入能力暴露给普通租户。

**C. Command 权限与 RLS 的关系**

- Command 的 `permission` 是“能否发起这个业务动作”的粗粒度门禁。
- RLS/RPC 是“这个动作能读写哪些行”的最终边界。
- 两者不能互相替代：
  - 只有 Command 权限、没有 RLS：直接 PostgREST 请求可绕过。
  - 只有 RLS、没有 Command 权限：复杂业务不变量、审计、幂等没有统一入口。

建议在 Compiler 诊断中增加一条：

```text
command permission "orders:refund" 已声明，但对应 RPC 没有
security invoker/definer 的权限测试；请补充 RLS 或 RPC 测试。
```

**D. 列级权限**

PostgreSQL 支持列级 grant。对于“同一张表、不同角色可见列不同”的场景：

- 优先拆 view（`api.order_public`），而不是给同一张表做复杂的列级 grant 组合。
- 若使用列级 grant，必须在 manifest 中声明并测试 `select` 的列集合。
- GraphQL 快照按角色导出，天然能反映列可见性；但仍要以数据库为准，不把快照当授权。

**E. inherited roles**

不建议在网关层做“角色合并后直接放行”。如果业务确实需要角色继承：

- 在数据库中把继承关系物化为角色成员关系（`GRANT role_a TO role_b`），由 PostgreSQL 执行。
- 或在应用授权层解析继承，但最终仍落到 RLS/RPC。
- 不在 JWT 中放“合并后的业务角色”，避免撤销延迟。

#### 不建议

- 不要把 Hasura 的 `x-hasura-*`  header 直接搬过来；SupaCloud 的等价物是已验证 JWT claims 与数据库会话变量。
- 不要为每个表生成一套 JSON 权限 DSL；RLS 已经是可执行、可测试、可对账的 DSL。
- 不要让 `service_role` 成为“看不清权限时”的默认修复手段。

#### 验收

```gherkin
Scenario: 角色矩阵与 Catalog 一致
  Given 项目已应用迁移
  When 运行 db matrix
  Then 每张表的 RLS 状态、策略和 grant 与 manifest 声明一致
  And 任何 PUBLIC grant 都导致非零退出

Scenario: 角色预览解释拒绝原因
  Given anon 没有 orders 的 select grant
  When 以 anon 身份试跑 select
  Then 返回 grant 拒绝而不是空结果
  And 报告指出缺失的 grant 或 policy

Scenario: 撤销即时生效
  Given 用户已登录且 JWT 仍有效
  When 业务关系被撤销
  Then 下一次数据库读写立即被 RLS 拒绝
  And 不依赖 JWT 刷新
```

### 4.3 定时任务：把“配置”升级为“可追踪的调度资源”

#### 现状

全量平台当前实现：

- 配置位置：`projects.config.scheduled_functions`。
- 管理接口：`/v1/projects/:ref/scheduled-functions`，支持 CRUD 与手工触发。
- 投影：`scheduled_jobs` 只保存启用 schedule 的 `(project_ref, schedule_id, next_run_at)`，由 `scheduledFunctionService` 在同一个事务内同步；启动时一次性回填旧项目。
- 调度器：`packages/management-api/src/workers/scheduled-function.worker.ts` 每 60 秒只查 `next_run_at <= now()` 的投影行，不再扫描所有项目 JSON；用条件更新抢占本次 occurrence。
- 执行：以项目 `service_role_key` 调用 Edge Runtime 的 `/functions/v1/:slug`。
- 上限：每项目 20 个 schedule；body 上限 1 MiB；headers 做规范化。
- 语义：`scheduled_function_runs` 持久化 run 账本，唯一键 `(project_ref, schedule_id, scheduled_for)`；失败按 60/300/1800 秒退避，超过上限进入死信；多实例通过 `FOR UPDATE SKIP LOCKED` 与投影 CAS 避免重复。

Lite 当前实现：

- `CronService` 读取 `cron.job`，每秒 tick，按 UTC 匹配 5 字段或 `N seconds`。
- 以超级用户执行 `command`，结果写入 `cron.job_run_details`。
- 这是 `pg_cron` 兼容层，不等同于全量平台的函数调度语义。

#### 借鉴 Hasura 的点

Hasura Scheduled Triggers 的产品价值主要不是 cron 解析，而是：

1. 一次性任务和周期任务都是资源；
2. 每次运行有独立记录；
3. 失败有重试与死信；
4. 支持手工触发/补跑；
5. payload、headers、超时、并发可配置；
6. 控制台能看到上次/下次运行和错误。

#### 建议目标模型

保留“控制面调度”这一权威，不要引入第二个 scheduler。把现有配置扩展为两张平台表（名称可调整）：

```sql
-- 控制面数据库
create table scheduled_jobs (
  id uuid primary key,
  project_ref text not null references projects(ref) on delete cascade,
  name text not null,
  cron text not null,
  timezone text not null default 'UTC',
  target_kind text not null check (target_kind in ('function', 'command', 'workflow')),
  target text not null,
  payload jsonb not null default '{}'::jsonb,
  headers_secret_ref jsonb not null default '{}'::jsonb, -- 只存密钥引用，不存明文
  enabled boolean not null default true,
  max_attempts integer not null default 3 check (max_attempts between 1 and 20),
  timeout_seconds integer not null default 30 check (timeout_seconds between 1 and 900),
  concurrency_policy text not null default 'skip' check (concurrency_policy in ('skip', 'queue')),
  catch_up_policy text not null default 'none' check (catch_up_policy in ('none', 'bounded')),
  next_run_at timestamptz,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_ref, name)
);

create table scheduled_job_runs (
  id uuid primary key,
  job_id uuid not null references scheduled_jobs(id) on delete cascade,
  scheduled_for timestamptz not null,
  idempotency_key text not null,
  status text not null check (status in (
    'pending', 'dispatched', 'running', 'succeeded', 'failed',
    'retry_scheduled', 'dead_lettered', 'skipped', 'cancelled'
  )),
  attempt integer not null default 1,
  task_id text,
  started_at timestamptz,
  finished_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  unique (job_id, scheduled_for),
  unique (idempotency_key)
);
```

配套索引：

```sql
create index scheduled_jobs_due_idx
  on scheduled_jobs (next_run_at)
  where enabled;

create index scheduled_job_runs_ready_idx
  on scheduled_job_runs (status, created_at)
  where status in ('pending', 'retry_scheduled');
```

#### 调度流程

```text
scheduler tick
  -> 取得全局 advisory lock（或 leader lease）
  -> select due jobs ... for update skip locked
  -> 为每个 job 计算本次 scheduled_for
  -> insert scheduled_job_runs（唯一键去重）
  -> 计算 next_run_at
  -> 提交事务

run dispatcher
  -> claim pending run（for update skip locked）
  -> 通过既有 Background Function / Command / Workflow 入口提交
  -> 记录 task_id / status
  -> 成功则 succeeded；失败按策略 retry_scheduled 或 dead_lettered
```

关键约束：

1. **调度与执行分离**：tick 只负责“到点生成 run”，不直接执行长任务。
2. **唯一键去重**：`(job_id, scheduled_for)` 防止多实例重复生成；`idempotency_key = schedule:<job_id>:<scheduled_for>` 供下游去重。
3. **重试不是重新生成新 run**：同一 run 的 attempt 递增，保留完整历史；手工重跑创建新 run，并标记 `replay_of`。
4. **不承诺 exactly-once**：提交与执行之间可能崩溃；下游必须按幂等键收敛。
5. **payload 只放标识**：大对象放 Storage/业务表；不放密钥、不放客户敏感明文。
6. **headers 只存密钥引用**：实际值在执行时从项目密钥/Vault 解析；平台头（`apikey`/`authorization`/`x-project-ref`）最后覆盖，租户不能重定向内部调用。

#### 时间与时区

- 存储统一 UTC，展示按 IANA timezone 转换；不要只存 `+08:00` 偏移。
- 夏令时：以“本地墙钟时间”定义下一次运行，再转换为 UTC；明确跳过/重复小时的策略，默认“跳过不存在的时间，重复时间只跑一次”。
- 默认不补跑（`catch_up_policy='none'`）；需要补跑时限制最大回补窗口（例如 24 小时）和最大次数。
- tick 间隔不应决定精度：用 `next_run_at` 计算，而不是“当前分钟是否匹配”，避免漂移和漏跑。

#### 与现有实现的最小改造路径

**阶段 1：不换 API，只加账本**

- 保持 `/scheduled-functions` 的请求/响应兼容。
- 在 `scheduledFunctionService` 写入配置时同步写 `scheduled_jobs` 投影；或直接把新表作为权威，route 做适配。
- 手工触发也创建一条 run，走同一 dispatcher。
- 每次 tick 记录 run 与错误，先解决“可观测”。

**阶段 2：替换 tick 语义**

- 用 `next_run_at` + `FOR UPDATE SKIP LOCKED` 替换“全项目扫描 + 当前分钟匹配”。
- 增加全局锁/leader lease，允许多实例安全运行。
- 引入重试与死信；复用 `webhook_outbox` 的 claim/attempt 模式。

**阶段 3：扩展 target**

- 先支持 `function`（现有能力）。
- 再支持 `command`（通过现有 Command/RPC 入口，带权限与幂等）。
- `workflow` 作为可选 target，必须使用现有 Durable Workflows/PGMQ，不新建执行引擎。

**阶段 4：控制台与 CLI**

- 列表展示 next_run_at、last_run_at、最近状态。
- run 详情展示 attempt、task_id、错误、耗时、重试/死信/回放。
- CLI 提供 `schedule list/run-history/replay`，但写操作仍需现有权限。

#### Lite 的边界

Lite 的 `CronService` 是 `pg_cron` 兼容层，适合“数据库本地 SQL 任务”；全量平台的 scheduler 适合“跨项目函数/命令任务”。两者不要互相冒充：

- 如果用户要 `cron.schedule('...', $$select ...$$)`，继续走 Lite `CronService` / 租户 `pg_cron`。
- 如果用户要“定时调用某个 Function 并查看任务状态”，走全量平台 `scheduled_jobs`。
- 不要在 Lite 中实现第二套控制面调度器；Lite 只需要把 SQL cron 的 run 记录做可靠。

#### 验收

```gherkin
Scenario: 多实例不重复生成运行
  Given 两个 scheduler 实例同时 tick
  When 同一个 job 到达 next_run_at
  Then 只生成一条 (job_id, scheduled_for) 运行记录
  And 只有一个实例提交执行

Scenario: 失败重试与死信
  Given 一次函数调用失败
  When attempt 小于 max_attempts
  Then run 进入 retry_scheduled 并保留错误
  When attempt 达到 max_attempts
  Then run 进入 dead_lettered
  And 不丢失原始 payload 与错误摘要

Scenario: 手工触发可追踪
  Given 一个启用的 schedule
  When 操作者手工触发
  Then 创建一条可区分的 run
  And 返回 run_id，而不是只返回 HTTP 200

Scenario: 时区与夏令时
  Given timezone 为 America/New_York
  When 进入夏令时切换
  Then next_run_at 按本地墙钟规则计算
  And 不产生重复执行
```

### 4.4 外部 RESTful：把 Actions 做成受治理的 Command/Function

#### 现状

- 外部 HTTP 调用的自然落点是 Edge Function 或 Elysia Controller。
- `@supacloud/commands` 有 external adapter、幂等、审计、恢复语义；`transaction: "none"` 明确表示外部副作用不在数据库事务内。
- 控制面已有 `safeOutboundFetch`：DNS 解析、私网/回环/云元数据地址阻断、重定向复验、响应体上限。
- `webhook_outbox` 已验证“持久化 + claim + 重试 + 死信 + 回放”的模式。

#### 借鉴 Hasura Actions 的点

Hasura Actions 的价值是：

1. 在统一 schema 中声明输入/输出类型；
2. 复用认证与角色授权；
3. 把 REST 端点包装成可发现的 API；
4. 统一错误、超时和日志；
5. 让前端不需要知道每个外部服务的地址。

SupaCloud 不需要“GraphQL 字段 -> REST webhook”这一层，但需要同样的**契约、授权、观测和出站治理**。

#### 建议模型

**A. 业务动作：Command 优先**

```ts
@Command({
  name: "payment.refund",
  permission: "payment:refund",
  transaction: "none",      // 外部副作用，明确不伪装成数据库事务
  idempotency: "required",
  audit: "payment.refunded",
})
export class RefundPayment {
  constructor(private readonly gateway: PaymentGateway) {}

  async execute(input: RefundInput, context: CommandContext) {
    // 1. 校验当前业务状态与版本
    // 2. 使用稳定 operation ID 调用外部网关
    // 3. 记录外部回执与对账状态
    // 4. 返回 operation receipt，不返回“已成功”的空承诺
  }
}
```

**B. 通用第三方 REST：Adapter + Manifest**

对需要被多个模块复用的外部服务，建立 application-owned adapter：

```ts
interface ExternalActionManifest {
  name: string;                 // payment.refund
  version: string;              // 2026-10-01
  endpoint: string;             // 只允许配置在受控部署配置中
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  timeoutMs: number;
  maxResponseBytes: number;
  retry: { maxAttempts: number; baseDelayMs: number };
  idempotency: "required" | "optional";
  allowedHosts: string[];       // 出站 allowlist
  secretRefs: string[];         // 只引用，不存值
}
```

该 manifest 属于应用仓库/部署配置，不属于租户可任意编辑的数据库 metadata。它用于：

- 生成 typed client；
- 生成 OpenAPI/契约测试；
- 在启动时校验 endpoint 与 allowlist；
- 在运行时统一超时、重试、响应上限和审计。

**C. 如果确实需要 GraphQL 暴露**

当前架构不建议为 Actions 增加第二套 GraphQL resolver。可选路径：

1. **推荐**：前端通过生成的 REST client 调用 Command/Function；GraphQL 只用于数据库读模型。
2. **受控网关**：如果产品必须统一 GraphQL 入口，在网关层增加“预声明 action 字段 -> 内部 Command”的映射，但必须满足：
   - 字段集合在编译期固定，不从租户 metadata 动态生成；
   - 复用现有 JWT/Command 授权；
   - 不暴露任意 URL；
   - 有独立的超时、错误和审计。
   这仍然是一个新的 GraphQL 入口，应作为独立 ADR，而不是顺手加到 `pg_graphql` 上。

#### 出站安全清单

- URL 必须 `https`（本地开发可显式放开 loopback）。
- 校验协议、host、DNS 解析结果；阻断私网、回环、链路本地、云元数据地址。
- 重定向必须逐跳复验，限制跳数。
- 响应体上限（例如 64 KiB）；超时（例如 30 秒）；并发上限。
- 密钥只从项目密钥/Vault/环境变量读取；不写入日志、不进入错误响应。
- 外部错误统一映射为 bounded code，不把上游响应体原样透传给客户端。
- 记录 operation ID、目标、状态码、耗时、重试次数；不记录 Authorization/Cookie/请求体中的敏感字段。

#### 幂等与对账

- 调用前生成稳定 `operationId`，并与业务实体/版本绑定。
- 外部服务支持幂等键时，传递该键；不支持时，本地记录“未知结果”，由对账任务查询。
- 传输超时不是“失败”，而是 `unknown`；不要用新 operation ID 重试外部副作用。
- 对账结果写回业务表/命令回执，不依赖调用方一直在线。

#### 验收

```gherkin
Scenario: 外部调用不伪装成数据库事务
  Given 一个 transaction=none 的外部 Command
  When 外部网关超时
  Then 不声称业务已回滚
  And 返回可对账的 operation 状态

Scenario: SSRF 防护
  Given action endpoint 解析到 127.0.0.1 或 169.254.169.254
  When 执行出站请求
  Then 请求在发出前被拒绝
  And 重定向到私网地址同样被拒绝

Scenario: 幂等重试
  Given 同一个 operation ID 被重复提交
  When 第一次响应丢失
  Then 外部服务/对账逻辑只产生一次副作用
  And 第二次返回同一 operation 回执
```

### 4.5 事件触发器：用 outbox 借鉴 Hasura 的投递语义

#### 现状

- 全量平台已有 `project_webhooks` + `webhook_outbox` + `webhook_deliveries`：签名、重试、死信、回放、响应预览，属于控制面/项目事件，而不是任意业务表事件。
- `task-events` 提供任务生命周期 webhook 配置，但同样不是通用表触发器。
- Lite `WebhooksService` 基于 CDC（触发器 + `pg_notify`）直接 POST；进程重启期间的投递没有持久账本，属于 best-effort。
- Durable Workflows 明确建议“业务事务写 outbox，worker 再分发”，不要在数据库触发器里直接 HTTP。

#### 借鉴 Hasura Event Triggers 的点

1. 事件有稳定的 payload 形状；
2. 至少一次投递；
3. 失败重试、死信、可回放；
4. 可按表/操作/条件订阅；
5. 运行历史可观测；
6. 能识别“旧值/新值”。

#### 建议模型：业务事务内 outbox

在租户数据库建立应用自有 outbox（由应用迁移拥有，不由平台硬编码）：

```sql
create table app.outbox (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  aggregate_type text not null,
  aggregate_id text not null,
  payload jsonb not null,
  headers jsonb not null default '{}'::jsonb,
  idempotency_key text not null,
  available_at timestamptz not null default now(),
  attempts integer not null default 0,
  max_attempts integer not null default 5,
  status text not null default 'pending'
    check (status in ('pending', 'claimed', 'delivered', 'dead_lettered', 'cancelled')),
  last_error text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz,
  unique (idempotency_key)
);

create index outbox_ready_idx
  on app.outbox (available_at, created_at)
  where status = 'pending';
```

业务写入与 outbox 在同一事务：

```sql
begin;
update app.orders set status = 'paid' where id = p_order_id and status = 'pending';
insert into app.outbox (topic, aggregate_type, aggregate_id, payload, idempotency_key)
values ('order.paid', 'order', p_order_id, jsonb_build_object('orderId', p_order_id), 'order.paid:' || p_order_id);
commit;
```

dispatcher（Edge Function / worker）：

```text
loop:
  claim one pending row (for update skip locked, set status=claimed)
  resolve target (内部分发 / 外部 webhook)
  send with safeOutboundFetch
  success -> delivered
  failure -> attempts+1；未达上限 -> pending + backoff；达到上限 -> dead_lettered
```

关键点：

- **outbox 是投递权威**；CDC/`pg_notify` 只能作为“有新行”的唤醒信号，不能作为唯一存储。
- **payload 是事件快照**，不是可变业务表的替代；消费方需要最新状态时，用标识回读权威表。
- **幂等键**由业务语义决定，例如 `order.paid:<order_id>:<version>`；不要用随机数。
- **顺序**：默认不承诺全局顺序；如需要按聚合根有序，使用 `aggregate_id` 分区/单并发，但不要承诺跨聚合顺序。
- **敏感数据**：outbox 是持久化数据，遵守项目数据策略；密钥/令牌不入 payload。
- **RLS**：outbox 表不授予 `anon`/`authenticated`；只允许应用 RPC/worker 访问。

#### 与现有 `webhook_outbox` 的关系

控制面 `webhook_outbox` 是成熟实现，可复用其模式，但不建议直接把租户业务事件写入控制面表：

- 控制面 outbox 适合平台事件（项目、成员、任务生命周期）。
- 租户业务事件应留在租户数据库，避免跨库事务、项目删除/恢复和 RLS 边界问题。
- 如果只是“业务事件通知外部 webhook”，可实现一个通用 `app.outbox -> project webhook` 分发器，复用 `safeOutboundFetch`、签名、重试和死信设计。

#### Lite 的改进方向

Lite 的 `WebhooksService` 可以保留为轻量开发功能，但要明确：

- 当前是 best-effort；进程重启可能丢事件。
- 若需要与全量平台一致的语义，增加 `app.outbox` 或 `supacloud_outbox` 表，由 `WebhooksService` 从持久队列消费，而不是直接在 CDC 回调里 `fetch`。
- 保留 CDC 仅作为 wakeup；不要让 `pg_notify` 承担持久化。

#### 验收

```gherkin
Scenario: 提交后崩溃仍能投递
  Given 业务事务写入订单并写入 outbox 后进程崩溃
  When worker 重启
  Then outbox 中未投递的行仍会被 claim 并投递

Scenario: 重复投递可被消费方去重
  Given 同一 idempotency_key 被投递两次
  When 消费方处理
  Then 只产生一次业务效果

Scenario: 死信可见
  Given 外部端点持续 500
  When 达到 max_attempts
  Then 事件进入 dead_lettered
  And 控制台/CLI 可查看错误并手工重放

Scenario: 跨租户隔离
  Given 租户 A 的 outbox 行
  When 租户 B 的 worker 或用户访问
  Then 不可见、不可 claim
```

### 4.6 元数据、迁移、allowlist 与 API 限制

#### 现状

- `@supacloud/db` 有 `db.manifest.json`：表、策略、函数、触发器、grant 的所有权与依赖。
- Compiler 有 `app.manifest.json`：模块、Provider、Controller、Command、Job、路由契约。
- GraphQL 有 `graphql.manifest.json`：schema hash、operation 名称/位置、`persisted_operations`（带 SHA-256）。
- `graphql/policy.json` 支持 operations allowlist、maxDepth、maxFields、maxComplexity、maxPageSize。
- 运行时已有 PostgREST `db-max-rows`、GraphQL body 上限、statement timeout、慢查询阈值。

#### 借鉴 Hasura 的点

Hasura metadata 的价值在于：**一个可 diff、可版本化、可回滚的 API 面描述**。SupaCloud 不需要 Hasura metadata server，但需要把分散的 manifest 收敛成可审查的“项目 API 清单”。

#### 建议：增加只读的 API 发布清单

不要新建一套运行时 metadata，而是把现有事实聚合成一个只读报告：

```json
{
  "version": 1,
  "projectRef": "demo",
  "exposedSchemas": ["public", "api", "graphql_public"],
  "database": {
    "manifest": "db.manifest.json",
    "roles": ["anon", "authenticated", "service_role"]
  },
  "graphql": {
    "schemaHash": "...",
    "operations": ["OrderList", "OrderDetail"],
    "persistedOperations": [
      { "name": "OrderList", "sha256": "..." }
    ]
  },
  "schedules": ["daily-report"],
  "actions": ["payment.refund"],
  "eventTriggers": ["order.paid"],
  "limits": {
    "maxRows": 1000,
    "maxGraphqlDepth": 8,
    "maxGraphqlFields": 80,
    "maxGraphqlComplexity": 120,
    "statementTimeoutMs": 30000
  }
}
```

该清单用于：

- 发布前 diff：新增/删除/改类型/改角色/改限制；
- 迁移评审：数据库对象与 API 面是否同步；
- AI 上下文：给 Agent 一个稳定、脱敏的能力投影；
- 控制台展示：项目实际暴露了哪些 schema、operation、schedule、action；
- 审计：不是“代码里写了什么”，而是“这次发布实际声明了什么”。

#### allowlist 真正落地

当前 `persisted_operations` 只是生成物，`policy.json` 是编译期门禁，运行时仍可能收到手写 query。建议分两层：

1. **编译期**：保留现有 Compiler 校验，未知 operation、超预算、手写 mutation 直接失败。
2. **运行时**：在 GraphQL 入口增加可选 allowlist：
   - 计算请求 document 的规范化 hash；
   - 匹配已发布的 `persisted_operations`；
   - 可选要求 `operationName` 与 hash 同时匹配；
   - 未命中返回 `GRAPHQL_OPERATION_NOT_ALLOWED`，不执行 SQL。

注意：

- 只按 `operationName` 放行不够，名称可伪造；必须校验 document/hash。
- allowlist 是发布策略，不是授权；即使 operation 在 allowlist，仍要经过 RLS/grants。
- 生产环境默认不开放 introspection；开发环境可显式开启。
- 如果使用 CDN/网关缓存，不能把 allowlist 结果与用户身份混用。
- Management API 进程内 allowlist 缓存保留 5 秒 TTL 作为兜底，但配置提交后会通过 PostgreSQL `NOTIFY supacloud_graphql_allowlist` 立即清除所有进程的对应项目缓存，不需要把 TTL 降到 0。
- 角色矩阵是诊断页，默认分页 100 张表；支持 `tables`、`limit`、`offset`，大 schema 下只查询指定表或当前页。

#### API 限制的分层

| 层 | 负责 | 示例 |
| --- | --- | --- |
| 网关 | 请求大小、速率、并发、租户配额 | body 上限、每秒请求数、GraphQL 深度快速拒绝 |
| 运行时 | 协议校验、operation allowlist、超时 | `graphql.resolve` 前检查、statement timeout |
| 数据库 | 行数、计划成本、RLS、函数权限 | `db-max-rows`、`statement_timeout`、`security invoker` |
| 业务 | 语义上限 | 最大时间范围、最大导出条数、分页大小 |

不要只做其中一层：编译期通过不代表运行时安全；网关拒绝不代表数据库函数不能被直接调用。

#### 迁移与 Hasura metadata 导入

如果要从 Hasura 迁移，建议沿用“**导出为 review-only 工件，不自动执行**”的原则：

- 表/列/关系：转成 SQL 迁移草案，人工审查后应用。
- 权限：只生成 RLS `ENABLE` 与策略骨架，`USING`/`WITH CHECK` 必须人工补全；绝不做“metadata 直接等价翻译”。
- Actions/Remote Schemas/Event Triggers：导出为文档清单，逐项映射到 Command/Function/Outbox，不生成可执行 DDL。
- allowlist/limits：映射到 `graphql/policy.json` 与项目配置。

迁移完成后，用 `db matrix`、角色化 GraphQL 快照、RLS Tester 和真实查询回放做验收；不要以“metadata 导入成功”作为迁移完成标准。

## 5. 分阶段路线图

### P0：先把“可解释”补齐（低风险、复用现有代码）

| 工作 | 落点 | 产出 |
| --- | --- | --- |
| 聚合契约样例与规范 | `docs/database-governance.md`、示例迁移 | `api` schema 下的 view/RPC 模板、权限测试 |
| 角色矩阵报告 | `packages/db` 新增只读 report | `db matrix` 输出表 × 角色 × 操作 |
| RLS Tester claims 预览 | `packages/management-api/src/routes/database.ts` | role + claims 的只读诊断 |
| GraphQL allowlist 运行时开关 | GraphQL 入口/网关 | 未发布 operation 拒绝执行 |
| 定时 run 账本（只记录） | `scheduled-function.worker` + 控制面表 | 每次触发有 run 记录、错误、耗时 |

P0 不改变现有 API 契约，风险最低，但能立即提升可审查性和故障定位能力。

### P1：把异步可靠性补齐

| 工作 | 落点 | 产出 |
| --- | --- | --- |
| 调度器改用 `next_run_at` + SKIP LOCKED | `scheduled-function.worker` | 多实例安全、减少漏跑 |
| 调度重试/死信/回放 | 新 run dispatcher | 与 webhook_outbox 一致的语义 |
| 通用业务 outbox 模板 | 应用迁移模板 + worker 示例 | 业务事件可靠投递 |
| 外部 Action adapter 模板 | `packages/commands` / 应用示例 | 超时、重试、幂等、对账 |

### P2：产品化与体验

| 工作 | 落点 | 产出 |
| --- | --- | --- |
| 控制台 schedule run 页面 | Web Console | 运行历史、重试、死信、手工触发 |
| 控制台权限矩阵/角色预览 | Web Console | 接近 Hasura 的可解释体验 |
| API 发布清单 diff | CLI/Management API | 迁移与发布门禁 |
| Hasura 迁移导入增强 | CLI migration-import | review-only 工件 + 映射建议 |

## 6. 明确不做的事

1. **不实现 Hasura metadata server**：不提供运行时动态改 schema、动态加 resolver 的管理面。
2. **不实现第二套 GraphQL 执行器**：`pg_graphql` 仍是唯一数据库 GraphQL 执行器；Actions 不塞进 `graphql.resolve`。
3. **不把业务权限放进 JWT 或 metadata**：JWT 只携带身份与粗粒度声明；对象级授权由 RLS/RPC 在事务内决定。
4. **不允许租户配置任意 SQL/URL/header 的触发器**：调度 target 与外部 endpoint 必须是受控类型/受控配置，出站经过 allowlist 与 SSRF 防护。
5. **不承诺 exactly-once**：所有异步链路按 at-least-once + 幂等键设计。
6. **不复制 Remote Schemas/remote joins**：跨服务组合放在 BFF/Elysia 或应用适配层，除非未来有独立 ADR 证明需要联邦。
7. **不把 GraphQL subscriptions 混入 HTTP GraphQL 契约**：实时能力继续由 Realtime 承担。
8. **不为了“统一”而迁移已有 REST/Command 项目**：GraphQL、聚合、Actions 都是可选能力，按需启用。

## 7. 关键设计决策摘要

| 决策 | 选择 | 理由 |
| --- | --- | --- |
| 权限权威 | PostgreSQL RLS/grants/RPC | 可执行、可测试、事务内即时生效 |
| 权限体验 | 角色矩阵 + 角色预览 + 拒绝解释 | 借鉴 Hasura 的产品化，不复制引擎 |
| 聚合 | SQL view/RPC + 类型契约 | 口径集中、可下推、可限制成本 |
| GraphQL | `pg_graphql` + 编译期治理 + 可选运行时 allowlist | 避免第二 resolver |
| 定时 | 控制面持久化 scheduler + PGMQ/任务入口 | 不依赖租户 `pg_cron`，可多实例 |
| 外部 REST | Command/Function + adapter + 出站策略 | 统一授权、幂等、观测 |
| 事件 | 事务内 outbox + worker | 可靠、可回放、可隔离 |
| 声明式清单 | 现有 manifest 聚合为只读 API 清单 | 可 diff、可审计，不引入动态 metadata |

## 8. 代码落点索引

### 已有实现（可直接复用/扩展）

- 数据库治理：`packages/db/src/module.ts`、`packages/db/src/manifest.ts`、`packages/db/src/reconcile.ts`、`packages/db/src/lint.ts`
- GraphQL 治理：`packages/compiler/src/graphql-governance.ts`、`docs/graphql-query-contracts.md`、`docs/graphql-compatibility-governance.md`
- RLS Tester：`packages/management-api/src/routes/database.ts`
- Command 授权：`packages/elysia/src/supauth-command-authorizer.ts`、`docs/authorization-boundary.md`
- 定时函数：`packages/management-api/src/routes/scheduled-functions.ts`、`packages/management-api/src/services/scheduled-function.service.ts`、`packages/management-api/src/workers/scheduled-function.worker.ts`、`packages/management-api/src/utils/scheduled-function-cron.ts`
- Webhook outbox：`packages/management-api/src/services/webhook-delivery.service.ts`、`packages/management-api/src/db/platform-v2.ts`、`packages/management-api/src/workers/webhook-delivery.worker.ts`
- 安全出站：`packages/management-api/src/utils/outbound-http.ts`
- Lite 运行时：`packages/supacloud-lite/src/runtime/cron/service.ts`、`packages/supacloud-lite/src/runtime/net/service.ts`、`packages/supacloud-lite/src/runtime/webhooks/service.ts`、`packages/supacloud-lite/src/runtime/graphql.ts`
- 异步执行边界：`docs/durable-workflows.md`、`docs/async-api-and-worker-boundaries.md`、`docs/application-platform-primitives.md`

### 建议新增（按优先级）

- `packages/db/src/matrix.ts`：角色 × 表 × 操作矩阵报告。
- `packages/management-api/src/services/scheduled-job-run.service.ts`：调度 run 账本与 claim/retry。
- `packages/management-api/src/workers/scheduled-job-dispatcher.worker.ts`：从 run 到 Function/Command 的分发。
- 应用模板：`supabase/migrations/*_outbox.sql`、`supabase/functions/app-worker/outbox.ts`。
- `packages/compiler`：API 清单聚合与 diff（复用现有 manifest，不新建运行时）。

## 9. 最终验收清单

- [ ] 聚合查询有明确的 SQL 契约、角色测试和成本上限。
- [ ] 任一角色都能通过矩阵/预览回答“能读什么、能写什么、为什么被拒绝”。
- [x] 定时任务有持久化 run 记录、唯一 `(project_ref, schedule_id, scheduled_for)`、重试/死信；回放仍只通过手工触发。
- [x] 多实例调度不会重复生成同一次运行。
- [ ] 外部 Action 有超时、重试、幂等/对账、出站 allowlist 和 SSRF 防护。
- [ ] 业务事件由事务内 outbox 投递，CDC 只做 wakeup。
- [x] GraphQL 可选 allowlist 在运行时校验 document/hash，而不是只校验 operationName；配置变更跨进程即时失效。
- [ ] 所有异步链路明确 at-least-once，不宣称 exactly-once。
- [ ] 不引入第二套 GraphQL resolver、权限数据库或调度器。
- [ ] 迁移/发布前能 diff API 清单，并在测试环境完成真实 PostgreSQL + RLS + 角色快照验收。

## 10. 一句话总结

Hasura 值得学的是“把数据库能力做成有契约、有权限、有运行历史、有回放的产品”；SupaCloud 应把这些能力分别落到 **SQL 治理、Compiler 契约、控制面调度、PGMQ/outbox 和 Edge Functions** 上，而不是再造一个 Hasura。
