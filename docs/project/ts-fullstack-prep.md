# TS Fullstack 面试补强

这份文档专门整理和当前项目强相关的 TypeScript、React、Next.js、接口设计、权限控制、测试策略问法。

建议用法：

- 不要背答案，先看问题，再用项目代码组织自己的表达
- 每个问题尽量回答到“为什么这样设计”
- 回答时优先结合当前仓库，而不是泛泛背八股

## TypeScript

### 1. TypeScript 的类型系统只能保证什么，不能保证什么

建议答法：

TypeScript 主要保证编译期的静态类型安全，比如参数、返回值、对象结构和类型推导。但它不能自动保证运行时输入是合法的，尤其是 query、body、数据库外部输入这些边界数据。所以在这个项目里，我会用 Zod schema 去补 runtime validation，让接口边界既有类型提示，也有运行时约束。

可结合代码：

- [activity-check.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/shared/activity-check.ts)
- [activity-api.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/api/activity-api.ts)

### 2. 你在这个项目里是怎么做 type narrowing 的

建议答法：

我主要在错误处理和响应解包里用 narrowing。比如前端 `unwrapResponse` 先判断 payload 是否满足 `ApplicationResponse` 的结构，再决定是返回 `content` 还是抛出异常。在页面层 catch 错误时，也会根据 `error instanceof ApplicationException` 来区分业务异常和未知异常，这样不会把所有错误都当成同一种情况处理。

可结合代码：

- [response.ts](/home/will/workspace/outdoor-manager/src/lib/api/response.ts)
- [page.tsx](/home/will/workspace/outdoor-manager/src/app/(app)/activity/page.tsx)

### 3. 这个项目里你怎么区分 domain type、view object 和输入类型

建议答法：

我会把它们分成几层。输入类型对应 query 和 body，主要通过 schema 约束；domain type 用于 service 和业务逻辑，比如 `ActivityItem`；view object 用于接口返回和前端展示，比如 `ActivityVO`，它把 `Date` 转成字符串，避免前端直接消费带有数据库语义的对象。这样每层的职责更清楚。

可结合代码：

- [activity.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/shared/activity.ts)

### 4. 你为什么没有只靠 interface，而是还用了 schema

建议答法：

因为 interface 只能在编译期生效，运行时不会自动校验。接口边界进来的 query 和 body 是不可信的，如果只写 interface，就还是可能在运行时收到非法值。schema 的作用是把编译期和运行时两层约束接起来。

### 5. 什么时候该用 `type`，什么时候该用 `interface`

建议答法：

我通常会在需要对象结构扩展、表达领域对象时用 `interface`，比如 `ActivityItem`、`UserRolePermission`。在需要映射、组合、推导时更倾向于用 `type`，比如 `ActivityVO` 这种由 `DateToString<T>` 映射出来的类型。核心不是语法偏好，而是让类型表达更自然。

## React

### 1. 这个项目里状态是怎么拆的

建议答法：

我把状态分成三类。第一类是页面局部状态，比如 loading、error、当前列表数据，用 `useState` 管。第二类是表单状态，用 React Hook Form 管，因为它更适合字段、校验和提交态。第三类是 Activity 模块的共享状态，比如筛选条件、分页信息和刷新标记，用 Zustand 管。这样不会把所有状态都堆到一个地方。

可结合代码：

- [page.tsx](/home/will/workspace/outdoor-manager/src/app/(app)/activity/page.tsx)
- [ActivityEditForm.tsx](/home/will/workspace/outdoor-manager/src/lib/features/activity/client/ActivityEditForm.tsx)
- [activity-store.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/shared/activity-store.ts)

### 2. 为什么这里用了 Zustand

建议答法：

因为筛选条件、分页元信息和详情编辑后列表刷新这些状态会跨几个组件协作，但复杂度又没有高到需要引入更重的全局状态方案。Zustand 的心智负担比较低，也适合做模块级共享状态。

### 3. 表单为什么用 React Hook Form + Zod

建议答法：

