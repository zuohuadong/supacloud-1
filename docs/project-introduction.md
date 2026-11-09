# SupaCloud 项目详细介绍

> 本文基于仓库当前 `main` 分支的源码、包清单和文档整理，用于帮助新成员、运维人员和架构评审者快速理解 SupaCloud 是什么、由哪些部分组成、如何运行，以及它明确不承诺什么。具体版本、兼容性和验收结论以仓库中的发布清单与验收记录为准。

## 1. 项目概览

SupaCloud 是一个**可自托管的多项目应用平台**。它让团队在自己的服务器或集群上，以统一的方式运行、隔离、交付和运维多个 Supabase 风格的项目。

它要解决的不是“再实现一个 Supabase”，而是把自托管场景中容易被忽略、却必须长期承担的工作产品化：

- 多个项目如何在同一套基础设施上隔离；
- 每个项目的数据库、REST、Auth、Storage、Realtime、Functions 如何生成和编排；
- 项目如何拥有独立域名、TLS、限流和路由；
- 前端、边缘函数、数据库迁移如何以不可变版本交付；
- 后台任务、定时任务、队列和日志如何被统一观察；
- 平台如何安装、升级、备份、恢复和诊断；
- 开发者与 AI 如何在明确的模块边界内构建业务应用。

一句话概括：

> **SupaCloud 是一个自带控制面、Web 控制台、项目 CLI、运维 CLI、边缘函数运行时、前端托管和可观测性能力的自托管多租户 PaaS，目标是在自有基础设施上运营多个 Supabase 兼容项目。**

## 2. 核心亮点

> 下面的“亮点”描述的是平台的设计侧重与仓库中已经落地的主要能力，不等同于“全部已通过生产验收”。具体证据状态仍以发布清单、验收记录和稳定基线为准。

| 亮点 | 一句话价值 |
| --- | --- |
| 多项目自托管是一等产品 | 不是把一套 Supabase 跑起来，而是运营很多套隔离项目 |
| 项目级真隔离 | 数据库、进程、JWT、路由、存储、Worker 能力逐项目收敛 |
| 控制面 + 控制台 + 双 CLI 闭环 | 不登录服务器、不访问仓库也能完成大部分运营与开发工作 |
| 不可变交付与激活读回 | 函数、前端、迁移都有版本身份，减少“发布成功但实际未生效” |
| 内置任务与队列体系 | 后台函数、定时任务、PGMQ、DLQ、任务回执与进度事件开箱可用 |
| 前端托管进入平台 | 静态站点、域名、Git Webhook 与后端项目共用一套交付面 |
| 运维级升级与恢复契约 | 升级锁、产物验证、恢复回执、RPO/RTO 与证据状态被显式建模 |
| 可观测性内建 | VictoriaLogs、指标、SLO、日志流与 Drain 形成统一运维视图 |
| 可选的应用工程层 | 编译期 DI、静态 AOP、模块边界与生成客户端，不污染平台基础 |
| Lite 的本地优先路径 | 无 Docker、单进程、单项目，复用 Supabase 客户端与目录约定 |
| 中国区认证能力 | 微信、支付宝、钉钉等 Provider 与统一身份边界 |
| 明确说“不” | 对 HA、兼容性、恢复、安全边界给出可验证的限定而非夸大 |

### 2.1 多项目自托管是一等产品

很多自托管方案解决的是“如何把服务跑起来”，SupaCloud 解决的是“如何长期运营很多项目”。项目创建、隔离、域名、运行时生成、发布、日志、备份、升级和恢复都在同一个控制面中建模。

这意味着平台不是一组互不相干的脚本集合，而是有统一项目账本、操作意图、状态读回和对账机制的产品。

### 2.2 项目级真隔离，而不是逻辑标签

每个项目默认拥有：

- 独立数据库 `supa_<ref>` 与独立数据库角色；
- 独立 PostgREST / GoTrue 进程与端口；
- 独立 JWT Secret，形成认证密码学边界；
- 独立 Caddy 路由、域名、CORS 与限流；
- 独立 Storage 命名空间，或独立 S3 绑定；
- 独立函数、任务、日志与发布记录；
- 请求级、项目作用域的 Worker 能力，而不是共享数据库凭据。

隔离不是靠一个 `project_id` 字段完成的，而是贯穿数据库、进程、密钥、网络路由和执行上下文。

### 2.3 控制面 + 控制台 + 双 CLI 的完整闭环

| 入口 | 解决的问题 |
| --- | --- |
| Management API | 自动化、集成、平台内部编排 |
| Web Console | 人类可读的项目与平台运维界面 |
| `supacloud-cli` | 项目开发者的日常开发、部署、数据库、函数、前端与日志 |
| `supacloud-admin` | 运维人员的安装、升级、SSH 诊断与平台级项目生命周期 |

三套入口共享同一套项目身份和后端契约，而不是各自维护一份“影子配置”。同时，CLI 的权限边界被刻意拆开，避免项目开发者误触平台级操作。

### 2.4 不可变交付、激活读回与对账

SupaCloud 对“发布”有一套一致的处理方式：

1. 构建不可变产物；
2. 计算摘要并记录版本身份；
3. 创建激活记录；
4. 清除旧缓存并预热新版本；
5. 读回真实激活状态；
6. 对丢失或未知结果先对账，再允许新的变更。

函数使用带摘要的激活产物与 Linux 文件描述符绑定；前端使用不可变归档哈希与 compare-and-swap 激活；数据库迁移有迁移账本和锁。它们共同降低“接口返回成功，但线上仍是旧版本”的风险。

### 2.5 函数、任务、队列与定时执行的统一体系

SupaCloud 没有把长时间工作塞进 HTTP 请求，而是提供完整的执行面：

- Edge Functions 负责短请求与路由；
- 后台函数负责异步任务、重试、取消和 DLQ；
- PGMQ 负责平台队列；
- pgflow 负责项目级持久工作流；
- `@supacloud/commands` 负责持久命令执行与恢复；
- `@supacloud/approval` 负责持久审批；
- 定时函数负责 cron 触发；
- WebSocket 与 Web Console 提供任务进度和状态视图。

平台坚持“一个操作只有一个执行所有者”，避免同一业务动作被多个执行引擎重复处理。

### 2.6 前端托管是平台能力，不是外挂

大多数自托管 Supabase 方案把前端托管留给用户自行解决。SupaCloud 把静态前端发布纳入平台：

- 上传 zip 或 Git Webhook 自动部署；
- 不可变发布与激活版本；
- 项目域名、自定义域名与证书；
- 发布历史、读回与回滚；
- 与函数、数据库迁移共用项目身份和权限边界。

这让“后端项目 + 前端站点”可以在一套控制面内完成交付。

### 2.7 运维级升级与恢复契约

SupaCloud 把“升级”和“恢复”当作需要证据的工程活动，而不是一条命令：

