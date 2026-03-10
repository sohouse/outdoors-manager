import {prettyJSON} from 'hono/pretty-json'
import {activityApi} from "@/app/(app)/server/activity/api";
import { Hono } from 'hono';
import { hc } from 'hono/client';

// 路由注册中心，接收动态兜底路由转过来的业务请求，在注册路由中进行分发
const app = new Hono().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('main api'));
app.notFound((c) => c.json({message: 'not found', ok: false}, 404));
// 分发业务路由请求
const routes = app.route('activity', activityApi);
type AppType = typeof routes;
const honoClient = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');

export {app, honoClient}