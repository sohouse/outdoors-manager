import { Field, FieldGroup, FieldLabel } from '@/lib/components/ui/field'
import { Input } from '@/lib/components/ui/input'
import { Textarea } from '@/lib/components/ui/textarea'
import { ActivityStatus, ActivityTypes, ActivityVO } from '@/lib/features/activity/shared/activity'
import dayjs from 'dayjs'

const ActivityDisplayForm = ({ activity }: { activity: ActivityVO }) => {
    return (
        <FieldGroup>
            <FieldLabel>开始时间</FieldLabel>
            <Field>
                <Input
                    readOnly
                    type='datetime-local'
                    value={activity.start_time ? dayjs(activity.start_time).format('YYYY-MM-DDTHH:mm') : ''}
                />
            </Field>

            <FieldLabel>结束时间</FieldLabel>
            <Field>
                <Input
                    readOnly
                    type='datetime-local'
                    value={activity.end_time ? dayjs(activity.end_time).format('YYYY-MM-DDTHH:mm') : ''}
                />
            </Field>

            <FieldLabel>活动类型</FieldLabel>
            <Input
                readOnly
                value={ActivityTypes[activity.type]}
            />

            <FieldLabel>活动状态</FieldLabel>
            <Field>
                <Input
                    readOnly
                    value={ActivityStatus[activity.status]}
                />
            </Field>

            <FieldLabel>活动描述</FieldLabel>
            <Field>
                <Textarea
                    readOnly
                    value={activity.desc}
                />
            </Field>

            <FieldLabel>活动正文</FieldLabel>
            <Field>
                <Textarea
                    readOnly
                    value={activity.content}
                />
            </Field>

            <FieldLabel>作者</FieldLabel>
            <Field>
                <Input
                    readOnly
                    value={activity.author}
                />
            </Field>
        </FieldGroup>
    )
}

export default ActivityDisplayForm