import { toActivityVO } from "@/lib/features/activity/shared/activity.ts";
import { Hono } from "hono";
import { createObj, deleteById, findByCondition, getObjById, updateObj } from "@/lib/features/activity/service/activity-service.ts";
import { activityConditionCheck, createActivityRequestCheck, editActivityCheck, activityById, activityPageResponseSchema, insertActivityCheck } from "../shared/activity-check";
import { ApplicationException } from "@/lib/types/application-exception.ts";
import { COMMON_RESPONSE } from "@/lib/types/error-type.ts";
import { authMiddleware } from "@/lib/middlewares/auth-middleware.ts";

const app = new Hono();
export const activityApi = app
    .get('/findByCondition', async (context) => {
        // const currentUser = context.get('authz');
        const query = activityConditionCheck.parse(context.req.query());
        const result = await findByCondition(query);
        const response = {
            ...result,
            items: result.items.map(toActivityVO),
        };

        return context.json(activityPageResponseSchema.parse(response));
    })
    .get('/getObjById', async (context) => {
        // const currentUser = context.get('authz');
        const { id } = activityById.parse(context.req.query());
        const result = await getObjById(id);
        return context.json(toActivityVO(result));
    })
    .post('/createObj', authMiddleware, async (context) => {
        const currentUser = context.get('auth');
        const activityRequest = createActivityRequestCheck.parse(await context.req.json());
        const activity = insertActivityCheck.parse({
            ...activityRequest,
            author: currentUser.user.name,
            creator_id: currentUser.user.id,
        });

        const success = await createObj(activity);
        return context.json(success);
    })
    .put('/updateObj', authMiddleware, async (context) => {
        const currentUser = context.get('authz');
        if (!currentUser) {
            throw new ApplicationException(COMMON_RESPONSE.UNAUTHORIZED);
        }
        const activity = editActivityCheck.parse(await context.req.json());
        const success = await updateObj(activity, currentUser);
        return context.json(success);
    })
    .delete('/deleteById', authMiddleware, async (context) => {
        const currentUser = context.get('authz');
        if (!currentUser) {
            throw new ApplicationException(COMMON_RESPONSE.UNAUTHORIZED);
        }
        const { id } = activityById.parse(context.req.query());
        const success = await deleteById(id, currentUser);
        return context.json(success);
    })
    ;
