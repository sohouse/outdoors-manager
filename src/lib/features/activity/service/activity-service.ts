import {
    ActivityItem,
} from '@/lib/features/activity/shared/activity.ts';
import {PageResult, PaginateMeta} from '@/lib/types/pagination.ts';
import {daoRegistry} from '@/lib/database/dao-register.ts'
import {ApplicationException} from "@/lib/types/application-exception.ts";
import {COMMON_RESPONSE} from "@/lib/types/error-type.ts";
import {
    canManageOwnedResource,
    hasAnyPermission,
    UserRolePermission,
} from "@/lib/features/role-permission/shared/role-permission.ts";
import z from 'zod';
import { activityConditionCheck, editActivityCheck, insertActivityCheck } from '../shared/activity-check';

const activityDao = daoRegistry.activity();

const assertCanReadActivity = (currentUser: UserRolePermission): void => {
    if (!hasAnyPermission(currentUser.permissions, ['activity:read'])) {
        throw new ApplicationException(COMMON_RESPONSE.FORBIDDEN);
    }
};

const assertCanManageActivity = ({
    activity,
    currentUser,
    ownPermission,
    anyPermission,
}: {
    activity: ActivityItem;
    currentUser: UserRolePermission;
    ownPermission: string;
    anyPermission: string;
}): boolean => {
    const canManage = canManageOwnedResource({
        permissions: currentUser.permissions,
        ownPermission,
        anyPermission,
        ownerId: activity.creator_id,
        user: currentUser,
    });

    if (!canManage) {
        throw new ApplicationException(COMMON_RESPONSE.FORBIDDEN);
    }

    return currentUser.permissions.includes(anyPermission);
};

export async function deleteById(
    id: string,
    currentUser: UserRolePermission
): Promise<boolean> {
    const activity = await getObjById(id, currentUser);
    
    assertCanManageActivity({
        activity,
        currentUser,
        ownPermission: 'activity:delete.own',
        anyPermission: 'activity:delete.any',
    });

    return activityDao.deleteById(id)
}

export async function findByCondition(
    condition: z.infer<typeof activityConditionCheck>,
    currentUser: UserRolePermission
): Promise<PageResult<ActivityItem>> {
    assertCanReadActivity(currentUser);

    const { items, totalCount } = await activityDao.findByCondition(condition);

    const meta: PaginateMeta = {
        totalCount,
        limit: condition.limit,
        totalPage: Math.ceil(totalCount / (condition.limit ?? 1)),
        page: condition.page,
    };

    return {
        meta,
        items
    };
}

export async function getObjById(id: string, currentUser: UserRolePermission): Promise<ActivityItem> {
    assertCanReadActivity(currentUser);

    const condition = activityConditionCheck.parse({id});
    const {items} = await activityDao.findByCondition(condition);
    const [item] = items;
    if (!item) {
        throw new ApplicationException(COMMON_RESPONSE.NOT_FOUND);
    }
    return item;
}

export async function updateObj(activity: z.infer<typeof editActivityCheck>, currentUser: UserRolePermission) {
    const currentActivity = await getObjById(activity.id, currentUser);
    const hasAnyPermission = assertCanManageActivity({
        activity: currentActivity,
        currentUser,
        ownPermission: 'activity:update.own',
        anyPermission: 'activity:update.any',
    });

    const payload = hasAnyPermission
        ? activity
        : {
            ...activity,
            author: currentActivity.author,
        };

    const success = await activityDao.editObj(payload);
    return {success, data: payload};
}

export async function createObj(activity: z.infer<typeof insertActivityCheck>) {
    const success = await activityDao.insertObj(activity);
    return {success, data: activity};
}
