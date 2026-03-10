// next解析用户请求，配置请求类型对应的处理方法，此处都是app
import { handle } from "hono/vercel";
import { app } from "../../server/main";

// nextjs用于拦截GET请求
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app);
export const HEAD = handle(app);