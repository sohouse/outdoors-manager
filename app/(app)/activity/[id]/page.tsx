import { getObjById } from '../actions/activityActions'
import { ActivityStatus, ActivityTypes } from '@/types/activity'
import dayjs from 'dayjs'
import { notFound } from 'next/navigation'

// 而没有在并行路由中的page页面则处理直接的activity/[id]路由访问
export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const activity = await getObjById('activity', id)
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
