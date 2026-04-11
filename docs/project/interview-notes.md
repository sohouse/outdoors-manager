# Outdoors Manager 面试整理

这份文档的目标不是重复 README，而是把项目转成面试时可以直接使用的表达材料。

适用场景：

- 3 分钟项目介绍
- Demo 演示
- 面试官深挖架构、类型、安全、测试
- 回答“为什么做这个项目”和“你在里面的技术判断是什么”

## 一句话定位

这是一个偏后端能力导向的 TypeScript 全栈项目。我用 Next.js App Router 做页面层，用 Hono 统一 API 层，用 Prisma + PostgreSQL 管理数据访问，并把认证、RBAC、类型边界、错误模型和测试作为主要打磨重点。

## 中文 3 分钟介绍

我做的这个项目叫 Outdoors Manager，是一个面向户外活动场景的活动管理平台原型。它不是一个纯展示型项目，而是围绕真实业务里比较常见的活动管理流程来设计的，比如活动列表、条件筛选、详情查看、编辑删除、用户登录注册，以及基于角色和资源 owner 的权限控制。

技术上，我把它做成了一个前后端一体的 TypeScript 全栈项目。页面层用 Next.js App Router，API 层用 Hono 组织在 `/api` 下面，数据层用 Prisma + PostgreSQL，认证用 Better Auth。这样做的原因是我想练的不只是 React 页面开发，而是完整业务链路里接口设计、类型约束、权限控制和工程组织这些更偏后端的能力。

这个项目我重点打磨了三块。第一块是类型边界。我把 Activity 模块的查询参数、编辑输入、列表响应这些边界都尽量收到了 schema 上，让 route 层尽量只处理校验后的数据，而不是大量依赖 `as` 断言。第二块是认证和授权。我把认证和授权拆开，认证由 middleware 注入 `auth` 和 `authz`，业务 service 直接消费 `UserRolePermission`，并且把 owner-aware RBAC 明确成 `read / update.own / update.any / delete.own / delete.any` 这一套规则。第三块是测试和工程化。我补了 service、schema、权限和 route 行为测试，并且把 `lint + typecheck + unit test` 接到了 CI 上。

如果让我总结这个项目的价值，我会说它不在于功能有多复杂，而在于我有意识地把一个业务原型逐步收紧成一个“可讲清楚设计取舍”的全栈样本。它比较能体现我从 Java 后端思维迁移到 TypeScript 全栈之后，对接口契约、分层、权限边界和可维护性的理解。

## English 3-Minute Intro

This project is called Outdoors Manager. It is a TypeScript full-stack prototype for managing outdoor activities, and I designed it around flows that are closer to a real business system than a simple demo app, such as activity listing, filtered search, detail views, editing, deletion, user login, and permission control.

From a technical perspective, I used Next.js App Router for the page layer, Hono for the API layer under `/api`, Prisma with PostgreSQL for the data layer, and Better Auth for authentication. I chose this structure because I wanted to practice not only frontend UI work, but also API design, type boundaries, authorization, and service-layer organization in one coherent project.

There are three areas I focused on most. First, type boundaries. In the Activity module, I tried to move input and response validation closer to schemas so that the route layer consumes validated data instead of relying on unchecked type assertions. Second, authentication and authorization. I separated authentication from authorization, injected `auth` and `authz` through middleware, and used an owner-aware RBAC model with permissions like `update.own`, `update.any`, `delete.own`, and `delete.any`. Third, testing and engineering quality. I added tests for schema validation, service logic, permission branches, and route behavior, and wired lint, typecheck, and unit tests into CI.

What makes this project valuable to me is not just the feature set, but the fact that I deliberately evolved it from a working prototype into a more interview-ready sample with clearer contracts, better boundaries, and more explainable engineering decisions.

## 项目亮点

面试里建议优先讲这 4 个点。

### 1. 真实业务感比 Todo 项目更强

- 活动管理天然带有筛选、分页、详情、编辑、删除、角色权限这些典型业务问题。
- 后续还能自然扩展订单、车辆、领队、排期，不像博客或 Todo 那样过于单薄。

### 2. API 分层和类型边界比较清楚

