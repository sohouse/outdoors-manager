import {ActivityConditions, toActivityVO, UpdateActivityInput} from "@/lib/features/activity/shared/activity.ts";
import {simpleObjCover} from "@/lib/utils/object-helper.ts";
import {Hono} from "hono";
import {deleteById, findByCondition, getObjById, updateObj} from "@/lib/features/activity/service/activity-service.ts";

const app = new Hono();
export const activityApi = app
    .get('/findByCondition', async (context) => {
        const query = context.req.query();
        const condition = simpleObjCover(query, ActivityConditions);
        const result = await findByCondition(condition)
        const vo = { ...result, items: (result.items ?? []).map(toActivityVO) };
        return context.json(vo, 200);
    })
    .get('/getObjById', async (context) => {
        const {id} = context.req.query();
        const result = await getObjById(id);
        const vo = toActivityVO(result);
        return context.json(vo, 200);
    })
    .put('/updateObj', async (context) => {
        const activity: UpdateActivityInput = await context.req.json();
        const success = await updateObj(activity);
        return context.json(success, 200);
    })
    .delete('/deleteById', async (context) => {
        const {id} = context.req.query();
        const success = await deleteById(id);
        return context.json(success, 200);
    })
;
