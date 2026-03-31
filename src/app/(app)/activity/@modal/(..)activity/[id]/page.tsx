import ActivityDetailModalClient from '@/lib/features/activity/client/ActivityDetailModalClient.tsx'
import { ActivityVO } from '@/lib/features/activity/shared/activity.ts'
import { fetchActivityDetail } from '@/lib/features/activity/service/fetch-activity-detail'
import { ApplicationException } from '@/lib/types/ApplicationException'
import { COMMON_ERRORS } from '@/lib/types/ErrorType'
import ErrorAlert from '@/lib/components/web/ErrorAlert'

export default async function ActivityDetailModal({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    let activity: ActivityVO | null = null
    let errorInfo: { title: number; desc: string } | null = null

    try {
        activity = await fetchActivityDetail(id)
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

    return <ActivityDetailModalClient activity={activity} />
}