因为这里既有输入字段，又有校验，又有提交态。React Hook Form 比自己手写受控表单更省心，Zod 可以直接复用 schema 约束。组合起来既减少重复逻辑，也让校验规则更集中。

### 4. 你怎么避免页面组件职责过重

建议答法：

我会把页面容器和展示组件拆开。比如活动页容器负责数据拉取、错误和 loading 状态，`ActivityList` 负责列表展示，`ActivityListItem` 负责单卡片，`ActivityEditForm` 负责表单输入。这样页面文件不会一边拉数据一边写所有 UI 细节。

### 5. 这个项目里有没有前后端都做权限控制

建议答法：

有，但职责不同。前端权限控制主要是交互层面的，比如是否展示编辑或删除入口；后端 service 权限控制才是真正的安全边界。前端控制是为了用户体验，后端控制是为了保证请求本身不能越权。

## Next.js

### 1. 为什么这个项目用 App Router

建议答法：

因为 App Router 更适合做页面分层、嵌套路由和 Server/Client 边界的管理。这个项目里活动详情用了路由和 modal 结合的方式，App Router 在这类结构上比较自然。

### 2. 你怎么理解 Server Component 和 Client Component 的边界

建议答法：

如果组件需要浏览器交互能力，比如 `useState`、`useEffect`、表单输入、点击事件，那它就需要是 Client Component。像活动页容器、详情弹窗、编辑表单这些都属于这一类。对于纯展示或可放在服务端准备的数据，如果后续继续收紧，也可以往 Server Component 方向走，但这个项目当前更强调 API 层和前端交互。

### 3. 既然用 Next.js，为什么还要单独做 Hono API

建议答法：

因为我想练习的是“前后端一体项目里依然保持清晰 API 分层”。直接把逻辑写在 Next.js 的页面或 route handler 里当然可行，但 Hono 更方便我表达中间件、错误处理、统一响应包装和路由组织，也更接近我熟悉的后端开发方式。

### 4. 你如何处理页面里的数据加载

建议答法：

当前 Activity 页面用客户端请求 API，因为它除了列表数据，还要处理筛选条件变化、分页和刷新标记这些交互式状态。这个选择的重点不是 SSR，而是让模块交互更直接。以后如果更强调首屏性能，也可以把部分读取迁移到服务端。

## API 设计

### 1. 你怎么理解 route、service、dao 的分层

建议答法：

route 负责请求边界，比如拿参数、校验 schema、读 context；service 负责业务规则，比如读权限、owner 判断、异常抛出；dao 负责数据库访问。这个分层的核心价值是让业务规则不散落在页面和数据库代码之间，也让测试更容易写。

### 2. 为什么要统一成功响应和失败响应

建议答法：

因为如果每个接口都各自返回不同 shape，前端消费会越来越乱。统一响应契约之后，前端只需要通过 `unwrapResponse` 处理一套格式，错误处理和成功解包都会更稳定。

可结合代码：

- [application-response.ts](/home/will/workspace/outdoor-manager/src/lib/types/application-response.ts)
- [response.ts](/home/will/workspace/outdoor-manager/src/lib/api/response.ts)
- [main.ts](/home/will/workspace/outdoor-manager/src/lib/api/main.ts)

### 3. 你为什么把权限判断放在 service 而不是 route

建议答法：

因为权限是业务规则，不只是路由层的参数问题。如果以后调用入口变了，比如从别的任务或别的接口复用这段逻辑，权限规则仍然应该成立。放在 service 层更符合“规则跟业务走”的原则。

## Auth 与 RBAC

### 1. 你是怎么做认证和授权拆分的

建议答法：

认证解决的是“你是谁”，授权解决的是“你能做什么”。在这个项目里，认证由 Better Auth session 完成，授权由 `userRolePermission(user.id)` 聚合成 `authz`。中间件把这两个结果注入 context，后面的 route 和 service 直接消费。

### 2. own 和 any 的区别是什么

建议答法：

