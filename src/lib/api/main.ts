import { activityApi } from "@/lib/api/activity/activity-api.ts";
import { OpenAPIHono } from '@hono/zod-openapi';
import { hc } from 'hono/client';
// 为了使用导入值的具名导入
import { prettyJSON } from 'hono/pretty-json';
import { openapiApp } from "./openapi.ts";

// 路由注册中心，接收动态兜底路由转过来的业务请求，在注册路由中进行分发
// const app = new Hono().basePath('/api');
const honoApp = new OpenAPIHono().basePath('/api');
honoApp.use(prettyJSON());
honoApp.get('/', (c) => c.text('main api'));
honoApp.notFound((c) => c.json({ message: 'not found', ok: false }, 404));
// 分发业务路由请求
const routes = honoApp.route('activity', activityApi);
// 挂载openapi文档到 /api/openapi 前缀
honoApp.route('/openapi', openapiApp);
type AppType = typeof routes;
const honoClient = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3002');

// 只为了让代码执行的副作用导入，需要在 app 定义之后用动态 import
// import('./openapi.ts');
// 静态副作用导入： import '' -> 模块加载时提前执行
// 动态副作用导入： import ('') -> 顺序执行

export { honoApp, honoClient };