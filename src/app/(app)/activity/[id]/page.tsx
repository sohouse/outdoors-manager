import { ActivityStatus, ActivityTypes, ActivityVO } from '@/lib/features/activity/shared/activity.ts'
import dayjs from 'dayjs'
import { notFound } from 'next/navigation'
import ErrorAlert from '@/lib/components/web/ErrorAlert'
import { fetchActivityDetail } from '@/lib/features/activity/service/fetch-activity-detail'
import { ApplicationException } from '@/lib/types/application-exception.ts'
import { COMMON_RESPONSE } from '@/lib/types/error-type.ts'

// 而没有在并行路由中的page页面则处理直接的activity/[id]路由访问
export default async function ActivityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    let activity: ActivityVO | null = null
    let errorInfo: { title: number; desc: string } | null = null

    try {
        activity = await fetchActivityDetail(id)
        if (!activity) notFound()
    } catch (error) {
        const message = error instanceof ApplicationException ? error.message : '活动查询失败'
        const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code
        errorInfo = { title: code, desc: message }
    }

    if (errorInfo) {
        return <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} />
    }

    if (!activity) {
        return <ErrorAlert title={COMMON_RESPONSE.UNKNOWN_ERROR.code} desc='活动查询失败' />
    }

    return (
        <div className='max-w-2xl mx-auto p-6 space-y-4'>
            <h1 className='text-2xl font-semibold'>{activity.title}</h1>
            <p className='text-muted-foreground'>
                {dayjs(activity.start_time).format('YYYY-MM-DD HH:mm')} -{' '}
                {dayjs(activity.end_time).format('YYYY-MM-DD HH:mm')}
            </p>
            <p>
                {ActivityTypes[activity.type]} · {ActivityStatus[activity.status]}
            </p>
            <p>{activity.desc}</p>
            <p>{activity.author}</p>
        </div>
    )
}
