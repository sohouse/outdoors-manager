# Outdoors Manager 架构说明

这份文档用于说明项目当前的整体结构、模块职责、关键链路和主要设计取舍。

## 项目目标

Outdoors Manager 当前不是追求功能最多的产品，而是一个偏 backend-leaning 的 TypeScript 全栈样本。它的重点在于：

- 用真实业务场景承载接口设计、权限控制和分层组织
- 在 Next.js 项目里建立清晰的 API 与 service 边界
- 把“能跑”逐步收紧成“契约更清楚、测试更可讲”的工程样本

## 技术栈分层

### 页面层

- Next.js App Router
- React 19
- Tailwind CSS
- Zustand
- React Hook Form

页面层负责：

- 路由与页面容器
- 交互状态编排
- 发起 API 请求
- 根据权限结果做前端交互分支

### API 层

- Hono
- Hono middleware
- Hono client

API 层负责：

- 统一挂载 `/api`
- 请求参数解析和 schema 校验
- 认证中间件注入
- 错误处理与成功响应包装

### 业务层

- service
- shared
- auth / role-permission

业务层负责：

- 权限判断
- owner-aware RBAC
- 业务异常
- 输入输出边界约束

### 数据层

- Prisma
- PostgreSQL
- DAO

数据层负责：

- 数据库连接
- 查询与写入
- Prisma record 到业务对象的转换

## 目录结构

```text
src/
  app/
    (app)/               页面路由与业务页面
    api/                 Next.js 入口下挂载 Hono route
  lib/
    api/                 Hono 主入口、客户端、response unwrap
    auth.ts              Better Auth 配置
    components/          UI 组件与页面组件
    database/            Prisma client、schema、seed、dao register
    features/            按业务模块组织代码
      activity/
      auth/
      role-permission/
    middlewares/         Hono middleware
    types/               错误、响应、上下文、分页等通用类型
```

## 当前核心模块

当前最完整的模块是 `Activity`，它也是整个项目的主样本。

### Activity 模块职责划分

- `api/activity-api.ts`
  负责 route 定义、query/body 解析、调用 service、返回 JSON
- `service/activity-service.ts`
  负责权限判断、owner 判断、业务分支和异常
- `shared/activity-check.ts`
  负责 Activity 相关 schema
- `shared/activity.ts`
  负责 Activity 领域模型、VO 和输入输出类型
- `dao/activity-dao.ts`
  负责 Activity 数据库读写
- `client/*`
  负责详情弹窗、编辑表单、删除交互等前端能力

## 一次典型请求的链路

以“活动列表查询”为例：

1. 页面层从 Zustand 里拿查询条件。
2. 页面调用 `honoClient.api.activity.findByCondition.$get({ query: condition })`。
3. Hono route 在 `activity-api.ts` 中用 `activityConditionCheck` 校验 query。
4. route 从 context 里读取 `authz`，再把校验后的数据传给 service。
5. service 先检查 `activity:read` 权限，再调用 DAO 查询数据。
6. service 组装分页元信息并返回。
7. route 把 `ActivityItem` 转成 `ActivityVO`，再返回 JSON。
8. Hono 全局包装成功响应。
9. 前端通过 `unwrapResponse` 拿到统一格式后的 `content`。

这个链路的关键点是：

- route 负责边界
- service 负责规则
- dao 负责数据
- 前端只消费统一契约

## 认证与授权链路

项目中的认证和授权是拆开的。

### Authentication

认证由 Better Auth 提供 session 能力。

在 [auth-middleware.ts](/home/will/workspace/outdoor-manager/src/lib/middlewares/auth-middleware.ts) 中：

- 读取请求头
- 调用 `auth.api.getSession`
- 校验 session 是否存在
- 取出 `user` 和 `session`

### Authorization

授权通过 `userRolePermission(user.id)` 聚合：

- 当前用户角色
- 当前用户权限

中间件将结果放进 context：

- `auth`
- `authz`

这样业务层不需要在每个 route 里重新拼装认证信息。

## RBAC 设计

当前 Activity 模块采用 owner-aware RBAC。

权限包括：

- `activity:read`
- `activity:update.own`
- `activity:update.any`
- `activity:delete.own`
- `activity:delete.any`

判断原则：

- `any` 权限优先
- 如果只有 `own` 权限，则必须 `ownerId === userId`
- owner 判断只认稳定 id，不回退到 name 或 username

这个设计的好处是：

- 规则很清晰
- 安全边界更稳
- 很容易测试

## 类型边界设计

这是这个项目最值得讲的部分之一。

### 为什么强调类型边界

TypeScript 类型只在编译期有效，但接口进来的 query 和 body 是运行时数据，所以边界必须靠 schema 收口。

### 当前边界模型

以 Activity 为例，大致可以分为四类：

