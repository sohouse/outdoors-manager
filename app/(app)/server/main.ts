import {prettyJSON} from 'hono/pretty-json'
import {activityApi} from "@/app/(app)/server/activity/api";
import { createHonoApp } from "./common/app";

// 路由注册中心，接收动态兜底路由转过来的业务请求，在注册路由中进行分发
const app = createHonoApp().basePath('/api');
app.use(prettyJSON());
app.get('/', (c) => c.text('main api'));
app.notFound((c) => c.json({message: 'not found', ok: false}, 404));
// 分发业务路由请求
const routes = app.route('activity', activityApi);
type AppType = typeof routes;
export {app, type AppType}