import { ActivityVO } from '@/lib/features/activity/shared/activity'
import dayjs from 'dayjs'
import { Button } from '@/lib/components/ui/button.tsx'
import { useForm } from 'react-hook-form'
import { FieldGroup } from '../../../components/ui/field'
import { editActivityCheck } from '@/lib/features/activity/shared/activity-check'
import { zodResolver } from '@hookform/resolvers/zod'
import { generateMock } from '@anatine/zod-mock'
import z from 'zod'
import { DialogClose } from '@radix-ui/react-dialog'
import { DialogFooter } from '../../../components/ui/dialog'
import FormTextField from '@/lib/components/web/form-field/FormInputField'
import ActivityFormFields from '@/lib/features/activity/client/ActivityFormFields'

type ActivityEditProp = {
    onSubmit: (data: z.output<typeof editActivityCheck>) => Promise<void>
    activity: ActivityVO
}

const ActivityEditForm = ({ onSubmit, activity }: ActivityEditProp) => {
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
            <form
                id='activity-edit-form'
                onSubmit={form.handleSubmit(
                    (data) => {
                        onSubmit(data)
                    },
                    (error) => {
                        console.error(error)
                    }
                )}
            >
                <FieldGroup>
                    <ActivityFormFields control={form.control} />
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
