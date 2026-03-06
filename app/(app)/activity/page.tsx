'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ActivityStatus, ActivityTypes, Activity, ActivityCondition } from "@/types/activity";
import dayjs from 'dayjs'
import { FC, useEffect, useState } from "react";
import ActivityFilterBar from "@/components/web/activitySearch";
import PageProvider from "@/components/web/pageProvider";
import { useActivityStore } from "@/stores/activityStore";
import { findByCondition } from "./actions/activityActions";
import DeleteDialog from "@/components/web/deleteDialog";
import { useRouter } from "next/navigation";

const ActivityPage: FC = () => {

  const { condition: condition, setPaginateMeta, refreshFlag } = useActivityStore();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  useEffect(() => {
    const loadActivities = async () => {
      const { items, meta } = await findByCondition<ActivityCondition>('activity', condition);
      setActivities(items);
      setPaginateMeta(meta);
    }
    loadActivities();
  }, [condition, setPaginateMeta, refreshFlag])

  const reloadActivity = async () => {
    const { items, meta } = await findByCondition<ActivityCondition>('activity', condition);
    setActivities(items);
    setPaginateMeta(meta);
  }

  // 路由被(..)activity拦截，到了并行modal路由下的activity/[id]/page.tsx中，
  // 展示page中的Dialog模态框
  const goActivityDetail = (id: string) => {
    router.push(`/activity/${id}`)
  }

  return (
    <div className="w-full flex flex-col gap-5 max-w-4xl mx-auto md:gap-5">
      <ActivityFilterBar />
        {
          activities.map(item => (
            <Card
              key={item.id}
              className="bg-no-repeat cursor-pointer"
              style={{
                backgroundImage: `url(/images/activity/${item.type}.png)`
              }}
              onClick={() => goActivityDetail(item.id)}
            >
              <CardHeader>
                <h2 className="text-lg md:text-xl truncate ...">
                  {item.title}
                </h2>
                <div className="text-xs md:text-sm">
                  {`${dayjs(item.start_time).format('YYYY-MM-DD HH:mm:ss')} 
              - ${dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss')}`}
                </div>
                <div>
                  {`${ActivityTypes[item.type]} - ${ActivityStatus[item.status]}`}
                </div>
              </CardHeader>
              <CardContent className="line-clamp-2 md:line-clamp-3 text-sm">
                {item.desc}
              </CardContent>
              <CardFooter className="flex-row justify-between text-xs hidden md:block">
                <div>
                  {item.author} - {dayjs(item.create_time).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                <DeleteDialog
                  id={item.id}
                  title={item.title}
                  reloadActivity={reloadActivity}
                />
              </CardFooter>
            </Card>
          ))
        }
      <PageProvider />
    </div>
  )
}

export default ActivityPage