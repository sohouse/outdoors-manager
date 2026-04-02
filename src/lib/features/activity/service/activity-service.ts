import {
    ActivityConditions,
    ActivityItem,
    CreateActivityInput,
    UpdateActivityInput
} from '@/lib/features/activity/shared/activity.ts';
import {PageResult, PaginateCondition, PaginateMeta} from '@/lib/types/pagination.ts';
import {daoRegistry} from '@/lib/database/dao-register.ts'
import {ApplicationException} from "@/lib/types/application-exception.ts";
import {COMMON_ERRORS} from "@/lib/types/error-type.ts";
import {
    canManageOwnedResource,
    hasAnyPermission,
    PermissionUserLike,
} from "@/lib/features/role-permission/shared/role-permission.ts";

const activityDao = daoRegistry.activity();

type ActivityPermissionContext = PermissionUserLike & {
    permissions: string[];
};

const assertCanReadActivity = (currentUser: ActivityPermissionContext): void => {
    if (!hasAnyPermission(currentUser.permissions, ['activity:read'])) {
        throw new ApplicationException(COMMON_ERRORS.FORBIDDEN);
    }
};

const assertCanManageActivity = ({
    activity,
    currentUser,
    ownPermission,
    anyPermission,
}: {
    activity: ActivityItem;
    currentUser: ActivityPermissionContext;
    ownPermission: string;
    anyPermission: string;
}): boolean => {
    const canManage = canManageOwnedResource({
        permissions: currentUser.permissions,
        ownPermission,
        anyPermission,
        ownerId: activity.creator_id,
        ownerName: activity.author,
        user: currentUser,
    });

    if (!canManage) {
        throw new ApplicationException(COMMON_ERRORS.FORBIDDEN);
    }

    return currentUser.permissions.includes(anyPermission);
};

export async function deleteById(
    id: string,
    currentUser: ActivityPermissionContext
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

export async function findByCondition<ConditionType extends PaginateCondition>(
    condition: ConditionType,
    currentUser: ActivityPermissionContext
): Promise<PageResult<ActivityItem>> {
    assertCanReadActivity(currentUser);

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

export async function getObjById(id: string, currentUser?: ActivityPermissionContext): Promise<ActivityItem> {
    if (currentUser) {
        assertCanReadActivity(currentUser);
    }

    const condition = {id: id} as ActivityConditions;
    const {items} = await activityDao.findByCondition(condition);
    const [item] = items;
    if (!item) {
        throw new ApplicationException(COMMON_ERRORS.NOT_FOUND);
    }
    return item as ActivityItem;
}

export async function updateObj(activity: UpdateActivityInput, currentUser: ActivityPermissionContext) {
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

export async function createObj(activity: CreateActivityInput) {
    const success = await activityDao.insertObj(activity);
    return {success, data: activity};
}
