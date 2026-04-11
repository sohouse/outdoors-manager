# 统一 ApplicationResponse 解析与页面错误提示切面

## 背景

当前前端页面和组件里已经存在统一的响应契约 `ApplicationResponse`，也有底层 `unwrapResponse` 可以把失败响应转成 `ApplicationException`。但在页面层，这套逻辑仍然是分散重复的。

当前重复模式主要表现为：

- 页面或组件直接调用 `honoClient`
- 页面或组件手动调用 `unwrapResponse`
- 页面或组件各自 `catch`
- 页面或组件各自根据 `ApplicationException` 组装 `errorInfo`
- 页面或组件各自渲染 `ErrorAlert`

当前能看到的重复点包括：

- `src/app/(app)/activity/page.tsx`
- `src/lib/features/activity/client/activity-detail-modal-client.tsx`
- `src/lib/features/activity/client/delete-dialog.tsx`
- `src/app/auth/login/page.tsx`
- `src/app/auth/sign-up/page.tsx`
- `src/lib/components/web/Header.tsx`

这会导致页面层同时承担三类职责：

1. 发起 API 请求
2. 解析 API 协议
3. 决定错误如何展示

这三件事里，后两者属于典型横切关注点，继续分散下去会让页面越来越臃肿，也不利于后续统一交互体验。

## 目标

这次改造希望达到以下目标：

1. 页面不再直接处理 `ApplicationResponse` 协议细节。
2. 页面不再重复写 `ApplicationException -> errorInfo -> ErrorAlert` 的转换逻辑。
3. 页面只关心：
   成功后要做什么。
4. 失败时的解析和提示尽量通过统一切面处理。
5. 兼容当前已有的 `ApplicationResponse`、`ApplicationException` 和 `ErrorAlert` 体系，不做大范围协议重写。

## 非目标

这次方案不打算解决以下事情：

- 不重写后端返回协议
- 不引入新的远程状态库
- 不一次性重构所有页面的数据获取方式
- 不处理 React 渲染异常的 Error Boundary 体系

## 现状分析

### 已有基础

当前仓库已经有两块很好的基础：

1. [response.ts](/home/will/workspace/outdoor-manager/src/lib/api/response.ts)
   已经统一了 `ApplicationResponse` 的解包逻辑。
2. [application-exception.ts](/home/will/workspace/outdoor-manager/src/lib/types/application-exception.ts)
   已经统一了业务异常类型。

也就是说，协议级统一已经做了一半，缺的是“页面怎么统一消费异常”。

### 主要问题

#### 1. API 协议仍然泄漏到页面层

像活动列表页、删除弹窗、详情编辑弹窗都直接碰到：

- `honoClient`
- `unwrapResponse`
- `ApplicationException`

这使页面需要知道过多 API 协议细节。

#### 2. 错误展示逻辑高度重复

现在常见代码模式是：

```ts
try {
  const res = await ...
  const result = await unwrapResponse(res)
} catch (error) {
  const message = error instanceof ApplicationException ? error.message : 'xxx失败'
  const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code
  setErrorInfo({ title: code, desc: message })
}
```

这段逻辑已经是明显可抽象的横切面。

#### 3. 错误展示位置不统一

现在很多组件会直接返回：

```tsx
errorInfo ? <ErrorAlert ... /> : <ActualUI />
```

这意味着：

- 错误 UI 是局部替换式
- 每个页面自己决定位置和形式
- 后续如果切换成 toast、dialog 或全局 alert，改动面会很大

## 方案

建议分三层推进，不要一步到位大改。

### 第一层：保留 `unwrapResponse` 作为底层协议解析器

这一层保持现状，不需要推翻。

职责：

- 接收 `ClientResponse`
- 判断是否符合 `ApplicationResponse`
- 失败时抛 `ApplicationException`
- 成功时返回 `content`

这一层本质是协议适配器。

### 第二层：增加模块级 API facade

目标是让页面不再直接依赖 `honoClient + unwrapResponse`。

建议新增模块级调用函数，例如：

- `src/lib/features/activity/service/fetch-activity-list.ts`
- `src/lib/features/activity/service/update-activity.ts`
- `src/lib/features/activity/service/delete-activity.ts`
- `src/lib/features/auth/service/login.ts`
- `src/lib/features/auth/service/sign-up.ts`

如果已有类似函数，则继续往这个方向收敛。

每个 facade 的职责：

- 调用 `honoClient`
- 调用 `unwrapResponse`
- 返回业务成功结果
- 失败时保持抛出 `ApplicationException`

这样页面层看到的是“业务动作”，而不是“协议细节”。

### 第三层：增加全局错误提示切面

建议新增：

- `src/lib/components/web/AppErrorProvider.tsx`
- `src/lib/hooks/use-app-error.ts`

设计思路：

