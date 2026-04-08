import DeleteDialog from '@/lib/features/activity/client/delete-dialog'
import { ActivityStatus, ActivityTypes, ActivityVO } from '@/lib/features/activity/shared/activity'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'

type ActivityListItemProps = {
    item: ActivityVO
    canDelete: boolean
    onClick: (id: string) => void
}

// 根据活动类型获取文字颜色（在对应背景图片上显示效果好）
const getTextColor = (type: number): string => {
    const colorMap: Record<number, string> = {
        1: 'text-amber-900',   // 徒步 - 暖色
        2: 'text-slate-900',   // 攀岩 - 冷灰
        3: 'text-emerald-900', // 攻防箭 - 绿色
        4: 'text-orange-900',  // 体能训练 - 橙色
        5: 'text-cyan-900',    // 攀冰 - 蓝冰色
    };
    return colorMap[type] || 'text-foreground';
};

// 暗色主题下的文字颜色
const getDarkTextColor = (type: number): string => {
    const colorMap: Record<number, string> = {
        1: 'dark:text-amber-100',
        2: 'dark:text-slate-100',
        3: 'dark:text-emerald-100',
        4: 'dark:text-orange-100',
        5: 'dark:text-cyan-100',
    };
    return colorMap[type] || 'dark:text-foreground';
};

const ActivityListItem = ({ item, canDelete, onClick }: ActivityListItemProps) => {
    return (
        <Card
            key={item.id}
            className="bg-cover bg-no-repeat bg-left cursor-pointer relative overflow-hidden"
            style={{
                backgroundImage: `url(/images/activity/${item.type}.png)`
            }}
            onClick={() => onClick(item.id)}
        >
            {/* 模糊背景层 */}
            <div
                className="absolute inset-0 bg-cover bg-no-repeat bg-center blur-2xl scale-110 -z-10 pointer-events-none"
                style={{ backgroundImage: `url(/images/activity/${item.type}.png)` }}
            />
            {/* 亮色主题渐变覆盖层 */}
            <div
                className="absolute inset-0 bg-linear-to-r from-background/90 via-background/30 to-transparent md:from-background/60 md:via-background/10 pointer-events-none" />
            {/* 暗色主题渐变覆盖层 */}
            <div
                className="absolute inset-0 bg-linear-to-r dark:from-foreground/80 dark:via-foreground/20 dark:to-transparent md:dark:from-foreground/40 md:dark:via-foreground/5 pointer-events-none" />
            <CardHeader className={`${getTextColor(item.type)} ${getDarkTextColor(item.type)} opacity-80`}>
                <h2 className={clsx("text-lg md:text-xl truncate", {
                    "line-through": item.status === ActivityStatus.已取消
                })}>
                    {item.title}
                </h2>
                <div className="text-xs md:text-sm opacity-80">
                    {`${dayjs(item.start_time).format('YYYY-MM-DD HH:mm:ss')}
              - ${dayjs(item.end_time).format('YYYY-MM-DD HH:mm:ss')}`}
                </div>
                <div className="opacity-80">
                    {`${ActivityTypes[item.type]} - ${ActivityStatus[item.status]}`}
                </div>
            </CardHeader>
            <CardContent
                className={`line-clamp-2 md:line-clamp-3 text-sm ${getTextColor(item.type)} ${getDarkTextColor(item.type)} opacity-90`}>
                {item.desc}
            </CardContent>
            <CardFooter className={`flex flex-row justify-between text-xs`}>
                <div
                    className={`${getTextColor(item.type)} ${getDarkTextColor(item.type)} opacity-90 inline`}>
                    {item.leader_name} - {dayjs(item.start_time).format('YYYY-MM-DD HH:mm:ss')}
                </div>
                {canDelete &&
                    <DeleteDialog
                        id={item.id}
                        title={item.title}
                    />}
            </CardFooter>
        </Card>
    )
}

export default ActivityListItem