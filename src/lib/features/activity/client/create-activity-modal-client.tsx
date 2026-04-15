'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import z from 'zod'

import { honoClient } from '@/lib/api/main'
import { unwrapResponse } from '@/lib/api/response'
import ErrorAlert from '@/lib/components/web/ErrorAlert'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/lib/components/ui/dialog'
import CreateActivityForm from '@/lib/features/activity/client/CreateActivityForm'
import { createActivityRequestCheck } from '@/lib/features/activity/shared/activity-check'
import { useActivityStore } from '@/lib/features/activity/shared/activity-store'
import { ApplicationException } from '@/lib/types/application-exception'
import { COMMON_RESPONSE } from '@/lib/types/error-type'

type CreateActivityResult = {
    success: boolean
    data: unknown
}

type CreateActivityFormValues = z.output<typeof createActivityRequestCheck>

type CreateActivityModalClientProps = {
    author: string
}

export default function CreateActivityModalClient({ author }: CreateActivityModalClientProps) {
    const router = useRouter()
    const [errorInfo, setErrorInfo] = useState<{ title: number; desc: string } | null>(null)
    const { setPageRefresh } = useActivityStore()

    const close = useCallback(() => router.back(), [router]);

    const createActivitySubmit = async (data: CreateActivityFormValues) => {
        try {
            const res = await honoClient.api.activity.createObj.$post({ json: data })
            const result = await unwrapResponse<CreateActivityResult>(res)

            if (result.success) {
                setPageRefresh()
                close()
            }
        } catch (error) {
            const message = error instanceof ApplicationException ? error.message : '创建活动失败'
            const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code
            setErrorInfo({ title: code, desc: message })
        }
    }

    return errorInfo ? (
        <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} />
    ) : (
        <Dialog open={true} onOpenChange={close}>
            <DialogContent className='w-full !max-w-4xl max-h-[70vh] overflow-y-auto scroll-hide'>
                <DialogDescription>创建新的活动</DialogDescription>
                <DialogHeader>
                    <DialogTitle>新建活动</DialogTitle>
                </DialogHeader>
                <CreateActivityForm author={author} onSubmit={createActivitySubmit} />
            </DialogContent>
        </Dialog>
    )
}
