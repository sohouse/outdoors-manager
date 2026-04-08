import { ActivityTypes, ActivityStatus, ActivityVO } from '@/lib/features/activity/shared/activity'
import dayjs from 'dayjs'
import { Button } from '@/lib/components/ui/button.tsx'
import { useForm } from 'react-hook-form'
import { FieldGroup } from '../../../components/ui/field'
import { editActivityCheck } from '@/lib/features/activity/shared/activity-check'
import { zodResolver } from '@hookform/resolvers/zod'
import { generateMock } from '@anatine/zod-mock'
import z from 'zod'
import { DialogTitle, DialogClose } from '@radix-ui/react-dialog'
import { DialogHeader, DialogFooter } from '../../../components/ui/dialog'
import FormTextField from '@/lib/components/web/form-field/FormInputField'
import FormTextareaField from '@/lib/components/web/form-field/FormTextareaField'
import FormSelectField from '@/lib/components/web/form-field/FormSelectField'

type ActivityEditProp = {
    handleEdit: (data: z.output<typeof editActivityCheck>) => void
    activity: ActivityVO
}

const ActivityEditForm = ({ handleEdit, activity }: ActivityEditProp) => {
    type EditActivityFormInput = z.input<typeof editActivityCheck>
    type EditActivityFormValues = z.output<typeof editActivityCheck>

    const toFormValues = (activity: ActivityVO): EditActivityFormValues => ({
        ...generateMock(editActivityCheck),
        ...activity,
        start_time: activity.start_time ? dayjs(activity.start_time).format('YYYY-MM-DDTHH:mm') : undefined,
        end_time: activity.end_time ? dayjs(activity.end_time).format('YYYY-MM-DDTHH:mm') : undefined,
    })
    const form = useForm<EditActivityFormInput, undefined, EditActivityFormValues>({
        resolver: zodResolver(editActivityCheck),
        defaultValues: toFormValues(activity)
    })

    const { isSubmitting } = form.formState;
    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    修改活动
                </DialogTitle>
            </DialogHeader>
            <form
                id='activity-edit-form'
                onSubmit={form.handleSubmit(
                    (data) => {
                        handleEdit(data)
                    },
                    (error) => {
                        console.error(error)
                    }
                )}
            >
                <FieldGroup>
                    <FormTextField
                        control={form.control}
                        name='start_time'
                        label='开始时间'
                        type='datetime-local'
                        className='w-fit editable-field'
                    />

                    <FormTextField
                        control={form.control}
                        name='end_time'
                        label='结束时间'
                        type='datetime-local'
                        className='w-fit editable-field'
                    />

                    <FormSelectField 
                        label='活动类型'
                        name='type'
                        control={form.control}
                        entries={ActivityTypes}
                    />

                    <FormSelectField 
                        label='活动状态'
                        name='status'
                        control={form.control}
                        entries={ActivityStatus}
                    />

                    <FormTextareaField
                        control={form.control}
                        name='desc'
                        label='活动描述'
                        className='w-fit editable-field'
                    />

                    <FormTextareaField
                        control={form.control}
                        name='content'
                        label='活动正文'
                        className='editable-field'
                    />
                    <FormTextField
                        control={form.control}
                        name='author'
                        label='作者'
                        className='w-fit editable-field'
                    />

                </FieldGroup>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant='outline'>取消</Button>
                </DialogClose>
                <Button type='submit' form='activity-edit-form' disabled={isSubmitting}>
                    {isSubmitting ? '提交中...' : '保存'}
                </Button>
            </DialogFooter>
        </>
    )
}

export default ActivityEditForm