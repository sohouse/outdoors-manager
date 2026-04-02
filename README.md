# Outdoors Manager

一个面向户外活动场景的活动管理平台原型项目，聚焦活动管理、筛选查询、详情查看、用户注册登录与基础权限控制等核心流程。项目基于 Next.js App Router 构建，结合 Hono、Prisma、PostgreSQL 与 Better Auth，实现前后端一体化的全栈应用。

## Overview

这个项目围绕“户外活动管理”场景展开，当前已完成活动列表、详情查看、条件筛选、活动编辑/删除、用户注册登录和接口鉴权等基础能力。

整体结构采用 Next.js 页面层、Hono API 层与 Prisma 数据层组合的方式，覆盖页面展示、接口访问、会话认证和数据库读写等主要链路。

## Demo

- 本地开发地址：`http://localhost:3000`
- API 路径前缀：`/api`
- OpenAPI 文档入口：`/api/openapi`
- 演示截图：可补充活动列表页、登录页、详情页截图
- 在线演示：如后续部署，可补充 Vercel / 自建地址

## Why This Project

这个项目来源于户外活动管理这一类相对贴近真实业务的场景：除了活动信息展示本身，还会涉及活动组织、用户参与、时间安排、领队与资源分配等后续扩展需求。

当前版本以活动管理主线为核心，主要覆盖以下方向：

1. 它比博客、待办清单这类经典练手项目更接近真实业务场景。
2. 它天然适合拆分出多角色、多模块、多状态流转等工程问题，能体现系统设计能力。
3. 它可以覆盖我希望重点训练的全栈能力，包括前端交互、接口设计、数据库建模、认证鉴权和项目工程化。

后续可以在现有基础上继续扩展订单、车辆、领队、排期等业务模块。

## Features

当前已完成的功能包括：

- 用户注册与登录
- 基于 Better Auth 的会话认证
- API 接口鉴权中间件
- 活动列表展示
- 活动详情查看
- 活动条件筛选与分页查询
- 活动编辑 / 删除的基础能力
- 基于 Prisma 的数据库访问层封装
- 基于 Hono 的 API 路由组织
- OpenAPI 文档的初步接入
- 基础主题切换与部分通用 UI 组件抽象

计划中的功能包括：

- 活动创建流程完善
- 订单管理能力
- 用户个人中心与我的活动
- 角色权限与更细粒度的访问控制
- 车辆 / 领队 / 排期等业务模块
- 更完整的 API 文档与参数校验
- 自动化测试与 CI 流程

## Tech Stack

前端：

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI
- Zustand
- React Hook Form
- Zod

后端与接口：

- Hono
- Hono OpenAPI
- Better Auth

数据层：

- Prisma
- PostgreSQL

其他能力：

- Day.js
- Faker（用于测试数据生成）

## Architecture

项目整体采用前后端一体化的全栈结构：

- 使用 Next.js App Router 承担页面路由与应用壳层
- 使用 Hono 组织 `/api` 下的接口路由
- 使用 Prisma 作为数据库访问层
- 使用 Better Auth 处理用户认证与会话管理
- 前端通过页面组件、服务层和 API 客户端访问后端能力
- 数据访问通过 DAO / Service 分层进行组织，降低页面与数据库实现的直接耦合

当前架构重点在于验证以下能力：

- 页面层与接口层解耦
- 接口统一挂载与中间件保护
- 数据模型与查询逻辑集中管理
- 为后续继续扩展业务模块预留结构空间

## Project Structure

```text
src/
  app/                    Next.js 页面路由与布局
  lib/
    api/                  Hono API 主入口与客户端定义
    auth.ts               Better Auth 配置
    components/           UI 组件与业务组件
    database/             Prisma 客户端、DAO、schema、seed
    features/             按功能划分的业务模块
    middlewares/          Hono 中间件
    types/                类型定义
    utils/                通用工具函数
    config/               路由与基础配置
prisma/                   Prisma 相关配置（如保留）
public/                   静态资源
``` 
## Getting Started
### 1. 安装依赖
pnpm install
### 2. 配置环境变量
在项目根目录创建 .env 文件，并填写必要配置，例如：
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_database_url
BETTER_AUTH_SECRET=your_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
### 3. 初始化数据库
根据当前项目脚本配置，可以使用 Prisma 进行迁移、生成与种子数据初始化。
常用命令：
pnpm db:gen
pnpm db:push
pnpm db:seed
### 4. 启动开发环境
pnpm dev
启动后访问：
http://localhost:3000

## Available Scripts
常用脚本说明：
- pnpm dev：启动开发环境
- pnpm build：构建生产包
- pnpm start：启动生产环境
- pnpm lint：运行 ESLint 检查
- pnpm type：执行 TypeScript 类型检查
- pnpm test:unit：使用 Vitest 执行单元测试
- pnpm test:unit:file -- <file>：执行单个测试文件
- pnpm test:unit:name -- "<pattern>" [file]：按测试名过滤执行
- pnpm db:gen：生成 Prisma Client
- pnpm db:push：同步数据库结构
- pnpm db:dev：执行 Prisma migrate dev
- pnpm db:reset：重置数据库
- pnpm db:seed：执行种子数据

单元测试示例：
```bash
pnpm test:unit
pnpm test:unit:file -- src/lib/features/activity/test/activity-check.test.ts
pnpm test:unit:name -- "editActivityCheck should reject invalid date string" src/lib/features/activity/test/activity-check.test.ts
```
## API Documentation
项目已接入 OpenAPI 相关能力，当前可通过以下地址查看接口文档：
``` test
/api/openapi
```

## Challenges and Trade-offs
这个项目在实现过程中，主要关注这些问题：
1. 如何在 Next.js 项目中组织一个清晰的 API 分层，而不是把所有逻辑都直接写在页面里。
2. 如何在快速推进业务功能的同时，尽量保持类型安全和可维护性。
3. 如何让认证、接口保护、数据库访问和前端调用之间形成比较自然的边界。
4. 如何在“先做功能”和“做工程化”之间平衡节奏。

当前版本先完成活动管理与认证的主流程，再逐步补齐测试、CI、部署文档和更完整的业务模块。
## What I Learned
这个项目当前主要体现了以下实践方向：
- 使用 Next.js App Router 组织页面、布局与路由结构
- 在同一个项目中整合前端页面、API 路由与数据库访问
- 使用 Prisma 进行数据建模、查询与迁移管理
- 使用 Better Auth 实现注册、登录、会话与接口鉴权
- 使用 Hono 组织接口路由，并尝试接入 OpenAPI 文档
- 使用 React Hook Form + Zod 处理表单和校验逻辑
- 尝试通过 DAO / Service 分层提升代码结构清晰度
- 类型边界、错误处理、脚本设计与文档整理
## Roadmap
接下来计划继续完善以下内容：
- 完善活动创建、编辑、删除的完整闭环
- 增加活动报名与订单能力
- 增加角色权限与管理后台能力
- 完善 OpenAPI 文档与接口校验
- 增加单元测试与集成测试
- 增加 GitHub Actions CI
- 提供线上部署版本
- 将 README、注释和界面文案进一步英文国际化
## Known Issues
当前项目仍有一些待完善的部分：
- 部分接口文档仍是演示性质，尚未完全与真实业务逻辑对齐
- 自动化测试与 CI 仍未补齐
- 部分代码命名、注释与工程细节仍需整理
- 生产部署与环境隔离策略仍需进一步完善
## License
如后续开源，可补充 MIT License 或其他许可证。
