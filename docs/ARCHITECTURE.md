# Architecture

## 总览

Outdoors Manager 采用前后端一体的 TypeScript 全栈结构：

- 页面层使用 Next.js App Router
- API 层使用 Hono 挂载在 `/api`
- 数据层使用 Prisma + PostgreSQL
- 认证使用 Better Auth
- 权限模型使用 owner-aware RBAC

整体目标不是追求最多的业务模块，而是把一个主业务链路做出清晰的边界和可解释的设计。

## 分层结构

### 页面层

职责：

- 页面容器与路由
- 用户交互
- 列表、详情、表单等 UI 组合
- 调用 API facade 或 API client

当前典型文件：

- `src/app/(app)/activity/page.tsx`
- `src/lib/features/activity/client/ActivityEditForm.tsx`
- `src/lib/components/web/ActivityList.tsx`

### API 层

职责：

- 统一接口入口
- 请求参数解析与 schema 校验
- 中间件注入 `auth` / `authz`
- 成功响应包装与错误响应统一处理

当前典型文件：

- `src/lib/api/main.ts`
- `src/lib/api/response.ts`
- `src/lib/features/activity/api/activity-api.ts`
- `src/lib/middlewares/auth-middleware.ts`

### 业务层

职责：

- 业务规则
- 资源 owner 判断
- 权限检查
- 业务异常和边界条件

当前典型文件：

- `src/lib/features/activity/service/activity-service.ts`
- `src/lib/features/role-permission/shared/role-permission.ts`
- `src/lib/features/activity/shared/activity-auth.ts`

### 数据层

职责：

- 数据库连接
- DAO 封装
- Prisma 访问
- 数据记录到领域对象的映射

当前典型文件：

- `src/lib/database/prisma-client.ts`
- `src/lib/database/dao-register.ts`
- `src/lib/features/activity/dao/activity-dao.ts`

## 核心链路

以“查询活动列表”为例：

1. 页面层读取查询条件。
2. 前端发起 `/api/activity/findByCondition` 请求。
3. route 使用 schema 校验 query。
4. route 从 context 读取 `authz`。
5. service 检查 `activity:read` 权限。
6. DAO 查询数据库并返回数据与总数。
7. service 组装分页元信息。
8. route 将领域对象转换为前端可消费的 VO。
9. API 层统一包装成功响应。
10. 前端解析 `ApplicationResponse` 并进入成功流程。

## 认证与授权

### Authentication

认证负责回答“当前用户是谁”。

流程：

- Better Auth 读取请求头中的 session
- `authMiddleware` 校验 session 是否存在
- 注入 `auth`

### Authorization

授权负责回答“当前用户能做什么”。

流程：

- 通过 `userRolePermission(user.id)` 聚合角色与权限
- 注入 `authz`
- service 层消费 `UserRolePermission`

## RBAC 约束

当前 Activity 模块的权限模型：

- `activity:read`
- `activity:update.own`
- `activity:update.any`
- `activity:delete.own`
- `activity:delete.any`

规则：

- `any` 权限优先
- 如果只有 `own`，则必须满足 `ownerId === userId`
- owner 判断只认稳定 id，不回退到名字或用户名

## 类型边界

项目中的类型边界不是只靠 TypeScript interface，而是编译期类型与运行时 schema 结合。

主要边界模型：

- query / body input
- domain type
- db payload / record
- response / view object

当前 Activity 模块中：

- `activity-check.ts` 负责输入 schema
- `activity.ts` 负责领域类型与 VO
- `toActivityVO` 负责把 `Date` 转成字符串

## 响应契约

当前 API 响应遵循统一 `ApplicationResponse` 契约。

成功响应：

- `success`
- `code`
- `message`
- `content`

失败响应：

- 统一通过 `ApplicationException` 和 Hono 全局错误处理输出

这保证了前端解析逻辑可以集中处理，而不是每个页面自己猜响应结构。

## 当前主要约束

- 页面层不直接碰数据库
- 业务规则放在 service，不散落在 UI 或 route 中
- 权限判断以前后端后端 service 为准
- 输入边界尽量先做 schema 校验，再进业务层
- 前端应逐步减少直接使用 `honoClient + unwrapResponse` 的分散写法

## 当前技术债

- 页面层的 API 解析和错误弹窗处理仍有重复
- 文档体系刚开始建立
- Activity 之外的业务模块还不够丰富

## 下一步架构方向

### 前端交互层

- 增加 API facade
- 增加统一错误提示 provider
- 增加 `useApiAction` 一类的异步调用封装

### 业务层

- 扩展一个与 Activity 主线强相关的新模块
- 让权限模型跨模块复用

### 文档层

- 为关键改造补 plan 文档
- 让代码、架构和路线图彼此对齐
