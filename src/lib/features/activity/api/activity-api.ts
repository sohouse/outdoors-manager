import { toActivityVO } from "@/lib/features/activity/shared/activity.ts";
import { Hono } from "hono";
import { deleteById, findByCondition, getObjById, updateObj } from "@/lib/features/activity/service/activity-service.ts";
import { activityConditionCheck, editActivityCheck, activityById, activityPageResponseSchema } from "../shared/activity-check";

const app = new Hono();
export const activityApi = app
    .get('/findByCondition', async (context) => {
        const currentUser = {
            ...(context.get('user') as { id: string; name?: string; username?: string | null }),
            permissions: (context.get('permissions') as string[] | undefined) ?? [],
        };
        const query = activityConditionCheck.parse(context.req.query());
        const result = await findByCondition(query, currentUser);
        const response = {
            ...result,
            items: result.items.map(toActivityVO),
        };
        
        return context.json(activityPageResponseSchema.parse(response), 200);
    })
    .get('/getObjById', async (context) => {
        const currentUser = {
            ...(context.get('user') as { id: string; name?: string; username?: string | null }),
            permissions: (context.get('permissions') as string[] | undefined) ?? [],
        };
        const { id } = activityById.parse(context.req.query());
        const result = await getObjById(id, currentUser);
        return context.json(toActivityVO(result), 200);
    })
    .put('/updateObj', async (context) => {
        const currentUser = {
            ...(context.get('user') as { id: string; name?: string; username?: string | null }),
            permissions: (context.get('permissions') as string[] | undefined) ?? [],
        };
        const activity = editActivityCheck.parse(await context.req.json());
        const success = await updateObj(activity, currentUser);
        return context.json(success, 200);
    })
    .delete('/deleteById', async (context) => {
        const currentUser = {
            ...(context.get('user') as { id: string; name?: string; username?: string | null }),
            permissions: (context.get('permissions') as string[] | undefined) ?? [],
        };
        const { id } = activityById.parse(context.req.query());
        const success = await deleteById(id, currentUser);
        return context.json(success, 200);
    })
    ;