- Next.js 负责页面与路由壳。
- Hono 负责 `/api` 下的接口组织和中间件。
- Prisma 负责数据库访问。
- route、service、dao 之间有明确职责。

### 3. RBAC 不是口头说说，而是落到了代码和测试里

- `authMiddleware` 负责拿 session，再聚合出 `authz`。
- service 层统一消费 `UserRolePermission`。
- owner 判断只认 `ownerId === userId`，避免字符串匹配误判。
- `own` 和 `any` 权限的区别可以直接结合测试讲。

### 4. 这个项目是“逐步收紧”出来的

- 一开始先做功能主流程。
- 之后补 schema、错误模型、权限边界、测试和 README。
- 这个演进过程很适合讲“我是怎么把能跑的代码变成更稳的工程样本的”。

## Demo 路线

建议把 demo 控制在 5 分钟内，顺序尽量固定。

### Demo 版本

1. 先打开活动列表页，说明这是主业务模块。
2. 展示筛选和分页，说明查询条件不是写死的，而是通过 query schema 进入后端。
3. 点开活动详情，说明列表页和详情弹窗是拆开的。
4. 用有权限的身份演示编辑或删除。
5. 切换到无权限身份，说明 `403` 和前端权限分支。
6. 最后补一句 API 在 Hono 层统一挂载，错误响应和成功响应有统一包装。

### Demo 时可以顺手补的一句话

- 页面层不是直接连数据库，而是走 Hono API。
- 权限判断不是写在按钮层，而是前后端都有边界控制。
- 测试覆盖了 schema、service、route 三类关键链路。

## 你在项目里的技术判断

这个部分很容易被问到，建议回答时突出“为什么这样拆”。

### 为什么选 Next.js + Hono

- 我想保留 Next.js 在页面组织、App Router 和 Server/Client 边界上的能力。
- 但我又不想把所有后端逻辑都直接塞到页面或 Route Handler 里。
- 所以用 Hono 做统一 API 入口，会更接近传统后端里 controller/router 的组织方式，也更方便讲中间件、错误处理和接口契约。

### 为什么要单独做 service 层

- route 层更适合做参数获取和边界校验。
- 权限判断、owner 判断、业务异常更适合放在 service。
- 这样以后就算页面入口换掉，业务规则也不会散落到 UI 里。

### 为什么强调 schema

- TypeScript 的类型只在编译期有效，接口边界进来的数据还是不可信。
- 所以 query、body、response 都应该尽量靠 schema 收口。
- 这也是把“静态类型”变成“运行时可依赖契约”的关键一步。

### 为什么 owner 判断只认 userId

- 名字和用户名都可能重复或变化。
- 如果把 owner 判断建立在字符串字段上，后面很难解释安全边界。
- 直接只认稳定 id，逻辑更清晰，也更容易测试。

## 常见深问与回答框架

下面这些问题可以重点练。

### 1. 这个项目里你最满意的设计是什么

建议答法：

我最满意的是把认证、授权和业务逻辑拆成了比较清楚的边界。认证由 middleware 负责，授权结果聚合成 `authz` 放到上下文里，service 层只消费 `UserRolePermission`。这样 route 层不会到处手拼权限信息，也更容易补测试。

### 2. 你为什么说这个项目偏 backend-leaning fullstack

建议答法：

因为我刻意把重点放在接口契约、service/dao 分层、RBAC、错误模型和测试，而不是只做页面效果。前端部分当然也有列表、详情、表单和 Zustand 状态协作，但我最想体现的是我能把业务规则稳定地落到接口和服务层。

### 3. 如果不用 Hono，直接用 Next.js Route Handler 行不行

建议答法：

可以，但我这里希望 API 层更独立、更可组织。Hono 的中间件、路由组合和错误处理模型更接近传统后端框架，比较适合我当前这个项目的表达重点。对我来说，这也是练习“在前后端一体项目里保持后端分层感”的一种方式。

### 4. 这个项目最大的技术债是什么

建议答法：

功能主链路已经比较完整了，但还有两类技术债。第一类是文档资产还要继续补，比如架构图、权限说明、面试笔记。第二类是业务广度还不够，目前最核心的是 Activity 模块，后续如果扩展到订单、车辆或领队模块，能更好体现跨模块设计能力。

