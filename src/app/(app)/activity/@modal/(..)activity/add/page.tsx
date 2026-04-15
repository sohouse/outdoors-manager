import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import CreateActivityModalClient from '@/lib/features/activity/client/create-activity-modal-client'
import { COMMON_ROUTES } from '@/lib/config/routes'

export default async function CreateActivityModalPage() {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
        redirect(COMMON_ROUTES.LOGIN)
    }

    return <CreateActivityModalClient author={session.user.name} />
}
