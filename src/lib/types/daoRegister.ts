import { ActivityDao } from "../database/activity-dao";
import { BaseDao } from "../database/BaseDao.tsx";
import { ActivityItem, CreateActivityInput, UpdateActivityInput } from "./activity";
import { PaginateCondition } from "./pagination";

export const daoRegistry: Record<string, () => BaseDao<unknown, unknown, unknown, PaginateCondition>> = {
    activity: () => new ActivityDao() as BaseDao<ActivityItem, CreateActivityInput, UpdateActivityInput, PaginateCondition>
}