- 发布清单、SHA256、大小、源码提交、架构和来源验证；
- 主机级非阻塞升级锁；
- 唯一临时 systemd 单元执行事务；
- 受保护的原子状态与短 SSH 观察；
- 观察超时不等于失败；
- 二进制回滚不撤销数据库迁移；
- 恢复必须验证数据库、对象、密钥、路由、函数、队列与跨项目隔离；
- 记录实测 RPO/RTO 与未解决偏差。

这类“失败关闭”和“读回优先”的设计，是平台可运维性的核心亮点。

### 2.8 可观测性内建

平台默认提供：

- VictoriaLogs 持久化日志；
- 进程内日志采集器；
- Prometheus 指标与 SLO 规则；
- SSE 实时日志流；
- 项目日志查询与过滤；
- Webhook / Datadog / Loki / Elasticsearch 日志 Drain；
- 请求与任务追踪上下文。

日志、指标和任务事件不是部署后再补的插件，而是控制面的一部分。

### 2.9 可选的应用工程层：编译期 DI 与边界治理

应用工程层把 Angular 风格的模块、依赖注入、作用域和命令/查询分层带入 TypeScript 后端，但通过静态编译消除运行时反射：

- `@Module` / `@Injectable` / `@Inject` / `@Controller` / `@Command`；
- 编译期生成静态工厂，不做容器查找；
- 编译期拒绝循环依赖、作用域违规和模块边界违规；
- 路由 schema-first，同时驱动 handler 类型、请求校验、生成客户端和 OpenAPI；
- 内置 `modular-monolith`、`angular-enterprise`、`clean-architecture` 边界预设；
- 可选的静态 AOP 与命令治理：授权、幂等、事务、审计。

它的亮点不是“装饰器多”，而是**把架构约束变成编译错误**，同时保持平台本身不依赖这套框架。

### 2.10 Lite：无 Docker 的本地优先路径

Lite 用 Bun + PGlite 在单进程内实现 Supabase 兼容后端：

- 直接读取 Supabase CLI 目录；
- 官方 `@supabase/supabase-js` 即可连接；
- Auth 在同一进程内运行，无需 GoTrue sidecar；
- 可分发单二进制，无需预装 Bun、Node、npm 或 Docker；
- 支持迁移、seed、Storage、Realtime、Functions 与函数能力声明。

它让“本地开发环境”和“生产平台”共享协议与项目约定，同时保持独立的产品边界。

### 2.11 中国区认证与企业身份

平台内置中国区常见登录能力，并提供统一身份边界：

- 微信、支付宝、钉钉等 OAuth Provider；
- 微信小程序登录；
- 项目级 OAuth 2.1 / OIDC Provider；
- MFA、SSO、自定义 Provider、邮件模板与 Auth Hook；
- SupAuth 共享认证模式：一个项目作为认证权威，其他项目通过 JWKS 验证；
- 明确区分平台 RBAC、统一身份 subject 和业务角色。

这使企业内多应用统一登录与项目级数据隔离可以共存，而不是把全局用户目录暴露给每个租户。

### 2.12 明确说“不”的工程文化

SupaCloud 的文档反复区分：

- 已实现 / 本地验证 / 发布验证 / 生产验收；
- 备份清单成功 / 恢复成功；
- 二进制回滚 / 数据库迁移回滚；
- 控制面可用 / 数据面独立存活；
- 协议兼容 / 所有上游功能等价；
- 单机基线 / 高可用与多地域。

这种对边界的显式表达，降低了采用者把“演示能力”误当成“生产保证”的风险，也是项目最值得关注的亮点之一。

## 3. 背景与问题

官方 Supabase 提供了优秀的数据库、Auth、REST、Storage 和 Realtime 能力，但自托管形态主要解决“把一套服务跑起来”。当团队需要运营多个项目时，仍然需要自行补齐大量平台能力：

| 自托管常见缺口 | SupaCloud 的回答 |
| --- | --- |
| 多项目数据库与运行时如何隔离 | 每个项目独立的 `supa_<ref>` 数据库、PostgREST/GoTrue 进程、JWT 密钥和路由 |
| 项目如何创建、暂停、恢复、重启、删除 | Management API 提供项目生命周期与组件级控制 |
| 项目域名、TLS、CORS、限流如何管理 | Caddy Admin API 驱动的网关，按项目动态发布路由 |
| 前端和函数如何发布、回滚、验证 | 不可变发布物、激活版本、读回与对账 |
| 长任务、定时任务、失败重试如何处理 | PGMQ、后台函数、任务回执、DLQ 与 Web Console 任务视图 |
| 日志、指标、追踪如何统一 | VictoriaLogs + 内置采集器 + Prometheus 指标 + SLO 规则 |
| 升级与恢复如何避免“看起来成功” | 发布清单、校验和、来源验证、升级锁、恢复演练与证据状态 |
| 开发者如何减少重复基础设施代码 | 可选的 `@supacloud/app` / `compiler` / `elysia` 应用工程层 |

因此，SupaCloud 的产品重心是**平台运营**，而不是单点功能演示。应用框架、编译器、SDK 和 AI 工具是可选加速层，不是运行平台的前提。

## 4. 产品定位与边界

### 4.1 三个层次

SupaCloud 仓库同时包含三类产品形态，它们不是可以互相替代的“版本”：

| 层次 | 角色 | 是否运行完整平台所必需 |
| --- | --- | --- |
| **Full Platform** | 主产品：多项目控制面、运行时、交付、运维、升级与恢复 | 必需 |
| **Admin / Web Console / Project CLI** | 标准操作入口，使平台无需登录服务器或访问仓库即可运营 | 必需 |
| **Application Framework / Compiler / SDK / AI Tools** | 可选的业务应用开发加速与更强契约 | 非必需 |
| **SupaCloud Lite** | 独立的单项目、本地优先运行时 | 独立产品，不证明 Full Platform 的生产就绪 |

### 4.2 与 Supabase 的关系

SupaCloud 的目标是**项目级协议与工作流兼容**，不是复刻 Supabase Cloud 的全部商业能力：

- 兼容 `@supabase/supabase-js`、Supabase CLI 常见工作流、PostgREST、GoTrue、Storage、Realtime 等协议面；
- 提供 Supabase 自托管栈通常不附带的多租户控制面、租户路由、任务编排、前端托管和运维入口；
- 不把托管 SLA、全球基础设施、组织/计费治理、Supabase Analytics/Logflare、Iceberg 分析桶等作为当前内置能力；
- 兼容性是“有文档、有测试、有边界的兼容”，不是“所有 Supabase Cloud 功能与所有上游版本均等价”。

### 4.3 明确的非目标

