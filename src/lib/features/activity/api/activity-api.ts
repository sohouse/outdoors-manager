import {ActivityConditions, ActivityItem, UpdateActivityInput} from "@/lib/features/activity/shared/activity.ts";
import {simpleObjCover} from "@/lib/utils/object-helper.ts";
import {PageResult} from "@/lib/types/pagination.ts";
import {Hono} from "hono";
import {DEFAULT_LIMIT} from "@/lib/constants.ts";
import {deleteById, findByCondition, getObjById, updateObj} from "@/lib/features/activity/service/activity-service.ts";

const app = new Hono();
export const activityApi = app
    .get('/findByCondition', async (context) => {
        try {
            const query = context.req.query();
            const condition = simpleObjCover(query, ActivityConditions);
            const result = await findByCondition(condition);
            return context.json<PageResult<ActivityItem>>(result, 200);
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
            const {id} = context.req.query();
            const activity = await getObjById(id);
            return context.json(activity, 200);
        } catch (error) {
            return context.json({message: error}, 500);
        }
    })
    .post('/updateObj', async (context) => {
        try {
            const activity: UpdateActivityInput = await context.req.json();
            const success = await updateObj(activity);
            if (success) return context.json({result: success}, 200);
            else return context.json({result: false}, 500);
        } catch {
            return context.json({result: false}, 500);
        }
    })
    .post('/deleteById', async (context) => {
        try {
            const {id} = context.req.query();
            const success = await deleteById(id);
            if (success) return context.json({result: success}, 200);
            else return context.json({result:false}, 500);
        } catch {
            return context.json({result:false}, 500);
        }
    })
;
