# Engineering Handoff

## 目的

这份文档用于帮助后来者快速接手项目，完成本地启动、基础验证和常见问题排查。

## 仓库现状

当前仓库是一个 Next.js + Hono + Prisma + Better Auth 的全栈项目。

核心主链路集中在 Activity 模块，配套包括：

- 认证与权限
- Activity 列表、详情、编辑、删除
- 单元测试和 route 行为测试
- 基础 CI

## 本地启动

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

参考根目录 `README.md` 和 `.env.example`。

重点确认：

- `DATABASE_URL`
- `DIRECT_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_BASE_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### 3. 初始化数据库

常用命令：

```bash
pnpm db:gen
pnpm db:push
pnpm db:seed
```

### 4. 启动开发环境

```bash
pnpm dev
```

访问：

```text
http://localhost:3000
```

## 最小验证

接手后建议先执行：

```bash
pnpm type
pnpm test:unit
```

如果这两步不过，不建议直接继续功能开发。

## 常见工作入口

### 想看页面与主流程

- `src/app/(app)/activity/page.tsx`

### 想看 API 入口

- `src/lib/api/main.ts`
- `src/lib/features/activity/api/activity-api.ts`

### 想看认证和权限

- `src/lib/middlewares/auth-middleware.ts`
- `src/lib/features/role-permission/shared/role-permission.ts`

### 想看业务规则

- `src/lib/features/activity/service/activity-service.ts`

### 想看当前文档体系

- `docs/README.md`
- `docs/PRODUCT.md`
- `docs/ARCHITECTURE.md`
- `docs/REMAINING_WORK.md`

## 常见排障方向

### 页面打不开或接口报错

先检查：

- 环境变量是否齐全
- 数据库是否已初始化
- Better Auth 相关配置是否正确

### 权限相关异常

先检查：

- session 是否生效
- `authMiddleware` 是否注入了 `authz`
- 用户角色与权限数据是否存在
- 是否命中了 owner / own / any 的边界分支

### 数据为空或查不到

先检查：

- 是否执行了 seed
- query 条件是否过严
- 目标 id 是否存在

### 测试失败

优先看：

- service 测试是否因为返回契约或权限逻辑改变
- route 行为测试是否因为错误码或 response contract 改变

## 交接建议

接手一个中等以上改动前，建议先做这三步：

1. 读 `docs/PRODUCT.md`，确认这件事是不是当前阶段应该做的。
2. 读 `docs/ARCHITECTURE.md`，确认修改点落在哪一层。
3. 在 `docs/plans/` 新建一个简短 plan 文档，说明目标、范围和验证方式。

## 当前交接重点

如果现在要继续推进仓库，优先级建议是：

1. 统一前端 API 解析与错误提示。
2. 把 Activity 模块继续打磨成更稳的可讲样本。
3. 再扩一个与主线强相关的新模块。
