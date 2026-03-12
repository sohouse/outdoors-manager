import { getObjById } from '@/lib/service/activityService.ts'
import { Activity, ActivityStatus, ActivityTypes } from '@/lib/types/activity'
import dayjs from 'dayjs'
import { notFound } from 'next/navigation'
import { honoClient } from '@/lib/api/main.ts'

// 而没有在并行路由中的page页面则处理直接的activity/[id]路由访问
export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // const activity = await getObjById('activity', id);
  const res = await honoClient.api.activity['getObjById'].$get({ id: id });
        const {result: activity} = await res.json() as {result: Activity};
  if (!activity) notFound()

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
