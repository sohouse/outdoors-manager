import { ActivityVO } from '@/lib/features/activity/shared/activity'
import ActivityListItem from './ActivityListItem'
import { UserRolePermission } from '@/lib/features/role-permission/shared/role-permission'
import { canDeleteActivity } from '@/lib/features/activity/shared/activity-auth'

type ActivityListProps = {
    activities: ActivityVO[]
    authz: UserRolePermission | null
    onItemClick: (id: string) => void
}

const ActivityList = ({ activities, authz, onItemClick }: ActivityListProps
) => {
    return (
        <>
            {
                activities.map(item => (
                    <ActivityListItem
                        key={item.id}
                        item={item}
                        canDelete={canDeleteActivity(item, authz)}
                        onClick={onItemClick}
                    />
                ))
            }
        </>
    )
}

export default ActivityList