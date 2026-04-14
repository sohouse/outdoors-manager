# 缩小登录校验范围，优化面试演示首屏体验

## 背景

当前网站逻辑是：如果请求中拿不到 session，则在应用主布局层直接跳转到登录页。这种实现对“业务系统”本身是合理的，但对当前仓库作为面试项目的使用场景不够友好。

当前问题主要有两点：

1. 面试官或第一次打开项目的人，一进入网站就会被重定向到登录页。
2. 如果对方不愿意继续走注册或登录流程，很容易在第一步就流失，对活动列表、页面结构、筛选与分页、详情查看等主能力没有感知。

这个项目当前的更高优先级，是先让访问者快速看到主功能和业务结构，再在需要修改数据时引导登录。这更符合“面试样本”的展示目标，也更符合当前 `docs/PRODUCT.md` 中“先强化主链路与可讲性”的阶段判断。

## 目标

这次改造希望达到以下目标：

1. 登录验证范围缩小为逻辑模块列表外的所有写操作，包括新增、删除、编辑。
2. 查看首页、查看活动列表页、翻页均不需要登录。
3. 登录窗口增加明显提示：`默认账号：admin；密码：a1234567`。
4. 保持现有 Activity 主链路和数据流尽量稳定，不为这次演示优化引入大范围重构。
5. 让未登录访问者能顺畅完成“打开网站 -> 看列表 -> 点详情 -> 看到登录入口或只读内容”这一条面试演示路径。

## 范围

### 包含

- 缩小应用层登录拦截范围
- 让公开浏览页面在未登录情况下可访问
- 将写操作继续保留为需要登录
- 调整活动页未登录时的权限读取行为
- 在登录页增加默认体验账号提示
- 根据新行为补充或调整最小测试
- 更新必要的文档说明

### 不包含

- 不重写后端返回协议
- 不引入新的远程状态库
- 不一次性重构所有页面的数据获取方式
- 不修改现有数据流转逻辑
- 不在这次改造中引入全局错误 provider 或统一 action 切面
- 不处理更细粒度的匿名用户权限体系

## 现状

当前实现的关键点如下。

### 1. 应用布局层直接拦截未登录用户

在 [src/app/(app)/layout.tsx](/home/will/workspace/outdoor-manager/src/app/(app)/layout.tsx) 中，当前逻辑会：

- 读取当前 session
- 如果没有 session，则直接 `redirect('/auth/login')`

这意味着整个 `(app)` 组下的页面，在未登录时都无法进入。

### 2. Hono API 入口目前对整个 Activity 路由做了认证中间件保护

在 [src/lib/api/main.ts](/home/will/workspace/outdoor-manager/src/lib/api/main.ts) 中，当前逻辑是：

- `honoService.use('/activity/*', authMiddleware)`
- `honoService.use('/rolePermission/*', authMiddleware)`

这意味着 Activity 下的读接口和写接口都要求登录。

### 3. 活动列表页会在加载列表后继续请求当前用户权限

在 [src/app/(app)/activity/page.tsx](/home/will/workspace/outdoor-manager/src/app/(app)/activity/page.tsx) 中，页面做了两类请求：

- 请求活动列表
- 请求 `currentUserRolePermission`

如果第二步在未登录时返回 `401`，当前页面会把它视为错误并展示 `ErrorAlert`。这和本次目标冲突，因为未登录浏览活动列表应该是合法场景，而不是错误场景。

### 4. Header 已具备“已登录 / 未登录”两种 UI 形态

在 [src/lib/components/web/Header.tsx](/home/will/workspace/outdoor-manager/src/lib/components/web/Header.tsx) 中：

- 已登录显示用户信息与登出
- 未登录显示注册和登录入口

这部分可以继续保留，并天然适配“可匿名浏览、按需登录”的体验。

### 5. 登录页目前缺少明显的演示账号提示

在 [src/app/auth/login/page.tsx](/home/will/workspace/outdoor-manager/src/app/auth/login/page.tsx) 中，当前有表单，但没有突出显示默认演示账号与密码。

## 方案

本次改造建议按“最小变更 + 明确边界”推进，不做大规模结构重写。

### 一、缩小页面层登录拦截范围

核心调整：

- 不再在 `(app)` 根布局层对所有子页面统一 `redirect('/auth/login')`

建议做法：

- 移除或放宽 [src/app/(app)/layout.tsx](/home/will/workspace/outdoor-manager/src/app/(app)/layout.tsx) 中的强制登录跳转
- 保持公共浏览页面可直接进入

这样首页、活动列表页、分页等公开查看能力就能直接打开。

### 二、把后端认证要求从“整个 Activity 模块”收紧到“写操作”

当前问题不只是页面跳转，还有 API 层对整个 `/activity/*` 的统一认证保护。

建议目标行为：

- 公开允许：
  - `findByCondition`
  - `getObjById`
- 继续要求登录：
  - `updateObj`
  - `deleteById`
  - 未来的 `createObj`

建议做法：

1. 将 [src/lib/api/main.ts](/home/will/workspace/outdoor-manager/src/lib/api/main.ts) 中对 `/activity/*` 的统一 `authMiddleware` 移除。
2. 在 Activity route 中只对写操作施加认证要求。

可选实现方式：

- 方式 A：在 `activity-api.ts` 的具体写接口里主动检查 `authz`
- 方式 B：为写接口单独挂 middleware

这次更推荐方式 A，原因是改动面小，且更贴合当前不大改路由组织的约束。

### 三、放宽读接口的 service 要求

