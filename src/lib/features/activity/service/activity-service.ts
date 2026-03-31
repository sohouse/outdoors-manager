import {
    ActivityConditions,
    ActivityItem,
    CreateActivityInput,
    UpdateActivityInput
} from '@/lib/features/activity/shared/activity.ts';
import {PageResult, PaginateCondition, PaginateMeta} from '@/lib/types/pagination.ts';
import {daoRegistry} from '@/lib/database/daoRegister.ts'
import {ApplicationException} from "@/lib/types/ApplicationException.ts";
import {COMMON_ERRORS} from "@/lib/types/ErrorType.ts";

const activityDao = daoRegistry.activity();

export async function deleteById(
    id: string
): Promise<boolean> {
    return activityDao.deleteById(id)
}

export async function findByCondition<ConditionType extends PaginateCondition>(condition: ConditionType): Promise<PageResult<ActivityItem>> {
    const {items, totalCount} = await activityDao.findByCondition(condition);

    const meta: PaginateMeta = {
        totalCount,
        limit: condition.limit,
        totalPage: Math.ceil(totalCount / (condition.limit ?? 1)),
        page: condition.page,
    };

    return {
        meta,
        items: items as ActivityItem[]
    };
}

export async function getObjById(id: string): Promise<ActivityItem> {
    const condition = {id: id} as ActivityConditions;
    const {items} = await activityDao.findByCondition(condition);
    const [item] = items;
    if (!item) {
        throw new ApplicationException(COMMON_ERRORS.NOT_FOUND);
    }
    return item as ActivityItem;
}

export async function updateObj(activity: UpdateActivityInput) {
    const success = await activityDao.editObj(activity);
    return {success, data: activity};
}

export async function createObj(activity: CreateActivityInput) {
    const success = await activityDao.insertObj(activity);
    return {success, data: activity};
}
