# 新建活动模块

## 背景

当前 Activity 模块已经具备列表、详情、编辑、删除等能力，但缺少“新建活动”主链路，导致活动模块仍然不完整，也削弱了项目作为面试样本的业务完整性。

Header 中已经存在 `Create` 按钮，但当前并未接入活动模块的创建流程。

## 目标

- 补齐“新建活动”主链路
- 让 Header 的 `Create` 成为活动创建入口
- 创建交互采用 modal
- 创建成功后回到活动列表并看到新增结果

## 范围

- 新建活动路由与 modal
- 新建活动表单
- 活动创建 API 与服务调用
- Header 入口调整
- 最小测试与文档沉淀

## 现状

- 已有编辑表单，可复用部分字段
- 已有 `insertActivityCheck`、`CreateActivityInput`、`createObj`
- 活动模块已经具备列表刷新机制
- 当前没有可用的新建活动页面或 modal

## 方案

- Header 的 `Create` 按钮指向 `/activity/add`
- 未登录点击 `Create` 跳转登录页
- `/activity/add` 直达页渲染“活动列表 + 新建 modal”
- `activity/@modal/(..)activity/add/page.tsx` 作为活动列表内跳转时的拦截 modal 路由
- 抽取共享活动表单字段，复用到编辑和新建两种场景
- 新建表单新增 `title` 字段
- `author` 不允许用户输入，由当前登录用户带入并只读展示
- 创建接口使用 route 侧补齐 `author` 和 `creator_id`
- 写操作继续受登录保护

## 风险与取舍

- 新建页采用“列表 + modal”结构，会复用活动列表请求，但能保持演示体验一致
- 本次不接领队和车辆真实关联，只保留后续扩展空间
- `start_time` / `end_time` 在新增场景收紧为真正必填，避免前端提交空值后落到无效时间

## 验证

- `pnpm type`
- `pnpm test:unit`
- 手动验证：
  - 未登录点击 `Create` 跳转登录
  - 已登录点击 `Create` 打开新增 modal
  - 校验失败时阻止提交
  - 创建成功后关闭 modal 并刷新活动列表

## 结果记录

- 已实现 Header 入口、创建路由、创建 modal、创建 API 与共享表单字段
- 已补最小测试覆盖匿名创建受限和新增 schema 校验