- 单机基线不承诺高可用、多节点调度或多地域容灾；
- 不把内存测试当作 PostgreSQL 原子性或真实 S3 行为的证明；
- 不把“备份清单成功”当作“恢复成功”；
- 不把“合并到 `main`”当作“已经发布”；
- 不把嵌入模式与外部 Edge Runtime 模式视为可互换的升级证据；
- 不替业务应用决定成员关系、对象权限和业务状态机。

## 5. 目标用户与典型场景

### 5.1 目标用户

- **平台运维团队**：需要在一台或一组自有服务器上运营多个客户/业务项目；
- **企业内部的平台工程团队**：希望统一数据库、认证、函数、前端交付和日志入口；
- **需要数据主权与私有化部署的组织**：不希望把控制面和业务数据交给托管服务；
- **使用 AI 辅助开发的团队**：希望在明确的模块、类型和编译诊断约束下生成与修改代码；
- **独立开发者/小团队**：可用 Lite 在本地或小规模环境获得 Supabase 兼容后端。

### 5.2 典型场景

1. **多租户 SaaS 的私有化底座**：每个客户或工作区一个项目，统一控制面运营。
2. **企业内部应用平台**：多个业务系统共享一套数据库集群、认证、函数和前端托管。
3. **交付型项目环境**：为不同客户创建隔离项目，按版本发布前端、函数与迁移。
4. **AI 辅助业务开发**：用 starter、编译器和上下文投影降低重复脚手架与跨模块错误。
5. **本地优先开发**：用 Lite 在没有 Docker 的环境中运行单项目后端。

## 6. 总体架构

### 6.1 逻辑分层

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         操作与开发入口                               │
│  Web Console (SvelteKit)   supacloud-cli   supacloud-admin   MCP    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ HTTPS / CLI / SSH
┌───────────────────────────────▼─────────────────────────────────────┐
│                         控制面 Control Plane                        │
│  Management API (Bun + Elysia)                                      │
│  ├─ 项目生命周期 / 配置 / 组织 / 协作者 / RBAC                       │
│  ├─ 数据库 / Auth / Storage / Functions / Frontend 编排              │
│  ├─ 发布、激活、迁移账本、审计、诊断、备份与恢复                     │
│  ├─ SSE 日志 / WebSocket 任务事件 / 静态资源                        │
│  └─ 后台 Worker：队列、定时任务、Webhook、对账、日志转发             │
└───────────────┬───────────────────────────────┬─────────────────────┘
                │ 发布路由 / 启停 / 生成配置      │ 任务与事件
┌───────────────▼──────────────┐   ┌────────────▼─────────────────────┐
│       Caddy Gateway          │   │  Edge Runtime (Bun + Elysia)     │
│  TLS / 路由 / CORS / 限流     │   │  Worker Thread Pool / Preheat    │
└───────┬──────────┬───────────┘   └────────────┬─────────────────────┘
        │          │                            │ 项目作用域能力
┌───────▼───┐ ┌────▼──────────┐        ┌────────▼─────────────────────┐
│ PostgREST │ │ GoTrue        │        │ pgredis-runtime              │
│ 每项目实例 │ │ 每项目/共享   │        │ 租户连接池 + L1 + NOTIFY     │
└───────┬───┘ └────┬──────────┘        └────────┬─────────────────────┘
        │          │                            │
