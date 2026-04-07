import { ActivityDao } from "../features/activity/dao/activity-dao.ts";

export const daoRegistry = {
    activity: () => new ActivityDao()
}