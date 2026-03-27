import {
    ActivityConditions,
    ActivityItem,
    CreateActivityInput,
    UpdateActivityInput
} from '@/lib/features/activity/shared/activity.ts';
import {PageResult, PaginateCondition, PaginateMeta} from '@/lib/types/pagination.ts';
import {daoRegistry} from '@/lib/database/daoRegister.ts'

const activityDao = daoRegistry.activity();

export async function deleteById(
    id: string
): Promise<boolean> {
    return activityDao.deleteById(id)
}

export async function findByCondition<ConditionType extends PaginateCondition>(condition: ConditionType): Promise<PageResult<ActivityItem>> {
    // 组装分页条件
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

export async function getObjById(id: string): Promise<ActivityItem | null> {
    try {
        const {items} = await activityDao.findByCondition({id: id} as ActivityConditions);
        const [item] = items;
        return (item as ActivityItem) ?? null;
    } catch (error) {
        console.error('Error fetching activity:', error);
        throw error;
    }
}

export async function updateObj(activity: UpdateActivityInput) {
    try {
        const success = await activityDao.editObj(activity);
        return {success, data: activity};
    } catch (error) {
        console.error('Error updating activity:', error);
        throw error;
    }
}

export async function createObj(activity: CreateActivityInput) {
    try {
        const success = await activityDao.insertObj(activity);
        return {success, data: activity};
    } catch (error) {
        console.error('Error creating activity:', error);
        throw error;
    }
}