┌───────▼──────────▼────────────────────────────▼─────────────────────┐
│                    PostgreSQL（Pigsty / PGlite）                     │
│  每项目独立数据库 supa_<ref>、auth/storage 元数据、RLS、RPC、PGMQ    │
└─────────────────────────────────────────────────────────────────────┘
```

### 6.2 控制面与数据面

**控制面**负责：

- 项目身份、归属、状态和资源绑定；
- 平台与项目配置；
- 发布与激活记录；
- 操作意图、进度、结果和对账；
- 备份清单、恢复计划与恢复回执；
- 授权、审计和面向运维的诊断。

每个变更操作应遵循统一语义：

1. 校验授权与前置条件；
2. 持久化操作意图和稳定变更标识；
3. 只执行可安全重试的步骤；
4. 读回真实资源状态；
5. 对丢失或未知响应先对账，再允许新的变更；
6. 报告成功、可恢复失败或需要人工处理的结果。

**数据面**承载项目流量：

- Caddy → PostgREST / GoTrue / Storage / Functions / Realtime；
- 每项目 PostgreSQL 数据库；
- Edge Runtime 函数执行；
- pgredis 私有缓存数据面；
- PGMQ 队列与后台任务。

当前部分公共 Functions、Realtime 和 Storage 请求仍经过 Management API。因此“控制面故障时数据面独立存活”是目标验收属性，不是当前无条件保证。

## 7. 核心子系统

### 7.1 Management API

`packages/management-api` 是平台控制面的核心，使用 **Bun + Elysia** 构建，可编译为独立二进制运行。

主要职责包括：

- 项目 CRUD、暂停/恢复/重启、配置、端点与能力；
- 数据库创建、迁移、schema 元数据、扩展、RLS/RPC 治理；
- Auth 配置、用户、MFA、SSO、OAuth/OIDC、微信/支付宝/钉钉等中国区登录；
- Storage 兼容 API、S3 绑定、签名上传、对象元数据；
- Edge Functions 部署、激活、预热、日志与生命周期；
- 前端托管、发布、域名、Git Webhook 自动部署；
- 任务、队列、定时函数、后台函数、DLQ；
- 备份、恢复、分支、JIT 数据库访问、数据库主版本升级；
- 审计、诊断、平台设置、组织、协作者、RBAC；
- SSE 日志流、WebSocket 任务事件、OpenAPI 与路由契约。

其路由按领域拆分在 `src/routes`，领域逻辑位于 `src/services`，持久化与 SQL 模块位于 `src/db`，后台任务位于 `src/workers`。这种分层使“API 契约、业务编排、基础设施操作”保持可审计的边界。

### 7.2 Web Console

`packages/web-console` 是自托管 Web 控制台，使用 **SvelteKit + Svelte 5 + Tailwind CSS + bits-ui / shadcn 风格组件**，并集成 `@svadmin/*` 管理框架。

主要页面域：

- 登录与平台级入口；
- 项目列表与项目创建；
- 单项目工作区：数据库、Auth、Storage、Functions、前端、日志、任务、设置等；
- 平台运维：备份、缓存、诊断、扩展、监控、操作、连接池、存储、调优、设置。

控制台并不直接持有租户数据库凭据。它通过经过认证的 Management API 代理访问项目资源，浏览器不会获得内部服务令牌，也不会连接 pgredis 等私有端口。

### 7.3 命令行入口

SupaCloud 刻意区分三个本地命令面，避免“一个 CLI 包办所有事情”导致权限和操作边界模糊：

| 命令 | 面向对象 | 典型职责 |
| --- | --- | --- |
| `supacloud-cli`（`@supacloud/cli`） | 项目用户与开发者 | 状态、部署、数据库查询与迁移、函数、前端、日志、存储、AI Skill 安装 |
| `supacloud-admin`（`@supacloud/admin`） | 平台运维 | 安装、升级、SSH 诊断、平台级项目生命周期 |
| `supacloudctl`（`supacloud` npm 包） | 本地调度器 | 在已安装的两个 CLI 之间分发，不是服务器二进制 |

`/usr/local/bin/supacloud` 是编译后的服务器二进制名称，不是项目 CLI 的别名。

`supacloud-cli` 默认按项目作用域工作：

- 优先读取当前工作区 `.env`；
- 使用 `SUPABASE_URL` 或 `SUPACLOUD_API_URL`；
- 使用 `SUPABASE_SERVICE_ROLE_KEY` 或 `SUPACLOUD_API_TOKEN`；
- 可从租户 API 域名推导 Management API 主机和项目 ref；
- 支持 `--ref` 显式指定项目。

### 7.4 Caddy 网关

网关以系统服务方式运行 Caddy，并通过 **Caddy Admin API** 发布 JSON 配置，而不是手工编辑生产 Caddyfile。

能力包括：

- 每项目路由与域名；
- 自动 HTTPS / ACME；
- 安全响应头、Gzip、CORS；
- 每项目限流（预设档位或自定义秒/分/小时配额）；
- `/api/*`、`/functions/*`、`/realtime/*` 等流量分区；
- 路由健康检查与对账。

把网关配置纳入控制面后，项目创建、域名变更、限流调整都可以通过 API 完成，并留下可审计的状态。

### 7.5 PostgREST 与 GoTrue 运行时

每个项目默认拥有自己的 PostgREST 与 GoTrue 进程：

- 通过 systemd 模板单元动态启动；
- 使用确定性端口段（PostgREST 从 3100 起，GoTrue 从 4100 起）；
- 连接项目独立数据库 `supa_<ref>`；
- 使用项目独立 `JWT_SECRET`，形成密码学隔离；
- PostgREST 具备独立的暂停、恢复、状态和重启生命周期；
- PostgREST 的 desired state 存储在项目元数据中，由运行时 worker 对账到实际 systemd 状态。

Auth 支持两种显式模式：

- **Local 模式（默认）**：项目拥有自己的 GoTrue 进程与 `auth` schema；
- **SupAuth 共享模式**：指定一个项目作为认证权威，其他项目不启动本地 GoTrue，其 `/auth/v1` 流量路由到 owner 的 GoTrue。

共享模式有严格约束：只有 owner 能管理用户、Provider、OAuth Client、MFA、SSO 等；依赖项目隐藏并阻止 GoTrue 配置页；owner 必须使用 ES256/RS256 等非对称签名，以便依赖项目通过 JWKS 验证；依赖项目仍以本地数据库作为业务数据、成员关系和 RLS 的权威。

### 7.6 Storage 与项目级 S3

Storage 通过 Management API 提供 Supabase 兼容接口：

- 租户解析来自可信项目头、API Key 或 Host 路由，并拒绝不一致；
- 签名上传 URL 是一次性令牌，在接受上传体前原子消费；
- 元数据写入租户数据库并应用 RLS 上下文；
- 上传/移动路径在元数据持久化失败时可登记补偿清理；
- 对象列表在 SQL 中分页排序，避免把全量对象加载进内存。

每个项目可以绑定**一个 S3 兼容后端**，拥有独立 endpoint、凭据、物理 bucket 和根前缀。该项目的所有逻辑 bucket 共用这个绑定。未绑定项目继续使用平台既有驱动和对象布局；绑定被禁用、无效或故障时**不会回退到全局存储**。

绑定是管理员操作。已有平台对象需要按文档执行迁移接管，并在静默窗口内完成切换。这不是 bucket 级后端选择、复制、自动故障转移或对所有 S3 Provider 的一致性承诺。

### 7.7 Edge Runtime 与函数

Edge Functions 使用 **Bun + Elysia Worker Thread Pool**：

- 默认嵌入 `supacloud.service`，也可由独立的 `supacloud-edge-runtime.service` 以外部模式运行；
- 两种模式互斥，不能同时占用配置端口（默认 `9005`）；
- 固定 Worker 线程池与 LRU 缓存，200 个函数约 140MB 内存；
- 冷启动通常 8–15ms，部署后预热可做到首请求 0ms 冷启动；
- 提供 `globalThis.Deno` 兼容层、URL import 映射和 npm 依赖自动扫描；
- 支持 bare handler、Elysia、Hono、SvelteKit API-only 等函数形态；
- 支持函数级超时、请求/响应体上限、出站 host 白名单、secret 白名单和 `waitUntil` 能力声明。

部署流程的关键点是“不可变”和“读回”：

1. `Bun.build()` 打包为自包含 `.js`；
2. 生成带摘要的不可变激活产物；
3. 清除旧版本 Worker 缓存；
4. 预热新模块；
5. 激活权威记录摘要校验；
6. 读回激活版本与健康状态。

在 Linux 上，运行时通过持有可信目录链和文件描述符，并经 `/proc/self/fd` 导入，确保实际执行的模块与验证过的 inode 一致。非 Linux 平台可以运行旧式非 attested 函数，但权威 attested 激活会失败关闭。

### 7.8 后台任务、队列与定时函数

SupaCloud 把“函数调用”扩展为可运营的任务模型：

- 后台函数调用返回任务回执；
- 支持轮询、取消、重试、DLQ 与生命周期 Webhook；
- PGMQ 作为平台队列；
- pgflow 用于项目级持久工作流；
- `@supacloud/commands` 提供与存储无关的持久命令执行与恢复；
- `@supacloud/approval` 提供 PostgreSQL 持久审批；
- 定时函数基于 cron 触发；
- Web Console 提供任务状态与事件视图；
- WebSocket `/ws/tasks` 推送任务进度。

平台坚持“一个操作只有一个执行所有者”：默认使用 Workflows，显式集成 pgflow/approval，避免同一业务动作被多个执行引擎重复处理。

### 7.9 前端托管与发布

平台内置 Pages 风格静态前端托管：

- 支持直接上传 zip 与 Git Webhook 自动部署；
- 发布物使用不可变归档哈希；
- 激活使用 compare-and-swap，避免并发覆盖；
- 支持项目域名、自定义域名与证书；
- 支持发布列表、读回与回滚；
- 前端发布与函数发布共享“不可变交付物 + 激活记录”的思路。

### 7.10 pgredis 私有缓存数据面

`pgredis-runtime` 是私有缓存数据面：

- 拥有每租户 PostgreSQL 连接池与有界 L1 缓存；
- Edge Worker 只拿到当前请求短期的项目作用域能力，不持有数据库凭据；
- 租户凭据来自运行时专属的 `/etc/supabase/pgredis-tenants/<ref>_pgredis.env`；
- 变更与失效通知在同一 PostgreSQL 事务中提交；
- 重连后先清空租户 L1 再恢复读；
- Web Console 只能通过认证的 Management API 代理执行有界操作；
- 不实现队列或平台限流，PGMQ 与 Caddy 仍是各自能力的唯一所有者。

### 7.11 可观测性

可观测性基线由以下部分组成：

- **VictoriaLogs** 持久化日志；
- 进程内采集器收集项目与平台日志；
- **Prometheus 指标**与 SLO 规则；
- SSE 实时日志流（host systemd profile）；
- 可配置日志 Drain：Webhook、Datadog、Loki、Elasticsearch；
- 项目日志查询、时间范围与服务过滤；
- 请求/任务追踪与执行上下文。

Compose 形态只持久化 Edge Function 日志，因为其没有可信的租户级 journal 来源。平台明确不依赖 Supabase Analytics/Logflare。

### 7.12 备份、恢复与升级

平台把“发布”“项目应用发布”“基础设施升级”“恢复回执”分开记录：

| 术语 | 含义 |
| --- | --- |
| 平台发布 | Management API、Web Console、运行时产物、配置契约和支持组件版本的已验证组合 |
| 项目应用发布 | 函数、前端资产、运行时配置、迁移清单等不可变项目产物集合 |
| 基础设施升级 | Pigsty、PostgreSQL、Caddy、GoTrue、Realtime、存储或操作系统的独立迁移与回滚边界 |
| 恢复回执 | 指定快照被恢复并验证的证据，包括实测 RPO/RTO 与未解决偏差 |

关键原则：

- 二进制回滚不能撤销数据库迁移或外部副作用；
- 项目恢复不等于集群 PITR；
- 备份清单成功不等于恢复成功；
- 升级使用主机级非阻塞锁、唯一临时 systemd 单元、受保护原子状态；
- 观察超时不停止事务，也不等于失败；
- 生产服务器不需要 `git pull` 应用源码；
- 发布产物需要 SHA256 与构建来源验证，离线验证使用受信任的 Sigstore 根。

### 7.13 应用工程层（可选）

应用工程层把 Angular 风格的工程模型带入 TypeScript 后端，但通过静态编译消除运行时反射：

```text
Angular 风格源码（装饰器）
  → @supacloud/compiler（AST 分析 + 依赖图 + 校验）
    → 生成的静态工厂（无反射、无容器查找）
      → @supacloud/elysia（Elysia 插件适配）
        → Edge Runtime（framework: "elysia"）
```

核心包：

| 包 | 职责 |
| --- | --- |
| `@supacloud/app` | `@Module`、`@Injectable`、`@Inject`、`@Controller`、`@Command`、`@Query`、InjectionToken、Scope、内置 Token |
| `@supacloud/compiler` | 依赖图、循环依赖/作用域/模块边界校验、静态工厂与 manifest 生成 |
| `@supacloud/elysia` | 将编译产物适配为 Elysia 插件，管理 application/request 作用域与路由校验 |
| `@supacloud/supacloud-js` | 基于 `supabase-js` 的平台 SDK，覆盖任务、生命周期 Webhook、队列和 OAuth |
| `@supacloud/query` | 面向过程客户端的 TanStack Query 适配与显式失效标签 |
| `@supacloud/testing` | Provider 覆盖、HTTP 测试助手、SQL/RLS 测试运行器 |
| `@supacloud/db` | 将 RLS、RPC、Grant 作为一等资源，提供 manifest/catalog 对账 |
| `@supacloud/commands` | 持久命令执行与恢复 |
| `@supacloud/approval` | PostgreSQL 持久审批 |

作用域规则在编译期检查：

| Scope | 生命周期 | 允许依赖 |
| --- | --- | --- |
| `application`（默认） | 整个 Function 实例 | 仅 `application` |
| `request` | 单次 HTTP 请求 | `application`、`request` |
| `job` | 单次后台任务 | `application`、`job` |

编译器会拒绝 application provider 依赖 request provider 等作用域违规，防止用户/租户上下文泄漏到长生命周期对象。

模块边界预设包括：

- `modular-monolith`：模块化单体/垂直切片；
- `angular-enterprise`：Angular/Nx 企业单仓的单向依赖；
- `clean-architecture`：Clean Architecture / DDD 分层与依赖倒置。

诊断码覆盖循环依赖、作用域违规、模块边界违规、未解析 Token、重复 Token/模块/命令/路由、路由命令未解析、命令缺少权限等。

### 7.14 SupaCloud Lite

Lite 是独立的单项目运行时：

- Bun 原生，单进程、单项目，project ref 固定为 `local`；
- 使用 PGlite 在进程内运行 PostgreSQL，也可切换 native PostgreSQL；
- 实现 REST、Auth、Storage、Realtime、Edge Functions 的 Supabase 兼容协议；
- 直接读取 Supabase CLI 目录：`supabase/config.toml`、`migrations/`、`seed.sql`、`functions/`、`webhooks.json`；
- 默认状态在 `.supacloud-lite/`；
- Auth 在同一 Bun 进程内运行，不启动 GoTrue sidecar；
- 可下载单二进制，无需预装 Bun、Node、npm 或 Docker；
- 不包含 Web 控制台或 Supabase Studio，也不是多项目控制面。

Lite 适合本地开发、小规模单项目和边缘部署，但不能作为 Full Platform 生产就绪的证明。

## 8. 技术栈

下表反映仓库当前主要依赖，具体版本以各包 `package.json` 和发布清单为准：

| 领域 | 技术 |
| --- | --- |
| 语言与运行时 | TypeScript、Bun、Node.js（CLI 发布入口） |
| 控制面框架 | Elysia 2 beta、TypeBox、OpenAPI |
| Web 控制台 | SvelteKit 3、Svelte 5、Vite 8、Tailwind CSS 4、bits-ui、`@svadmin/*` |
| 数据库 | PostgreSQL 18（Pigsty 4.5.0 基线）、PGlite（Lite） |
| 数据库 API | PostgREST、pg-meta 风格元数据 API、pg_graphql 兼容治理 |
| 认证 | GoTrue、项目级 OAuth 2.1 / OIDC、JWT/JWKS、MFA、SSO、中国区 OAuth |
| 网关 | Caddy + Admin API、自动 HTTPS、CORS、限流 |
| 边缘函数 | Bun + Elysia Worker Thread Pool、Deno 兼容层 |
| 队列与工作流 | PGMQ、pgflow、持久命令、审批 |
| 缓存 | pgredis-runtime（私有数据面） |
| 存储 | JuiceFS + PostgreSQL 元数据（默认）、项目级 S3 绑定、imagor 图像变换 |
| 可观测性 | VictoriaLogs、Prometheus、SLO 规则、SSE、日志 Drain |
| 构建与工作区 | Bun workspaces、Nx、TypeScript project references |
| 打包与发布 | 单二进制编译、npm 包、Release manifest、SHA256、Sigstore provenance |
| 部署 | systemd 原生安装、Docker Compose、Lite 单二进制 |

## 9. 仓库结构

```text
supacloud/
├── packages/
│   ├── management-api/      # 多租户控制面（Bun + Elysia）
│   ├── web-console/         # 自托管 Web 控制台（SvelteKit）
│   ├── cli/                 # 项目 CLI：supacloud-cli
│   ├── admin/               # 运维 CLI：supacloud-admin
│   ├── supacloud/           # 本地调度器：supacloudctl
│   ├── edge-runtime/        # Edge Functions 运行时
│   ├── function-adapter/    # Fetch/SvelteKit 等函数适配器
│   ├── supacloud-lite/      # 单项目 Lite 运行时
│   ├── supacloud-js/        # 平台 SDK
│   ├── app/                 # 应用元数据与装饰器
│   ├── compiler/            # 静态编译器
│   ├── elysia/              # 编译产物运行时适配
│   ├── app-svelte/          # Svelte 生命周期绑定
│   ├── db/                  # 数据库治理（RLS/RPC/Grant）
│   ├── commands/            # 持久命令执行
│   ├── approval/            # 持久审批
│   ├── query/               # TanStack Query 适配
│   ├── testing/             # 测试工具
│   ├── delivery/            # 不可变交付契约
│   ├── contracts/           # 命令协议
│   ├── worker/              # pgflow 项目 Worker
│   ├── pgflow-worker/       # pgflow 执行器
│   ├── pgredis-runtime/     # 私有缓存数据面
│   └── devtools-contract/   # DevTools 协议重导出
├── docs/                    # 产品、架构、运维、验收与迁移文档
├── scripts/                 # 构建、校验、发布、工作区与验收脚本
├── infrastructure/          # systemd、监控、恢复演练、Realtime 构建
├── infra/                   # PostgreSQL/OS 调优脚本
├── docker/                  # Compose 自托管与开发环境
├── .github/                 # CI、发布、策略与自动化
├── setup.sh                 # 服务器引导安装
├── install.sh               # 安装器
├── switch.sh                # 环境/配置切换
├── config.env               # 默认配置
└── nx.json / package.json   # 工作区与任务编排
```

### 9.1 包的分层关系

可以把仓库中的包分为五组：

1. **平台入口层**：`management-api`、`web-console`、`cli`、`admin`；
2. **运行时层**：`edge-runtime`、`function-adapter`、`pgredis-runtime`、`worker`、`pgflow-worker`；
3. **应用工程层**：`app`、`compiler`、`elysia`、`app-svelte`、`supacloud-js`、`query`、`testing`；
4. **治理与交付层**：`db`、`commands`、`approval`、`delivery`、`contracts`；
5. **独立产品**：`supacloud-lite`。

这种拆分让平台可以在不依赖应用框架的情况下运行标准 Supabase 客户端项目，也让应用框架可以独立编译和测试。

## 10. 关键工作流

### 10.1 项目创建

1. 运维或控制台提交项目创建请求；
2. Management API 校验授权、配额、域名和前置条件；
3. 创建项目记录与稳定项目 ref；
4. 创建独立数据库 `supa_<ref>`、角色与凭据；
5. 生成项目 JWT、API Key、Auth 配置；
6. 启动/生成 PostgREST 与 GoTrue 运行时；
7. 通过 Caddy Admin API 发布项目路由；
8. 初始化 Storage 元数据与默认 bucket；
9. 读回数据库、运行时、路由与健康状态；
10. 持久化操作结果，返回可诊断的项目端点。

平台要求创建过程没有未跟踪或无法解释的残留资源；失败时要能定位到具体阶段，而不是只返回一个通用错误。

### 10.2 函数部署

1. 开发者执行 `supacloud-cli deploy` 或调用部署 API；
2. 校验目标、构建命令、入口和产物；
3. 打包为不可变 bundle；
4. 创建函数版本与激活记录；
5. 清除旧缓存并预热新模块；
6. 校验激活产物摘要；
7. 读回激活版本、健康状态和日志；
8. 失败时保留可回滚的旧激活记录。

### 10.3 前端发布

1. 上传静态归档或由 Git Webhook 触发；
2. 计算不可变归档哈希；
3. 创建发布记录；
4. 使用 compare-and-swap 激活目标发布；
5. 绑定域名与证书；
6. 读回当前激活版本；
7. 需要时回滚到先前发布。

### 10.4 应用开发

1. 使用 `supacloud-cli app init` 生成 starter；
2. 在 `@supacloud/app` 中声明模块、Provider、Controller、Command；
3. 运行编译器生成静态工厂与 `app.manifest.json`；
4. 在 CI 中使用 `checkProject` 检测产物漂移；
5. 通过 `@supacloud/elysia` 在本地或 Edge Runtime 运行；
6. 使用 `@supacloud/testing` 做 Provider 覆盖、HTTP 与 SQL/RLS 测试；
7. 通过 `supacloud-cli deploy` 发布函数或前端。

### 10.5 平台升级

1. 选择已发布的 Management 与 Edge Runtime 精确版本；
2. 审阅组件升级说明、迁移与恢复要求；
3. Admin 主机下载并验证 manifest、SHA256、大小、源码提交和架构；
4. 通过 SFTP 上传到原子 staging 目录；
5. 服务器离线复核并获取 root 所有权；
6. 在唯一临时 systemd 单元中运行目标版本的升级事务；
7. Admin 通过短 SSH 调用观察状态，最长 30 分钟；
8. 读回各组件激活与健康状态；
9. 失败时按组件恢复流程处理，不盲目重试；
10. 记录回滚目标与剩余人工恢复路径。

> 观察超时不等于失败。超时后应先检查报告中的 unit、stage、status、log 和 upload-drop 路径。

### 10.6 备份与恢复

- 使用 Pigsty/pgBackRest 能力做备份清单核验、PITR 规划和恢复演练；
- 恢复必须验证数据库状态、迁移对齐、对象文件、运行时元数据、密钥、项目身份、Auth 边界、路由、函数、队列、日志与跨项目隔离；
- 记录实测 RPO/RTO 与所有未解决偏差；
- 合成本地恢复夹具只能用于回归，不构成生产恢复保证。

## 11. 部署形态

### 11.1 原生 systemd（主基线）

| 维度 | 基线 |
| --- | --- |
| 主机 | Linux + systemd |
| 主要验收 OS | Ubuntu 24.04 LTS |
| 主要验收架构 | `amd64` |
| 数据库底座 | Pigsty 4.5.0 / PostgreSQL 18 |
| 网关 | SupaCloud 管理的 Caddy systemd 服务 |
| 平台运行时 | Management API、Web Console、项目运行时、VictoriaLogs |
| 存储 | JuiceFS + PostgreSQL 元数据，或项目级 S3 绑定 |
| 产物模式 | 已发布、校验和与来源验证的 Release 产物 |
| HA | 单机基线不承诺 |

安装入口：

```bash
curl -fsSL https://raw.githubusercontent.com/vibeunion/supacloud/main/setup.sh | sudo bash
```

安装前应阅读 `setup.sh`、`install.sh` 与稳定基线文档。以 root 执行安装器属于高信任操作；生产环境应使用经过验证的发布产物，而不是不完整的源码构建。

### 11.2 Docker Compose 自托管

`docker/self-host` 提供官方 Compose 形态，包含 PostgreSQL、GoTrue、PostgREST、Management API、Caddy、VictoriaLogs 等组件。它适合希望以容器方式体验或部署的用户，但与原生 systemd 基线有不同边界：

- 日志持久化范围不同；
- 部分主机级能力不可用；
- CDC Pipelines 等能力在 Compose profile 中可能显式返回 501；
- 不能把 Compose 验收当作原生基线的等价证明。

### 11.3 Lite

```bash
bun add @supacloud/lite
bunx supacloud-lite start
```

Lite 适合本地优先、小规模单项目和无需 Docker 的场景。它不提供多项目控制面、Web 控制台或 Supabase Studio。

### 11.4 源码/开发安装

源码 checkout 不包含发布产物。需要先构建 Management API、Edge Runtime、pgredis-runtime、自定义 Caddy 和 Web Console，再显式选择本地产物模式：

```bash
sudo env SUPACLOUD_SETUP_ARTIFACT_MODE=local \
  bash install.sh --ip 203.0.113.10 --domain api.example.com --s3 juicefs
```

其中的 IP 和域名是占位符。源码构建只适合开发和受控验收，不应默认视为生产发布。

## 12. 快速开始

### 12.1 安装并运营完整平台

```bash
# 服务器上执行，执行前先阅读安装器与稳定基线文档
curl -fsSL https://raw.githubusercontent.com/vibeunion/supacloud/main/setup.sh | sudo bash
```

安装后：

- Web Console 用于平台与项目管理；
- `supacloud-admin` 用于安装、升级、SSH 诊断和平台级项目生命周期；
- `supacloud-cli` 用于单项目开发、数据库、函数、前端和日志。

### 12.2 构建一个类型化应用

```bash
npm install -g @supacloud/cli
supacloud-cli app init --root ./my-app --name my-app
cd my-app
bun install
bun run check
bun run dev
```

这会启动本地开发工作流，不是生产部署。接入真实环境前需要替换演示身份与内存适配器，并分别运行业务验收和数据库验收。

### 12.3 运行 Lite

```bash
bun add @supacloud/lite
bunx supacloud-lite start

# 另一个终端
bunx supacloud-lite keys
```

使用匿名 key 配合 `@supabase/supabase-js`；不要把 `service_role` key 放进浏览器代码。默认状态在 `.supacloud-lite/`。持久化部署应使用文档中的 `upgrade` 与快照流程。

### 12.4 项目 CLI 连接

```bash
export SUPABASE_URL="https://<project-api-domain>"
export SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"

supacloud-cli status
supacloud-cli project get
supacloud-cli project logs --log_type database
supacloud-cli database query --sql "select now()"
```

凭据应放在受控环境变量或密钥管理系统中，不要提交到源码或打包进浏览器。

## 13. 质量保障与工程约束

仓库把可验证性作为一等要求，主要质量门包括：

| 门禁 | 作用 |
| --- | --- |
| `bun run check:boundaries` | 检查工作区包边界 |
| `bun run check:invariants` | 检查业务不变量 |
| `bun run check:type-safety` | 类型安全策略检查 |
| `bun run check:public-api` | 公共 API 快照校验 |
| `bun run check:diagnostic-docs` | 诊断码文档同步检查 |
| `bun run check:workspace-sync` | starter 与工作区同步检查 |
| `bun run check:source-boundaries` | 源码边界与回归基线 |
| `bun run verify:commands` | 命令迁移验证 |
| `bun run verify:starter` | 应用 starter 验收 |
| `bun run test:workspace` | 工作区、Nx、缓存、starter 同步测试 |
| `bun run test:nx-acceptance` | Nx 验收 |
| `bun run test:nx-cache` | Nx 缓存验收 |
| `bun run check:esm` / `test:esm` | ESM 包策略与启动器解析 |

各包还有自己的测试与验收：

- Management API：单元、集成、E2E、SDK 兼容、官方 CLI 兼容、OpenAPI 合规；
- Edge Runtime：运行时、预热、激活产物、TLS 与函数契约；
- Web Console：Svelte 类型检查与构建；
- Lite：单元、原生 PostgreSQL、GraphQL、包冒烟、单二进制冒烟与 parity；
- 应用框架：编译诊断、作用域、模块边界、随机化治理测试与 starter 同步。

这些门禁证明“当前代码在对应条件下通过”，不等同于生产容量、真实 Provider 行为或灾难恢复保证。

## 14. 安全与隔离设计

### 14.1 租户隔离

- 每项目独立数据库 `supa_<ref>`；
- 独立数据库角色与凭据；
- 独立 JWT Secret（Local Auth 模式）；
- PostgREST/GoTrue 独立进程与端口；
- Caddy 按项目路由，拒绝跨项目 Host/Key 混用；
- Storage 从可信来源解析租户并拒绝不一致；
- Edge Worker 只获得请求级、项目作用域能力。

### 14.2 身份与授权

- 平台 RBAC 与业务角色分离；
- JWT 验证必须绑定 issuer、audience、允许的签名算法/密钥和过期时间；
- 不允许使用未验证的解码 token、请求体或用户提供的身份头作为授权依据；
- 统一身份 subject 不自动获得所有项目访问权；
- 受保护访问在身份无法验证时失败关闭，不回退到演示身份或 service-role 绕过；
- 幂等重放也要重新评估业务权限，缓存成功不能绕过撤销。

### 14.3 密钥与凭据

- 项目密钥、JWT Secret、S3 凭据等由平台管理；
- pgredis 租户凭据只存在于运行时专属目录，Edge Runtime 不挂载；
- Web Console 不接收内部服务令牌；
- 日志与诊断输出应避免泄露密钥；
- 源码、示例和翻译不得包含真实凭据。

### 14.4 供应链与升级

- Release 产物需要 SHA256 与构建来源验证；
- 离线验证使用受信任的 Sigstore 根；
- 升级使用主机级锁和唯一临时 systemd 单元；
- 不接受“旧二进制执行新升级契约”；
- Caddy 与 GoTrue 是独立升级面，不包含在协调式 Management/Web Console/Edge Runtime 事务中。

## 15. 适用与不适用

### 15.1 适合

- 需要在自有基础设施上运营多个 Supabase 风格项目；
- 需要项目级隔离、独立域名、统一控制台和 CLI；
- 需要把后台任务、定时函数、前端托管和日志纳入同一平台；
- 需要可审计的发布、升级和恢复流程；
- 希望在类型、编译和模块边界约束下使用 AI 辅助开发；
- 需要中国区 OAuth/企业身份集成能力。

### 15.2 不适合

- 只需要一个项目、且愿意直接使用官方 Supabase Self-Hosted；
- 要求托管 SLA、全球多地域、开箱即用的托管运维；
- 当前就需要单机高可用或跨节点自动故障转移；
- 需要 Supabase Cloud 的全部商业功能与所有上游版本无差别兼容；
- 希望平台替业务应用决定成员关系、对象权限和业务状态机；
- 不愿承担 PostgreSQL、备份、恢复演练和基础设施运维责任。

## 16. 与其他方案的关系

| 方案 | 主要优势 | 相对 SupaCloud 的差异 |
| --- | --- | --- |
| Supabase Cloud | 完全托管、成熟托管运维、全球基础设施 | 控制面与数据主权在厂商侧；SupaCloud 主打自有基础设施多项目运营 |
| Supabase Self-Hosted | 最接近官方上游、单项目 Docker 栈简单 | 不自带多租户控制面、项目路由、前端托管、任务编排和统一运维入口 |
| SupaCloud Full Platform | 自托管多项目、控制面 + 控制台 + CLI + 任务 + 前端 + 运维 | 需要自行承担基础设施、升级、备份与恢复责任 |
| SupaCloud Lite | 无 Docker、单进程、本地优先、Supabase 兼容 | 单项目、无多租户控制面和 Web 控制台 |
| 自建平台 | 完全定制 | 需要自行实现本文描述的控制面、交付、可观测性和恢复体系 |

## 17. 当前边界与后续方向

### 17.1 当前明确边界

- 单机基线不承诺 HA、多节点调度、多地域；
- 控制面故障时数据面独立存活仍是目标验收属性；
- 部分 Functions/Realtime/Storage 流量仍经过 Management API；
- AWS PrivateLink 尚未实现；
- PostgreSQL 主版本升级需要部署侧提供 executor，控制面工作流在 preflight 不通过时失败关闭；
- Lite 的进程内 Auth 不构成完整 GoTrue 兼容；
- 共享 Auth 模式下，依赖项目的认证 Realtime 订阅暂不支持，因为上游 Realtime 目前只接受单一 HS256 secret；
- 兼容性覆盖有文档、有测试的协议与工作流，不覆盖所有 Supabase Cloud 功能。

### 17.2 文档中的提案与路线图

仓库包含若干明确标注为 PROPOSAL 的文档，例如：

- 应用生命周期与分层诊断；
- Encore 对齐路线图；
- 发布控制自动化与金丝雀；
- Edge Function 显式应用生命周期；
- 控制面/数据面权限与连接池逻辑隔离。

这些提案用于讨论和验收设计，不等于已经实现的能力。阅读时应区分“已实现”“本地验证”“发布验证”“生产验收”。

## 18. 术语表

| 术语 | 含义 |
| --- | --- |
| Project / 项目 | 一个隔离的 Supabase 风格租户，拥有独立数据库、运行时和端点 |
| project ref | 项目稳定标识，用于数据库名、路由、密钥和资源命名 |
| Control Plane / 控制面 | 管理项目、配置、发布、操作和审计的平台层 |
| Data Plane / 数据面 | 承载项目实际请求的网关、数据库、REST、Auth、Storage、Functions 等 |
| Management API | 控制面的 HTTP API 与后台 Worker 宿主 |
| Web Console | 自托管 Web 管理界面 |
| Edge Runtime | 运行 Edge Functions 的 Bun Worker 池 |
| PGMQ | PostgreSQL 消息队列，平台队列能力的基础 |
| pgflow | 项目级持久工作流执行 |
| Activation | 某个不可变发布物被指定为当前生效版本的记录 |
| Receipt / 回执 | 操作或恢复的可验证结果记录 |
| Reconciliation / 对账 | 将期望状态与实际资源状态比较并修复的过程 |
| Attested activation | 带摘要校验和 Linux 文件描述符绑定的函数激活 |
| Starter | `supacloud-cli app init` 生成的应用工程模板 |
| Full Platform | 多项目自托管平台主产品 |
| Lite | 单项目、本地优先的独立运行时 |

## 19. 进一步阅读

| 主题 | 文档 |
| --- | --- |
| 主产品边界与验收 | [Self-Hosted Stable Baseline](./self-hosted-stable-baseline.md) |
| 安装、升级与运维 | [Platform Operations](./platform-operations.md) |
| 多租户架构 | [Multi-Tenant Architecture](./architecture-multi-tenant.md) |
| 应用框架 | [Application Framework](./application-framework.md) |
| 应用 starter | [Application Starter](./application-starter.md) |
| CLI 边界 | [CLI Guide](./cli-guide.md) |
| Edge Runtime | [Edge Runtime Guide](./edge-runtime-guide.md) |
| 后台函数 | [Background Functions](./background-functions.md) |
| 前端托管 | [Frontend Hosting](./frontend-hosting.md) |
| 项目级 S3 | [Project-Scoped S3](./project-scoped-s3.md) |
| 数据库治理 | [Database Governance](./database-governance.md) |
| 可观测性 | [Observability](./observability.en.md) |
| 备份与 PITR | [Pigsty Backup Operations](./pigsty-backup-operations.md) |
| 与 Supabase 对比 | [SupaCloud vs Supabase](./supacloud-vs-supabase.md) |
| 企业就绪 | [Enterprise Architecture Readiness](./enterprise-architecture-readiness.md) |
| Lite | [SupaCloud Lite](../packages/supacloud-lite/README.md) |
| 文档总索引 | [Documentation Index](./README.md) |

## 20. 总结

SupaCloud 的核心价值不在于“又提供了一套 Postgres + Auth + REST”，而在于把**多项目自托管运营**所需但常被分散承担的能力收敛成一个有边界、可审计、可升级、可恢复的平台：

- 控制面统一管理项目生命周期与资源；
- 数据面按项目隔离数据库、运行时、路由和存储；
- 控制台与 CLI 让平台无需登录服务器即可运营；
- 不可变交付、激活读回和对账降低“看似成功”的风险；
- 后台任务、前端托管、日志与可观测性形成完整应用平台；
- 可选的应用工程层让业务代码拥有更早的类型与边界反馈；
- Lite 为本地优先场景提供独立、轻量的补充。

在采用前，应明确选择的产品层次（Full Platform、应用工程层或 Lite）、支持的部署基线，以及团队愿意承担的升级、备份和恢复责任。SupaCloud 提供的是平台能力与验收契约，不替代组织对生产系统应尽的安全与运维责任。