当前 `findByCondition` 和 `getObjById` 的 service 逻辑依赖 `currentUser: UserRolePermission` 并强制检查 `activity:read`。

如果要实现“未登录可查看”，需要明确新的读权限策略：

- 活动列表和活动详情视为公开读资源
- 未登录用户无需具备 `activity:read`

建议方式：

- 将读接口 service 改为允许匿名访问
- 仅在写接口中保留基于 `UserRolePermission` 的权限校验

实现上可考虑：

- `findByCondition(condition, currentUser?)`
- `getObjById(id, currentUser?)`

并在内部逻辑中：

- 如果是公开读，则不再强依赖 `currentUser`
- `updateObj` / `deleteById` 继续要求 `currentUser`

### 四、调整活动页对权限接口的调用方式

当前活动页总会去拉：

- `currentUserRolePermission`

这在未登录时会报 `401`，但未登录浏览列表本来应该合法。

建议调整为：

- 未登录时，不把拉权限失败视为页面错误
- 权限接口请求失败若是 `401`，则将 `authz` 置为 `null` 并继续渲染列表
- 只有非预期错误才显示页面错误

这样页面行为会变成：

- 未登录也能看活动列表
- 但没有编辑/删除权限入口
- 已登录用户再按原逻辑展示编辑/删除能力

### 五、活动详情页保持“公开只读，登录后可编辑”

本次目标没有要求活动详情一定登录后才能看，因此建议保持和列表一致：

- 详情读取允许匿名访问
- 编辑动作继续要求登录和权限

如果当前详情页里已经根据 `authz` 区分只读/可编辑，这部分可以继续沿用，只需允许 `authz` 缺失时展示只读态。

### 六、登录页增加演示账号提示

在 [src/app/auth/login/page.tsx](/home/will/workspace/outdoor-manager/src/app/auth/login/page.tsx) 中增加明显提示区域。

建议提示文案：

- 默认账号：`admin`
- 默认密码：`a1234567`

建议展示位置：

- 表单顶部或提交按钮上方
- 使用较明显但不喧宾夺主的卡片、提示框或说明文字

目标是让第一次访问者不需要翻文档就能完成登录。

### 七、文档同步更新

建议同步更新：

- 根目录 `README.md`
- 如有必要补充到 `docs/PRODUCT.md` 或 `docs/ARCHITECTURE.md`

主要说明：

- 当前系统支持匿名浏览活动列表与详情
- 写操作需要登录
- 提供默认演示账号

## 主要改动文件建议

本次改造大概率会涉及这些文件：

- [src/app/(app)/layout.tsx](/home/will/workspace/outdoor-manager/src/app/(app)/layout.tsx)
- [src/lib/api/main.ts](/home/will/workspace/outdoor-manager/src/lib/api/main.ts)
- [src/lib/features/activity/api/activity-api.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/api/activity-api.ts)
- [src/lib/features/activity/service/activity-service.ts](/home/will/workspace/outdoor-manager/src/lib/features/activity/service/activity-service.ts)
- [src/app/(app)/activity/page.tsx](/home/will/workspace/outdoor-manager/src/app/(app)/activity/page.tsx)
- [src/app/auth/login/page.tsx](/home/will/workspace/outdoor-manager/src/app/auth/login/page.tsx)
- 可能补测试的文件：
  - [src/lib/api/auth-route.test.ts](/home/will/workspace/outdoor-manager/src/lib/api/auth-route.test.ts)
  - Activity route / service 相关测试文件

## 风险与取舍

### 风险 1：公开读会改变当前 RBAC 叙事

原先 Activity 模块是“所有读写都需要授权”；现在变成“读公开，写受限”。

取舍：

- 对面试展示更友好
- 业务安全边界仍然清楚，因为真正敏感的是写操作

### 风险 2：活动页未登录时权限请求报错会污染页面状态

如果处理不当，活动列表虽然公开了，但页面仍可能因为 `currentUserRolePermission` 的 `401` 显示错误弹窗。

取舍：

- 这次必须显式把 `401` 当成匿名态，而不是页面错误

### 风险 3：移除布局层登录拦截后，其他依赖登录的页面可能裸露

例如未来新增的创建页、个人页、后台操作页，如果仍放在 `(app)` 组下，可能失去统一保护。

取舍：

- 当前阶段先优先服务演示体验
- 后续如果登录页内写操作页增多，可以再拆出受保护的 route group，例如 `(protected)`

### 风险 4：后端路由认证保护从统一 middleware 改成按接口控制后，容易漏掉新写接口

取舍：

- 需要在 route 文件中明确标注哪些接口需要认证
- 后续新增写接口时要同步检查

## 验证

### 类型检查

```bash
pnpm type
```

### 测试

```bash
pnpm test:unit
```

如果改动了路由保护逻辑，建议重点关注或补充：

- Activity 读接口未登录可访问
- Activity 写接口未登录返回 `401`
- 活动页未登录时不会因为权限接口 `401` 整页报错

### 手动验证路径

1. 未登录直接打开首页，应可进入。
2. 未登录打开活动列表页，应可看到列表。
3. 未登录切换分页，应可继续浏览。
4. 未登录打开活动详情，应可查看只读内容。
5. 未登录尝试编辑或删除，应被引导登录或收到未授权结果。
6. 打开登录页，应能明显看到默认账号提示：
   `admin / a1234567`
7. 使用默认账号登录后，应恢复原有可编辑/可删除能力。

## 结果记录

当前状态：

- 方案已创建
- 代码尚未实施

实施后建议补充：

- 实际修改了哪些文件
- 与原方案是否有偏差
- 是否引入了新的受保护 route group
