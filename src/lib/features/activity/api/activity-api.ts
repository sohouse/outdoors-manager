import {ActivityConditions, toActivityVO, UpdateActivityInput} from "@/lib/features/activity/shared/activity.ts";
import {simpleObjCover} from "@/lib/utils/object-helper.ts";
import {Hono} from "hono";
import {deleteById, findByCondition, getObjById, updateObj} from "@/lib/features/activity/service/activity-service.ts";

const app = new Hono();
export const activityApi = app
    .get('/findByCondition', async (context) => {
        const currentUser = {
            ...(context.get('user') as { id: string; name?: string; username?: string | null }),
            permissions: (context.get('permissions') as string[] | undefined) ?? [],
        };
        const query = context.req.query();
        const condition = simpleObjCover(query, ActivityConditions);
        const result = await findByCondition(condition, currentUser)
        const vo = { ...result, items: (result.items ?? []).map(toActivityVO) };
        return context.json(vo, 200);
    })
    .get('/getObjById', async (context) => {
        const currentUser = {
            ...(context.get('user') as { id: string; name?: string; username?: string | null }),
            permissions: (context.get('permissions') as string[] | undefined) ?? [],
        };
        const {id} = context.req.query();
        const result = await getObjById(id, currentUser);
        const vo = toActivityVO(result);
        return context.json(vo, 200);
    })
    .put('/updateObj', async (context) => {
        const currentUser = {
            ...(context.get('user') as { id: string; name?: string; username?: string | null }),
            permissions: (context.get('permissions') as string[] | undefined) ?? [],
        };
        const activity: UpdateActivityInput = await context.req.json();
        const success = await updateObj(activity, currentUser);
        return context.json(success, 200);
    })
    .delete('/deleteById', async (context) => {
        const currentUser = {
            ...(context.get('user') as { id: string; name?: string; username?: string | null }),
            permissions: (context.get('permissions') as string[] | undefined) ?? [],
        };
        const {id} = context.req.query();
        const success = await deleteById(id, currentUser);
        return context.json(success, 200);
    })
;
