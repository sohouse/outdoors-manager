import { Button } from '@/lib/components/ui/button.tsx'
import { FieldGroup, FieldLabel } from '@/lib/components/ui/field'
import { DialogClose } from '@radix-ui/react-dialog'
import { DialogFooter } from '@/lib/components/ui/dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import ActivityFormFields from '@/lib/features/activity/client/ActivityFormFields'
import { createActivityRequestCheck } from '@/lib/features/activity/shared/activity-check'

type CreateActivityFormInput = z.input<typeof createActivityRequestCheck>
type CreateActivityFormValues = z.output<typeof createActivityRequestCheck>

type CreateActivityFormProps = {
    author: string
    onSubmit: (data: CreateActivityFormValues) => Promise<void>
}

const defaultValues: CreateActivityFormInput = {
    title: '',
    start_time: '',
    end_time: '',
    desc: '',
    content: '',
    type: 0,
    status: 0,
}

const CreateActivityForm = ({ author, onSubmit }: CreateActivityFormProps) => {
    const form = useForm<CreateActivityFormInput, undefined, CreateActivityFormValues>({
        resolver: zodResolver(createActivityRequestCheck),
        defaultValues,
    })

    const { isSubmitting } = form.formState

    return (
        <>
            <form
                id='activity-create-form'
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
                    <FieldLabel>作者</FieldLabel>
                    <div className='rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground'>
                        {author}
                    </div>
                </FieldGroup>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant='outline'>取消</Button>
                </DialogClose>
                <Button type='submit' form='activity-create-form' disabled={isSubmitting}>
                    {isSubmitting ? '创建中...' : '创建活动'}
                </Button>
            </DialogFooter>
        </>
    )
}

export default CreateActivityForm