`own` 表示只能管理自己拥有的资源，`any` 表示可以管理所有资源。比如 `activity:update.own` 只能更新自己创建的活动，而 `activity:update.any` 可以更新任意活动。这个区别在后台 service 和前端权限分支里都有体现。

### 3. 为什么 owner 判断只认 userId

建议答法：

因为名字和用户名都可能重复或变化，不能作为可靠权限边界。只认稳定 id 更安全，也更便于测试和解释。

可结合代码：

- [role-permission.ts](/home/will/workspace/outdoor-manager/src/lib/features/role-permission/shared/role-permission.ts)

## 测试

### 1. 你为什么不只测纯函数

建议答法：

因为很多真实问题发生在边界层。比如未登录应该返回 401 还是 403，中间件有没有把 `authz` 注进去，资源不存在是不是 404，这些都不是单靠测纯函数能覆盖的。所以我补了 route 行为测试。

### 2. 你现在的测试策略是什么

建议答法：

当前主要是三层测试：schema/check、service 和 route behavior。这样既能覆盖输入合法性，也能覆盖权限和异常分支，还能证明路由入口的行为契约是成立的。

### 3. 如果让你继续补测试，你会补哪里

建议答法：

我会优先补关键组件交互测试和更完整的 route 场景，比如编辑和删除成功/失败分支。再往后如果项目继续扩展，可以考虑补 E2E，验证从 UI 到 API 的完整链路。

## 工程化

### 1. 这个项目里你做了哪些工程化工作

建议答法：

我做了三类事情。第一是统一错误和响应契约，降低前后端联调成本。第二是补单元测试和 route 行为测试。第三是把 `lint + typecheck + unit test` 接到 CI，至少保证基本质量门槛。

### 2. CI 为什么先只放这三项

建议答法：

因为当前阶段目标是建立稳定且可维护的最小门槛，而不是一开始把流水线堆得很重。对这个项目来说，lint、typecheck 和 unit test 已经能拦住不少回归问题，是投入产出比比较高的第一步。

## 设计取舍题

### 1. 为什么不现在就把 RAG 集成进来

建议答法：

因为当前项目的主线很清楚，就是活动管理 + TS 全栈 + RBAC + 工程化。如果现在硬塞一个最小 RAG，会把叙事变成两个不够紧密的 demo 拼接，反而削弱这个项目原本的亮点。更合理的做法是先把当前项目讲述和投递材料补齐，再决定要不要做一个与业务强相关的 AI 检索场景。

### 2. 如果要继续扩展，你更倾向于加什么

建议答法：

我更倾向于加和当前领域强相关的新模块，比如订单、我的活动、车辆或领队管理。因为这类模块能延续已有的权限、接口和分层设计，让项目更像一个逐步长出来的系统，而不是随机加功能。

## 高频英文问法

### Can you walk me through the architecture of this project?

This project uses Next.js App Router for the page layer, Hono for the API layer, Prisma and PostgreSQL for the data layer, and Better Auth for session-based authentication. I separated route, service, and DAO responsibilities so that request validation, business rules, and database access do not get mixed together.

### What was the most important engineering decision in this project?

The most important decision was to treat type boundaries and authorization as first-class concerns. I moved input validation closer to schemas, centralized auth context injection in middleware, and kept permission checks in the service layer instead of scattering them across the UI or routes.

### What would you improve next if you had more time?

I would improve the documentation and interview-facing materials first, then expand the business domain with a strongly related module such as orders or user-centric activity management. I would also consider adding more component-level tests or end-to-end tests for key flows.

## 回答时容易犯的错误

- 只说“我用了哪些技术”，不说为什么这样组合
- 只说“功能有这些”，不说边界和取舍
- 把前端权限控制说成真正安全边界
- 讲 TypeScript 时只说类型推导，不说 runtime validation
- 讲测试时只说覆盖率，不说测了哪些风险点

## 练习建议

1. 先选上面 10 个你最怕的问题，口头答一遍。
2. 每个答案尽量控制在 40 到 90 秒。
3. 回答时至少点一个当前仓库里的具体实现。
4. 如果英文会卡壳，就先用短句版本，不要追求复杂句。