- query/input
- domain
- db payload / record
- response / view object

其中：

- `activity-check.ts` 负责 query 和 body schema
- `activity.ts` 负责 `ActivityItem`、`ActivityVO`、`CreateActivityInput`、`UpdateActivityInput`
- `toActivityVO` 负责把 `Date` 转为字符串，供接口返回和前端消费

### 设计收益

- route 层尽量少用不安全断言
- 输入输出边界更清楚
- 页面层不用直接碰 Prisma record

## 错误模型与响应契约

项目约定了统一成功和失败响应。

### 成功响应

由 `createSuccessApplicationResponse` 包装，主要字段有：

- `success`
- `code`
- `message`
- `content`

### 失败响应

由 `ApplicationException` 和全局错误处理中间件统一生成。

主要边界：

- `400` 参数错误
- `401` 未认证
- `403` 无权限
- `404` 资源不存在
- `500` 未知错误

### 前端消费方式

前端通过 [response.ts](/home/will/workspace/outdoor-manager/src/lib/api/response.ts) 的 `unwrapResponse` 做统一解包。

这样前端拿到的是稳定的：

- 成功则取 `content`
- 失败则抛 `ApplicationException`

## 前端结构设计

当前前端没有追求复杂的全局状态系统，而是围绕 Activity 模块做了比较克制的拆分。

### 页面容器

[page.tsx](/home/will/workspace/outdoor-manager/src/app/(app)/activity/page.tsx) 负责：

- 拉取活动列表
- 拉取当前用户权限
- 编排 `loading / empty / error / success`
- 打开活动详情路由

### 展示层

[ActivityList.tsx](/home/will/workspace/outdoor-manager/src/lib/components/web/ActivityList.tsx) 负责：

- 遍历活动列表
- 组合单个卡片
- 按权限决定是否显示删除入口

[ActivityListItem.tsx](/home/will/workspace/outdoor-manager/src/lib/components/web/ActivityListItem.tsx) 负责：

- 卡片 UI
- 时间、类型、状态展示
- 删除弹窗入口

### 表单层

[ActivityEditForm.tsx](/home/will/workspace/outdoor-manager/src/lib/features/activity/client/ActivityEditForm.tsx) 负责：

- 结合 React Hook Form + Zod
- 管理默认值、校验和提交状态
- 让详情弹窗容器不直接承担表单细节

### 模块级状态

[activity-store.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/shared/activity-store.ts) 用 Zustand 管理：

- 当前查询条件
- 分页元信息
- 列表刷新标记

它解决的是模块内多组件协作问题，而不是做一个全局大状态中心。

## 测试策略

当前测试覆盖三类关键能力。

### 1. schema / check

- 查询参数
- 日期格式
- 默认值
- 非法输入

### 2. service

- 读权限
- owner 与 any 分支
- 更新与删除权限
- 资源不存在

### 3. route behavior

- 未登录 `401`
- 无权限 `403`
- 资源不存在 `404`
- 中间件与上下文注入是否生效

这个测试策略的意义在于，既覆盖纯逻辑，也覆盖接口边界行为。

## CI 质量门槛

当前 CI 流程比较简洁，但足够实用：

- `pnpm lint`
- `pnpm type`
- `pnpm test:unit`

这保证了项目至少具备：

- 代码风格检查
- 类型检查
- 基础单元测试

## 主要设计取舍

### 为什么不是所有逻辑都写在 Next.js Route Handler

因为这个项目想强调“前后端一体，但 API 层仍然有明确组织”。Hono 更适合表达：

- middleware
- route grouping
- 全局错误处理
- 统一响应包装

### 为什么没有急着扩新业务模块

因为当前阶段的重点不是功能广度，而是把一个模块打磨到足够能讲清楚：

- 类型边界
- 权限控制
- 测试
- 文档

### 为什么使用 Zustand，而不是更重的状态方案

当前状态复杂度主要集中在 Activity 模块内部协作，不需要引入更重的全局状态体系。

## 当前边界与后续扩展

当前项目的优势在于主链路比较完整，但也有明显边界。

### 当前边界

- Activity 是最完整的模块，其他业务模块还不够丰富
- 文档和面试材料刚开始补齐
- 目前测试以单测和 route 行为测试为主，还没有 E2E

### 继续扩展时更合适的方向

- 订单管理
- 我的活动
- 领队管理
- 车辆与排期

这些方向和当前业务主线强相关，比硬塞一个 unrelated feature 更利于项目叙事。

## 架构总结

如果要用一句话总结当前架构：

这是一个基于 Next.js + Hono + Prisma 的 TypeScript 全栈项目，我用它重点练习接口边界、RBAC、service/dao 分层、统一错误契约，以及把真实业务原型逐步收紧成更可维护的工程样本。
