import ActivityDetailModalClient from '@/lib/features/activity/client/activity-detail-modal-client.tsx'
import { ActivityVO } from '@/lib/features/activity/shared/activity.ts'
import { fetchActivityDetail } from '@/lib/features/activity/service/fetch-activity-detail'
import { fetchCurrentUserRolePermission } from '@/lib/features/role-permission/service/fetch-current-user-role-permission.ts'
import { UserRolePermission } from '@/lib/features/role-permission/shared/role-permission.ts'
import { ApplicationException } from '@/lib/types/application-exception.ts'
import { COMMON_ERRORS } from '@/lib/types/error-type.ts'
import ErrorAlert from '@/lib/components/web/ErrorAlert'

export default async function ActivityDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    let activity: ActivityVO | null = null
    let authz: UserRolePermission | null = null
    let errorInfo: { title: number; desc: string } | null = null

    try {
        activity = await fetchActivityDetail(id)
        authz = await fetchCurrentUserRolePermission()
    } catch (error) {
        const message = error instanceof ApplicationException ? error.message : '活动查询失败'
        const code = error instanceof ApplicationException ? error.code : COMMON_ERRORS.UNKNOWN_ERROR.code
        errorInfo = { title: code, desc: message }
    }

    if (errorInfo) {
        return <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} />
    }

    if (!activity) {
        return <ErrorAlert title={COMMON_ERRORS.UNKNOWN_ERROR.code} desc='活动查询失败' />
    }

    if (!authz) {
        return <ErrorAlert title={COMMON_ERRORS.UNKNOWN_ERROR.code} desc='权限信息查询失败' />
    }

    return <ActivityDetailModalClient activity={activity} authz={authz} />
}