### 5. 你是怎么处理错误模型的

建议答法：

我把业务错误封装成 `ApplicationException`，错误对象内直接携带状态码和错误类型。Hono 全局错误处理统一把它转成约定响应，成功响应也做统一包装。这样前端 `unwrapResponse` 时只需要处理一种契约，不需要每个接口都单独猜格式。

### 6. 这个项目里权限控制做了哪些层次

建议答法：

有两层。第一层是后端 service 的硬权限判断，决定请求是否真的允许执行。第二层是前端基于 `authz` 的交互分支，比如是否展示编辑/删除入口。前端控制是体验优化，真正的安全边界还是以后端为准。

### 7. 为什么要给 route 层补测试，不只测纯函数

建议答法：

因为很多 bug 发生在边界层，比如认证中间件有没有注入上下文、未登录是不是返回 401、没有权限是不是 403、资源不存在是不是 404。只测纯函数说明不了这部分链路是否真的工作，所以我补了 route 行为测试。

### 8. Zustand 在这里解决了什么问题

建议答法：

它主要解决活动列表页、分页元数据、筛选条件和详情编辑后刷新之间的状态协作问题。这个状态不是全站级别的大状态，但又跨了几个组件和交互节点，用 Zustand 比层层 props 传递更自然。

### 9. 如果这个项目继续迭代，你下一步做什么

建议答法：

我会优先做两件事。第一是补文档和演示资产，把这个项目彻底变成可投递样本。第二是新增一个和当前领域强相关的新模块，比如订单或我的活动，而不是随意加一个 unrelated feature。这样项目主线会更完整。

### 10. 你从 Java 转到 TS 全栈，最大的变化是什么

建议答法：

我觉得最大的变化是边界更多也更灵活。Java 生态里很多分层和约束是默认比较强的，但在 TS 全栈里，你可以写得很快，也可能很快写散。所以我会更主动地去建立 schema、service、错误模型和测试这些约束，把灵活性收回来。

## 可能被追问的文件

如果面试官让你现场讲代码，可以优先从这些文件切入。

- [src/lib/features/activity/api/activity-api.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/api/activity-api.ts)
- [src/lib/features/activity/service/activity-service.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/service/activity-service.ts)
- [src/lib/features/activity/shared/activity-check.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/shared/activity-check.ts)
- [src/lib/middlewares/auth-middleware.ts](/home/will/workspace/outdoor-manager/src/lib/middlewares/auth-middleware.ts)
- [src/lib/features/role-permission/shared/role-permission.ts](/home/will/workspace/outdoor-manager/src/lib/features/role-permission/shared/role-permission.ts)
- [src/lib/api/response.ts](/home/will/workspace/outdoor-manager/src/lib/api/response.ts)
- [src/lib/api/auth-route.test.ts](/home/will/workspace/outdoor-manager/src/lib/api/auth-route.test.ts)
- [src/lib/features/activity/test/activity-service.test.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/test/activity-service.test.ts)

## 不建议这样讲

- 不要把项目讲成“我用了很多技术栈”。
- 不要按页面顺序机械介绍所有功能。
- 不要一直强调“这是练手项目”，更好的说法是“这是我围绕真实业务场景刻意打磨的全栈样本”。
- 不要把重点放在 UI 漂不漂亮，除非对方明确在看前端设计能力。

## 自我介绍后的自然衔接

如果你刚讲完自我介绍，可以这样过渡到项目：

最近我重点打磨的一个项目是 Outdoors Manager。它是一个偏后端能力导向的 TypeScript 全栈项目，我主要用它来训练接口契约、权限控制、分层设计和测试，而不只是做页面功能。

## 下一步练习建议

建议你接下来按这个顺序练：

1. 先把中文 3 分钟介绍讲顺，录音听一遍。
2. 再把英文介绍压缩到 2 分钟左右，先保证清楚，再追求自然。
3. 按上面的 10 个深问，至少每题口头答一遍。
4. 最后开着项目跑一遍 demo，把“功能演示”和“代码解释”串起来。
