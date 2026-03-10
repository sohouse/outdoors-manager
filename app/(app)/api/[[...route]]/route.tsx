// import { app } from '@/app/(app)/server/main';
// import {handle} from 'hono/vercel'

// // next解析用户请求，配置请求类型对应的处理方法，此处都是app
// export const GET = handle(app);
// export const POST = handle(app);
// export const PUT = handle(app);
// export const PATCH = handle(app);
// export const DELETE = handle(app);
// export const OPTIONS = handle(app);
// export const HEAD = handle(app);
import { daoRegistry } from "@/database/IDao";
import { Activity } from "@/types/activity";
import { PaginateMeta } from "@/types/pagination";
import { simpleObjCover } from "@/utils/ObjectHelper";
import { pagination } from "@/utils/pageHelper";
import { Hono } from "hono";
import { hc } from "hono/client";
import { handle } from "hono/vercel";

// 定义接口并导出
const app = new Hono()
  .get('/findByCondition', async (context) => {
    const query = context.req.query();
    console.log('query-'+JSON.stringify(query));
    const queryCondition = {} as Activity;
    const condition = simpleObjCover(query, queryCondition as unknown as Record<string, unknown>);

    pagination(condition);
    const daoFactory = daoRegistry['activity']();
    const { items, totalCount } = await daoFactory.findByCondition(condition);
    console.log('2222='+ JSON.stringify(items));

    const meta: PaginateMeta = {
      totalCount,
      currentCount: items.length,
      pageSize: condition.limit,
      totalPage: Math.ceil(totalCount / (condition.limit ?? 1)),
      currentPage: condition.page,
    };

    const vitifyResult = context.json({
      meta,
      items: items as Activity[]
    }, 200);;
    return vitifyResult;
  });
  // 用于类型安全
  type AppType = typeof app;

  // 导出hono client，用于接口调用
  const honoClient = hc<AppType>(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000');
  // nextjs用于拦截GET请求
  export const GET = handle(app);
  export {honoClient};