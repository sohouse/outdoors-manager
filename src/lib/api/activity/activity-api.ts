import { daoRegistry } from "@/lib/database/IDao.tsx";
import {ActivityConditions, ActivityItem, UpdateActivityInput} from "@/lib/types/activity.ts";
import { simpleObjCover } from "@/lib/utils/object-helper.ts";
import {PageResult, PaginateMeta} from "@/lib/types/pagination.ts";
import { Hono } from "hono";
import {DEFAULT_LIMIT} from "@/lib/constants.ts";

const app = new Hono();
export const activityApi = app
  .get('/findByCondition', async (context) => {
    try {
      const query = context.req.query();
      const condition = simpleObjCover(query, ActivityConditions);

      const daoFactory = daoRegistry['activity']();
      const { items, totalCount } = await daoFactory.findByCondition(condition);

      const meta: PaginateMeta = {
        totalCount,
        limit: condition.limit,
        totalPage: Math.ceil(totalCount / (condition.limit ?? 1)),
        page: condition.page,
      };

      return context.json<PageResult<ActivityItem>>({
        meta,
        items: items as ActivityItem[]
      }, 200);
    } catch {
      return context.json({
        items: [] as ActivityItem[], meta: {
          totalCount: 0,
          limit: DEFAULT_LIMIT,
          totalPage: 0,
          page: 0,
        }
      }, 500);
    }
  })
  .get('/getObjById', async (context) => {
    try {
      const { id } = context.req.query();
      const dao = daoRegistry['activity']();
      const { items } = await dao.findByCondition({ id: id } as ActivityConditions);
      const result = (items[0] as ActivityItem) ?? null;
      return context.json({ result }, 200);
    } catch (error) {
      console.error(error);
    }
  })
  .post('/updateObj', async (context) => {
    try {
      const activity: UpdateActivityInput = await context.req.json();

      const dao = daoRegistry['activity']();
      const success = await dao.editObj(activity);
      if (success) return context.json({ result: success }, 200);
      else return context.json({ result: false }, 200);
    } catch {
      return context.json({ result: false }, 200);
    }
  })
  ;
