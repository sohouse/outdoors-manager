import { daoRegistry } from "@/database/IDao";
import { Activity, ActivityCondition } from "@/types/activity";
import { simpleObjCover } from "@/utils/ObjectHelper";
import { PaginateMeta } from "@/types/pagination";
import { pagination } from "@/utils/pageHelper";
import { Hono } from "hono";

const app = new Hono();
export const activityApi = app
  .get('/findByCondition', async (context) => {
    try {
      const query = context.req.query();
      const queryCondition = {} as Activity;
      const condition = simpleObjCover(query, queryCondition as unknown as Record<string, unknown>);

      pagination(condition);
      const daoFactory = daoRegistry['activity']();
      const { items, totalCount } = await daoFactory.findByCondition(condition);

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
    } catch (error) {
      console.error(error);
    }
  })
  .get('/getObjById', async (context) => {
    try {
      const { id } = context.req.query();
      const dao = daoRegistry['activity']();
      const { items } = await dao.findByCondition({ id: id } as ActivityCondition);
      const result = (items[0] as Activity) ?? null;
      return context.json({ result }, 200);
    } catch (error) {
      console.error(error);
    }
  })
  .post('/updateObj', async (context) => {
    try {
      const activity = await context.req.json();

      const dao = daoRegistry['activity']();
      const success = await dao.editObj(activity);
      if (success) return context.json({ result: success }, 200);
      else return context.json({ result: false }, 200);
    } catch {
      return context.json({ result: false }, 200);
    }
  })
  ;