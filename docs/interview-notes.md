# Interview Notes

## 一句话定位

Outdoors Manager 是一个偏 backend-leaning 的 TypeScript 全栈项目样本，重点体现接口契约、认证授权、RBAC、分层和工程化，而不是只追求页面效果。

## 中文 3 分钟介绍

我做的这个项目叫 Outdoors Manager，是一个面向户外活动场景的活动管理平台原型。这个项目不是一个纯展示型 demo，而是围绕真实业务里比较常见的活动管理流程来设计的，比如活动列表、条件筛选、详情查看、编辑删除、用户登录注册，以及基于角色和资源 owner 的权限控制。

技术上，我把它做成了一个前后端一体的 TypeScript 全栈项目。页面层使用 Next.js App Router，API 层使用 Hono，数据层使用 Prisma 和 PostgreSQL，认证使用 Better Auth。这样做的原因是我希望训练的不只是 React 页面开发，而是完整业务链路里接口设计、类型约束、权限控制和工程组织这些更偏后端的能力。

这个项目里我重点打磨了三块。第一块是类型边界，我尽量把 Activity 模块的 query、body 和 response 都收敛到 schema 上，让 route 层处理校验后的数据，而不是大量依赖不安全断言。第二块是认证和授权，我把认证和授权拆开，由 middleware 注入 `auth` 和 `authz`，service 层直接消费 `UserRolePermission`，并把权限明确成 `read / update.own / update.any / delete.own / delete.any` 这一套 owner-aware RBAC。第三块是测试和工程化，我补了 schema、service、route 行为测试，并把 `lint + typecheck + unit test` 接进了 CI。

如果让我总结这个项目的价值，我会说它不在于功能有多复杂，而在于我有意识地把一个业务原型逐步打磨成了一个可以讲清楚设计取舍的全栈样本。

## Demo 路线

1. 打开活动列表页，介绍这是当前最完整的业务主模块。
2. 演示筛选和分页，说明查询条件是通过 schema 校验后进入后端的。
3. 打开活动详情，说明列表页、详情弹窗、编辑表单职责分离。
4. 用有权限身份演示编辑或删除。
5. 切换到无权限身份，说明前后端权限边界。
6. 最后补一句 API、错误响应和测试策略。

## 最值得讲的 4 个点

1. 场景更接近真实业务，不是 Todo 或博客。
2. Next.js + Hono + Prisma 的分层比较清楚。
3. RBAC 真正落到了 service 和测试里。
4. 项目是从“先做功能”逐步收紧到“更有工程感”的。

## 常见深问

### 你最满意的设计是什么

认证、授权和业务规则的拆分最满意。认证由 middleware 负责，授权结果聚合成 `authz`，service 直接消费 `UserRolePermission`，这样 route 层不会到处手拼权限信息，也更容易补测试。

### 为什么说它偏 backend-leaning fullstack

因为重点不只是页面，而是接口契约、service/dao 分层、RBAC、错误模型和测试。前端交互有做，但主要是承载完整业务链路。

### 最大技术债是什么

页面层的 API 解析和错误提示逻辑仍然有重复，接下来应该统一成一个切面，让页面只关心成功后的后续处理。
