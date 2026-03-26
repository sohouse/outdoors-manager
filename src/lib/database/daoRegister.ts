import { ActivityDao } from "../features/activity/dao/activity-dao.ts";
import { BaseDao } from "./BaseDao.tsx";
import { ActivityItem, CreateActivityInput, UpdateActivityInput } from "../features/activity/shared/activity.ts";
import { PaginateCondition } from "../types/pagination.ts";

export const daoRegistry: Record<string, () => BaseDao<unknown, unknown, unknown, PaginateCondition>> = {
    activity: () => new ActivityDao() as BaseDao<ActivityItem, CreateActivityInput, UpdateActivityInput, PaginateCondition>
}