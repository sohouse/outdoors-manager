import { toActivityVO } from "@/lib/features/activity/shared/activity.ts";
import { Hono } from "hono";
import { deleteById, findByCondition, getObjById, updateObj } from "@/lib/features/activity/service/activity-service.ts";
import { activityConditionCheck, editActivityCheck, activityById, activityPageResponseSchema } from "../shared/activity-check";
import { ApplicationException } from "@/lib/types/application-exception.ts";
import { COMMON_RESPONSE } from "@/lib/types/error-type.ts";

const app = new Hono();
export const activityApi = app
    .get('/findByCondition', async (context) => {
        const currentUser = context.get('authz');
        const query = activityConditionCheck.parse(context.req.query());
        const result = await findByCondition(query, currentUser);
        const response = {
            ...result,
            items: result.items.map(toActivityVO),
        };

        return context.json(activityPageResponseSchema.parse(response));
    })
    .get('/getObjById', async (context) => {
        const currentUser = context.get('authz');
        const { id } = activityById.parse(context.req.query());
        const result = await getObjById(id, currentUser);
        return context.json(toActivityVO(result));
    })
    .put('/updateObj', async (context) => {
        const currentUser = context.get('authz');
        if (!currentUser) {
            throw new ApplicationException(COMMON_RESPONSE.UNAUTHORIZED);
        }
        const activity = editActivityCheck.parse(await context.req.json());
        const success = await updateObj(activity, currentUser);
        return context.json(success);
    })
    .delete('/deleteById', async (context) => {
        const currentUser = context.get('authz');
        if (!currentUser) {
            throw new ApplicationException(COMMON_RESPONSE.UNAUTHORIZED);
        }
        const { id } = activityById.parse(context.req.query());
        const success = await deleteById(id, currentUser);
        return context.json(success);
    })
    ;
