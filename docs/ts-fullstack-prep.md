# TS Fullstack Prep

## TypeScript

### TypeScript 能保证什么，不能保证什么

TypeScript 主要保证编译期类型安全，但不能自动保证运行时输入合法。所以在这个项目里，接口边界的 query 和 body 仍然要靠 Zod schema 做运行时校验。

### 为什么需要 schema，不只靠 interface

因为 interface 只存在于编译期，无法防住真实请求里的非法数据。schema 能把编译期类型和运行时校验接起来。

### 这个项目里怎么区分 input、domain 和 VO

input 负责接口输入，domain type 负责 service 内部业务语义，VO 负责对外返回和前端消费。比如 Activity 的 `Date` 会在 VO 层转成字符串，避免前端直接依赖领域对象实现细节。

## React

### 这个项目里状态怎么拆

页面局部状态用 `useState`，表单状态用 React Hook Form，共享但不需要全局化的模块状态用 Zustand。这样状态不会全堆在一个地方。

### 为什么用 Zustand

它正好适合 Activity 模块里的筛选条件、分页信息和刷新标记这类跨几个组件协作、但又不算全站级的大状态。

### 为什么前端和后端都做权限控制

前端权限控制是为了交互体验，后端 service 权限控制才是真正的安全边界。

## Next.js

### 为什么用 App Router

因为它适合页面层组织、嵌套路由和 modal 场景，也便于区分服务端和客户端职责。

### 为什么既用 Next.js 又用 Hono

因为我希望在一体化项目里仍然保留清晰 API 层，用 Hono 更方便表达中间件、统一错误处理和路由组织。

## API 与分层

### route、service、dao 各负责什么

- route 负责请求边界和 schema 校验
- service 负责业务规则、权限和异常
- dao 负责数据库访问

### 为什么统一成功响应和失败响应

这样前端可以集中解析 `ApplicationResponse`，不用每个页面自己猜协议。

## Auth 与 RBAC

### own 和 any 的区别是什么

`own` 只能管理自己拥有的资源，`any` 可以管理任意资源。这个区别在 Activity 的更新和删除场景里都有体现。

### 为什么 owner 只认 userId

因为名字和用户名都可能变化或重复，不能作为稳定权限边界。

## 测试

### 当前测试策略是什么

主要覆盖 schema / check、service、route behavior 三层，既验证输入，又验证业务规则和关键错误分支。

### 为什么不只测纯函数

因为很多真实问题出在边界层，比如 401、403、404、context 注入和 response contract，这些必须通过 route 行为测试来证明。
