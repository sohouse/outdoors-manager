import { ActivityStatus, ActivityTypes, ActivityVO } from '@/lib/features/activity/shared/activity.ts'
import dayjs from 'dayjs'
import { notFound } from 'next/navigation'
import { honoClient } from '@/lib/api/main.ts'
import { unwrapResponse } from '@/lib/api/response'
import ErrorAlert from '@/lib/components/web/ErrorAlert'
import { ApplicationException } from '@/lib/types/ApplicationException'
import { COMMON_ERRORS } from '@/lib/types/ErrorType'

// 而没有在并行路由中的page页面则处理直接的activity/[id]路由访问
export default async function ActivityDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    let activity = {} as ActivityVO;
    try {
        const res = await honoClient.api.activity['getObjById'].$get({query: { id: id} });
        activity = await unwrapResponse(res);
        if (!activity) notFound()
    } catch (error) {
        const message = error instanceof ApplicationException ? error.message : '活动查询失败';
        const code = error instanceof ApplicationException ? error.code : COMMON_ERRORS.UNKNOWN_ERROR.code;
        return <ErrorAlert title={code} desc={message} />
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-4">
            <h1 className="text-2xl font-semibold">{activity.title}</h1>
            <p className="text-muted-foreground">
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
