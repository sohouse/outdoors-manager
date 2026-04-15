import { ActivityStatus, ActivityTypes } from '@/lib/features/activity/shared/activity'
import FormTextField from '@/lib/components/web/form-field/FormInputField'
import FormTextareaField from '@/lib/components/web/form-field/FormTextareaField'
import FormSelectField from '@/lib/components/web/form-field/FormSelectField'
import { Control, FieldValues } from 'react-hook-form'

type ActivityFormFieldsProps<T extends FieldValues> = {
    control: Control<T>
}

const ActivityFormFields = <T extends FieldValues>({ control }: ActivityFormFieldsProps<T>) => {
    return (
        <>
            <FormTextField
                control={control}
                name={'title' as never}
                label='活动标题'
                className='w-fit editable-field'
            />

            <FormTextField
                control={control}
                name={'start_time' as never}
                label='开始时间'
                type='datetime-local'
                className='w-fit editable-field'
            />

            <FormTextField
                control={control}
                name={'end_time' as never}
                label='结束时间'
                type='datetime-local'
                className='w-fit editable-field'
            />

            <FormSelectField
                label='活动类型'
                name={'type' as never}
                control={control}
                entries={ActivityTypes}
            />

            <FormSelectField
                label='活动状态'
                name={'status' as never}
                control={control}
                entries={ActivityStatus}
            />

            <FormTextareaField
                control={control}
                name={'desc' as never}
                label='活动描述'
                className='w-fit editable-field'
            />

            <FormTextareaField
                control={control}
                name={'content' as never}
                label='活动正文'
                className='editable-field'
            />
        </>
    )
}

export default ActivityFormFields
