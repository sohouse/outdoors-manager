'use client'

import { honoClient } from '@/lib/api/main.ts'
import {editActivityCheck} from '@/lib/validators/activity-check'
import { Button } from '@/lib/components/ui/button.tsx'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/lib/components/ui/dialog.tsx'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/lib/components/ui/field.tsx'
import { Input } from '@/lib/components/ui/input.tsx'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select.tsx'
import { Textarea } from '@/lib/components/ui/textarea.tsx'
import { useActivityStore } from '@/lib/stores/activity-store.ts'
import { Activity, ActivityStatus, ActivityTypes } from '@/lib/types/activity.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import {Prisma, Activity as PrismaActivity} from '@prisma/client'

const createInput: Prisma.ActivityCreateInput = {
  title: "周末徒步",
  author: "Will",
  type: 1,
  status: 0,
};

export default function ActivityDetailModal({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [activity, setActivity] = useState<Activity>({
    id: '',
    content: '',
    author: '',
    title: '',
    desc: '',
    type: ActivityTypes.徒步,
    status: ActivityStatus.未开始,
    start_time: undefined,
    end_time: undefined,
    material: undefined
  });
  const [isEdit, setEdit] = useState(false);

  const { setPageRefresh } = useActivityStore();

  const form = useForm({
    resolver: zodResolver(editActivityCheck),
    defaultValues: {
      title: "", // 改为title
      start_time: undefined,
      end_time: undefined,
      type: ActivityTypes.徒步, // 提供默认值
      status: ActivityStatus.未开始, // 提供默认值
      desc: "",
      author: "",
      id: "",
      content: ""
    }
  })

  useEffect(() => {
    const fetchActivity = async (id: string) => {
      const res = await honoClient.api.activity['getObjById'].$get({ id: id });
      if (res.status === 401) {
        alert({message: '用户未登录'})
        router.push('/login')
      }
      const { result: fetchData } = await res.json() as { result: Activity };

      // const fetchData = await getObjById('activity', id);
      setActivity(fetchData);
      form.reset({
        ...fetchData,
        start_time: dayjs(fetchData.start_time).format('YYYY-MM-DDTHH:mm'),
        end_time: dayjs(fetchData.end_time).format('YYYY-MM-DDTHH:mm')
      })
    }

    fetchActivity(id);
  }, [id, form.reset, isEdit])

  const onOpenChange = (open: boolean) => {
    if (!open) router.back()
  }

  const changeEditMode = () => {
    setEdit(!isEdit);
  }

  const activityEditSubmit = async (data: z.infer<typeof editActivityCheck>) => {
    try {
      const editActivity: Activity = {
        ...data,
        start_time: data.start_time ? new Date(data.start_time) : undefined,
        end_time: data.end_time ? new Date(data.end_time) : undefined
      };

      const res = await honoClient.api.activity['updateObj'].$post({json: editActivity});
      const { result: success } = await res.json() as { result: boolean };

      // const result = await updateObj('activity', editActivity);
      // const success = result.success;

      if (success) {
        // 关闭模态框（触发onOpenChange）
        onOpenChange(false);
        // 使用setTimeout确保导航完成后再刷新
        // setTimeout(() => {
        //   router.refresh();
        // }, 100);
        setPageRefresh();
      }

    } catch (error) {
      console.error('Error in activityEditSubmit:', error);
    }
  }



  // 模态框的返回根据条件返回前置路由：activity
  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className='w-full !max-w-4xl'>
        <DialogHeader>
          <DialogTitle>
            {
              activity?.title ? (
                <Button onClick={changeEditMode}>{isEdit ? '查看' : '编辑'}</Button>
              ) : '加载中...'
            }
          </DialogTitle>
        </DialogHeader>
        {activity && (
          <form id='activity-edit-form' className='max-h-[70vh] overflow-y-auto scroll-hide' onSubmit={form.handleSubmit(
            (data) => { activityEditSubmit(data) },
            (error) => { console.error(error) }
          )}>
            <FieldGroup>
              <Field>
                <Controller
                  name='id'
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      type="hidden"
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className='w-min editable-field'
                      disabled={!isEdit}
                    />
                  )}
                />
              </Field>

              <FieldLabel>开始时间</FieldLabel>
              <Controller
                name='start_time'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? dayjs(field.value).format('YYYY-MM-DDTHH:mm') : ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      className='w-min editable-field'
                      disabled={!isEdit}
                    />

                    {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
                  </Field>
                )}
              />

              <FieldLabel>结束时间</FieldLabel>
              <Controller
                name='end_time'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value ? dayjs(field.value).format('YYYY-MM-DDTHH:mm') : ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      className='w-min editable-field'
                      disabled={!isEdit}
                    />
                  </Field>
                )}
              />

              <FieldLabel>活动类型</FieldLabel>
              <Controller
                name='type'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={!isEdit}
                    >
                      <SelectTrigger className="w-min editable-field">
                        <SelectValue placeholder="选择活动类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            Object.entries(ActivityTypes)
                              .filter(([k]) => { return !isNaN(Number(k)) })
                              .map(([k, v]) =>
                                <SelectItem value={k} key={k}>{v}</SelectItem>
                              )
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <FieldLabel>活动状态</FieldLabel>
              <Controller
                name='status'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={!isEdit}
                    >
                      <SelectTrigger className="w-min editable-field">
                        <SelectValue placeholder="选择活动状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            Object.entries(ActivityStatus)
                              .filter(([k]) => { return !isNaN(Number(k)) })
                              .map(([k, v]) =>
                                <SelectItem value={k} key={k}>{v}</SelectItem>
                              )
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <FieldLabel>活动描述</FieldLabel>
              <Controller
                name='desc'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Textarea
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className='editable-field'
                      disabled={!isEdit}
                    />
                  </Field>
                )}
              />

              <FieldLabel>活动正文</FieldLabel>
              <Controller
                name='content'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Textarea
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className='editable-field'
                      disabled={!isEdit}
                    />
                  </Field>
                )}
              />

              <FieldLabel>作者</FieldLabel>
              <Controller
                name='author'
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <Input
                      {...field}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className='w-fit editable-field'
                      disabled={!isEdit}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        )}
        {isEdit ? <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button
            type="submit"
            form='activity-edit-form'
          >
            保存
          </Button>
        </DialogFooter> : null}
      </DialogContent>
    </Dialog>
  )
}
