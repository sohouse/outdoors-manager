'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import z from 'zod'

import { honoClient } from '@/lib/api/main.ts'
import { unwrapResponse } from '@/lib/api/response'
import ErrorAlert from '@/lib/components/web/ErrorAlert'
import {
    Dialog,
    DialogContent,
} from '@/lib/components/ui/dialog.tsx'
import { editActivityCheck } from '@/lib/features/activity/shared/activity-check.ts'
import { useActivityStore } from '@/lib/features/activity/shared/activity-store.ts'
import {
    ActivityVO,
    UpdateActivityInput,
} from '@/lib/features/activity/shared/activity.ts'
import { UserRolePermission } from '@/lib/features/role-permission/shared/role-permission.ts'
import { ApplicationException } from '@/lib/types/application-exception.ts'
import { COMMON_RESPONSE } from '@/lib/types/error-type.ts'
import { canEditActivity } from '../shared/activity-auth'
import ActivityEditForm from '@/lib/features/activity/client/ActivityEditForm'
import ActivityDisplayForm from './ActivityDetailView'

type ActivityUpdateResult = {
    success: boolean
    data: UpdateActivityInput
}

type EditActivityFormValues = z.output<typeof editActivityCheck>

type ActivityDetailModalClientProps = {
    activity: ActivityVO
    authz: UserRolePermission
}

export default function ActivityDetailModalClient({
    activity: initialActivity,
    authz,
}: ActivityDetailModalClientProps) {
    const router = useRouter()
    const [activity] = useState<ActivityVO>(initialActivity)
    const [errorInfo, setErrorInfo] = useState<{ title: number; desc: string } | null>(null)

    const { setPageRefresh } = useActivityStore()
    const canEdit = canEditActivity(authz, initialActivity);

    const backRoute = () => {
        router.back()
    }

    const onOpenChange = (open: boolean) => {
        if (!open) backRoute()
    }

    const triggerActivityListRefresh = () => {
        setPageRefresh()
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
                backRoute()
                triggerActivityListRefresh()
            }
        } catch (error) {
            const message = error instanceof ApplicationException ? error.message : '更新活动失败'
            const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code
            setErrorInfo({ title: code, desc: message })
            throw error
        }
    }

    return errorInfo ? (
        <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} />
    ) : (
        <Dialog open={true} onOpenChange={onOpenChange}>
            <DialogContent className='w-full !max-w-4xl max-h-[70vh] overflow-y-auto scroll-hide'>
                {canEdit &&
                    <ActivityEditForm
                        handleEdit={activityEditSubmit}
                        activity={activity}
                    />
                }
                {!canEdit &&
                    <ActivityDisplayForm
                        activity={activity}
                    />
                }
            </DialogContent>
        </Dialog>
    )
}
