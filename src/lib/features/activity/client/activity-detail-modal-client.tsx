'use client'

import { generateMock } from '@anatine/zod-mock'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

import { honoClient } from '@/lib/api/main.ts'
import { unwrapResponse } from '@/lib/api/response'
import ErrorAlert from '@/lib/components/web/ErrorAlert'
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/select.tsx'
import { Textarea } from '@/lib/components/ui/textarea.tsx'
import { editActivityCheck } from '@/lib/features/activity/shared/activity-check.ts'
import { useActivityStore } from '@/lib/features/activity/shared/activity-store.ts'
import {
    ActivityStatus,
    ActivityTypes,
    ActivityVO,
    UpdateActivityInput,
} from '@/lib/features/activity/shared/activity.ts'
import {
    canManageOwnedResource,
    UserRolePermission,
} from '@/lib/features/role-permission/shared/role-permission.ts'
import { ApplicationException } from '@/lib/types/application-exception.ts'
import { COMMON_ERRORS } from '@/lib/types/error-type.ts'

type ActivityUpdateResult = {
    success: boolean
    data: UpdateActivityInput
}

type EditActivityFormInput = z.input<typeof editActivityCheck>
type EditActivityFormValues = z.output<typeof editActivityCheck>

type ActivityDetailModalClientProps = {
    activity: ActivityVO
    authz: UserRolePermission
}

const toFormValues = (activity: ActivityVO): EditActivityFormValues => ({
    ...generateMock(editActivityCheck),
    ...activity,
    start_time: activity.start_time ? dayjs(activity.start_time).format('YYYY-MM-DDTHH:mm') : undefined,
    end_time: activity.end_time ? dayjs(activity.end_time).format('YYYY-MM-DDTHH:mm') : undefined,
})

export default function ActivityDetailModalClient({
    activity: initialActivity,
    authz,
}: ActivityDetailModalClientProps) {
    const router = useRouter()
    const [activity] = useState<ActivityVO>(initialActivity)
    const [isEdit, setEdit] = useState(false)
    const [errorInfo, setErrorInfo] = useState<{ title: number; desc: string } | null>(null)

    const { setPageRefresh } = useActivityStore()
    const canEdit = canManageOwnedResource({
        permissions: authz.permissions,
        ownPermission: 'activity:update.own',
        anyPermission: 'activity:update.any',
        ownerId: initialActivity.creator_id,
        ownerName: initialActivity.author,
        user: {
            id: authz.userId,
            name: authz.name,
            username: authz.username,
        },
    })

    const form = useForm<EditActivityFormInput, undefined, EditActivityFormValues>({
        resolver: zodResolver(editActivityCheck),
        defaultValues: toFormValues(initialActivity),
    })

    const onOpenChange = (open: boolean) => {
        if (!open) router.back()
    }

    const changeEditMode = () => {
        setEdit(!isEdit)
    }

    const activityEditSubmit = async (data: EditActivityFormValues) => {
        try {
            const editActivity: UpdateActivityInput = {
                ...data,
                start_time: data.start_time ? new Date(data.start_time) : undefined,
                end_time: data.end_time ? new Date(data.end_time) : undefined,
            }

            const res = await honoClient.api.activity['updateObj'].$put({ json: editActivity })
            const result = await unwrapResponse<ActivityUpdateResult>(res)

            if (result.success) {
                onOpenChange(false)
                setPageRefresh()
            }
        } catch (error) {
            const message = error instanceof ApplicationException ? error.message : '加载活动列表失败'
            const code = error instanceof ApplicationException ? error.code : COMMON_ERRORS.UNKNOWN_ERROR.code
            setErrorInfo({ title: code, desc: message })
            throw error
        }
    }

    return errorInfo ? (
        <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} />
    ) : (
            <Dialog open={true} onOpenChange={onOpenChange}>
            <DialogContent className='w-full !max-w-4xl'>
                <DialogHeader>
                    <DialogTitle>
                        {canEdit ? (
                            <Button onClick={changeEditMode}>{isEdit ? '查看' : '编辑'}</Button>
                        ) : activity.title || '加载中...'}
                    </DialogTitle>
                </DialogHeader>
                <form
                    id='activity-edit-form'
                    className='max-h-[70vh] overflow-y-auto scroll-hide'
                    onSubmit={form.handleSubmit(
                        (data) => {
                            void activityEditSubmit(data)
                        },
                        (error) => {
                            console.error(error)
                        }
                    )}
                >
                    <FieldGroup>
                        <Field>
                            <Controller
                                name='id'
                                control={form.control}
                                render={({ field }) => (
                                    <Input
                                        type='hidden'
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
                                        type='datetime-local'
                                        {...field}
                                        value={field.value ? dayjs(field.value).format('YYYY-MM-DDTHH:mm') : ''}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        className='w-min editable-field'
                                        disabled={!isEdit}
                                    />

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                                        type='datetime-local'
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
                                        <SelectTrigger className='w-min editable-field'>
                                            <SelectValue placeholder='选择活动类型' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.entries(ActivityTypes)
                                                    .filter(([key]) => !isNaN(Number(key)))
                                                    .map(([key, value]) => (
                                                        <SelectItem value={key} key={key}>
                                                            {value}
                                                        </SelectItem>
                                                    ))}
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
                                        <SelectTrigger className='w-min editable-field'>
                                            <SelectValue placeholder='选择活动状态' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {Object.entries(ActivityStatus)
                                                    .filter(([key]) => !isNaN(Number(key)))
                                                    .map(([key, value]) => (
                                                        <SelectItem value={key} key={key}>
                                                            {value}
                                                        </SelectItem>
                                                    ))}
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
                {isEdit && canEdit ? (
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant='outline'>取消</Button>
                        </DialogClose>
                        <Button type='submit' form='activity-edit-form'>
                            保存
                        </Button>
                    </DialogFooter>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