- Provider 持有当前全局错误状态
- 暴露 `showError(error, fallbackMessage?)`
- Provider 统一在顶层渲染 `ErrorAlert` 或未来的 toast/dialog

页面使用方式变成：

```ts
const { showError } = useAppError()

try {
  await updateActivity(payload)
  // success flow
} catch (error) {
  showError(error, '更新活动失败')
}
```

这样页面不再需要：

- `setErrorInfo`
- `ApplicationException` 到展示对象的重复映射
- 局部 `ErrorAlert` 替换式渲染

### 可选第四层：增加 `useApiAction`

如果第二层和第三层稳定后，仍然发现页面里存在大量重复的：

- `loading`
- `try/catch`
- 成功回调
- 错误提示

可以再加一层：

- `src/lib/hooks/use-api-action.ts`

目标是统一异步动作调用模式。

例如：

```ts
const { run, loading } = useApiAction(updateActivity, {
  onSuccess: () => {
    router.back()
    setPageRefresh()
  },
  fallbackMessage: '更新活动失败',
})

await run(payload)
```

这一层不是第一优先级，但它能进一步减少页面样板代码。

## 推荐的最小实现

为了降低一次性改造风险，建议先做一个最小版本：

### 第 1 步

新增 `AppErrorProvider` 和 `useAppError`。

### 第 2 步

把以下几个地方改成统一错误提示方式：

- Activity 列表页
- 登录页
- 注册页
- 删除弹窗
- 活动详情编辑弹窗

### 第 3 步

把 Activity 模块继续补成模块级 facade。

## 目录建议

建议新增：

```text
src/lib/components/web/AppErrorProvider.tsx
src/lib/hooks/use-app-error.ts
src/lib/hooks/use-api-action.ts
src/lib/features/activity/service/fetch-activity-list.ts
src/lib/features/activity/service/update-activity.ts
src/lib/features/activity/service/delete-activity.ts
```

如果想先更保守，也可以把 facade 放在：

```text
src/lib/features/activity/api/
```

但从当前仓库习惯看，放在 feature 下的 service 更自然。

## 使用方式示意

### 现状

```ts
const [errorInfo, setErrorInfo] = useState(...)

try {
  const res = await honoClient.api.activity['deleteById'].$delete({ query: { id } })
  const result = await unwrapResponse(res)
  if (result) {
    setPageRefresh()
  }
} catch (error) {
  const message = error instanceof ApplicationException ? error.message : '删除失败'
  const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code
  setErrorInfo({ title: code, desc: message })
}
```

### 目标

```ts
const { showError } = useAppError()

try {
  const result = await deleteActivity(id)
  if (result) {
    setPageRefresh()
  }
} catch (error) {
  showError(error, '删除失败')
}
```

### 进一步目标

```ts
const { run, loading } = useApiAction(deleteActivity, {
  fallbackMessage: '删除失败',
  onSuccess: () => setPageRefresh(),
})

await run(id)
```

## 风险与取舍

### 风险 1：错误提示从局部替换改成全局后，交互感受会变化

有些页面当前是“出错后整块内容变成 `ErrorAlert`”，改成全局提示后，页面仍然会保留原内容。这个变化需要统一设计选择。

建议：

- 对“页面初始化加载失败”保留页面级错误展示
- 对“用户动作失败”优先改为全局提示

这样更符合直觉。

### 风险 2：一次性重构太多页面容易引入回归

建议按模块分批推进，不要一次性全改。

### 风险 3：Facade 和 service 命名可能与后端 service 重名

当前仓库中 `service` 既有前端调用函数，也有后端业务逻辑。

建议：

- 前端调用函数命名更强调动作，如 `fetchActivityDetail`
- 后端业务函数继续保留在 feature service 中
- 如果后续混淆加重，可以再拆成 `client-service` 或 `query-service`

## 分步实施建议

### 第一批

- `AppErrorProvider`
- `useAppError`
- 登录页
- 注册页
- 删除弹窗

这批改动小，收益高。

### 第二批

- 活动列表页
- 活动详情编辑弹窗
- Header 登出逻辑

### 第三批

- `useApiAction`
- 批量替换重复异步动作模式

## 验证

最小验证建议：

1. `pnpm type`
2. `pnpm test:unit`
3. 手动验证以下场景：
   登录失败是否统一提示
   注册失败是否统一提示
   删除失败是否统一提示
   活动列表加载失败是否仍能正确展示
   编辑失败是否统一提示

## 完成标准

满足以下条件时，可以认为这次改造完成：

- 页面不再重复实现 `ApplicationException -> errorInfo` 映射
- 用户动作失败的提示逻辑已统一
- Activity 和 auth 相关页面不再直接分散处理协议细节
- 不影响当前 `ApplicationResponse`、测试和已有业务契约

## 结果记录

当前状态：

- 文档方案已建立
- 代码尚未开始实施

建议下一步直接以本文件为依据做第一批实现。
