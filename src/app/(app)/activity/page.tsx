'use client'

import { ActivityVO } from "@/lib/features/activity/shared/activity.ts";
import { FC, useCallback, useEffect, useState } from "react";
import ActivityFilterBar from "@/lib/features/activity/client/activity-search.tsx";
import PageProvider from "@/lib/components/web/PageProvider.tsx";
import { useActivityStore } from "@/lib/features/activity/shared/activity-store.ts";
import { useRouter } from "next/navigation";
import { honoClient } from "@/lib/api/main.ts";
import { ACTIVITY_ROUTES } from "@/lib/config/routes.ts";
import { InferResponseType } from "hono";
import { unwrapResponse } from "@/lib/api/response";
import ErrorAlert from "@/lib/components/web/ErrorAlert";
import { ApplicationException } from "@/lib/types/application-exception.ts";
import { COMMON_RESPONSE } from "@/lib/types/error-type.ts";
import { UserRolePermission } from "@/lib/features/role-permission/shared/role-permission.ts";
import ActivityList from "@/lib/components/web/ActivityList";

type FindByConditionResponse = InferResponseType<typeof honoClient.api.activity.findByCondition.$get, 200>;
const ActivityPage: FC = () => {

    const { condition, setPaginateMeta, refreshFlag } = useActivityStore();
    const router = useRouter();


    const [activities, setActivities] = useState<ActivityVO[]>([]);
    const [authz, setAuthz] = useState<UserRolePermission | null>(null);
    const [errorInfo, setErrorInfo] = useState<{ title: number; desc: string } | null>(null);
    const [isLoading, setLoading] = useState(true);

    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true);
            const res = await honoClient.api.activity['findByCondition'].$get({ query: condition });
            const { items, meta } = await unwrapResponse<FindByConditionResponse>(res);
            return {
                items,
                meta
            }
        } catch (error) {
            const message = error instanceof ApplicationException ? error.message : '加载活动列表失败';
            const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code;
            setErrorInfo({ title: code, desc: message });
            throw error;
        } finally {
            setLoading(false);
        }
    }, [condition])

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            const { items, meta } = await fetchActivities();
            if (cancelled) return;
            setActivities(items);
            setPaginateMeta(meta);
        };
        void load();
        return () => {
            cancelled = true
        }
    }, [fetchActivities, setPaginateMeta, refreshFlag])

    useEffect(() => {
        let cancelled = false;

        const loadAuthz = async () => {
            try {
                const res = await honoClient.api.rolePermission.currentUserRolePermission.$get();
                const result = await unwrapResponse<UserRolePermission>(res);

                if (!cancelled) {
                    setAuthz(result);
                }
            } catch (error) {
                const message = error instanceof ApplicationException ? error.message : '权限信息加载失败';
                const code = error instanceof ApplicationException ? error.code : COMMON_RESPONSE.UNKNOWN_ERROR.code;

                if (!cancelled) {
                    setErrorInfo({ title: code, desc: message });
                }
            }
        };

        void loadAuthz();

        return () => {
            cancelled = true;
        };
    }, []);

    // 路由被(..)activity拦截，到了并行modal路由下的activity/[id]/page.tsx中，
    // 展示page中的Dialog模态框
    const goActivityDetail = (id: string) => {
        router.push(ACTIVITY_ROUTES.GET_BY_ID(id))
    }

    return (
        <>
            {errorInfo && <ErrorAlert title={errorInfo.title} desc={errorInfo.desc} />}
            {isLoading && <div className="w-full max-w-4xl mx-auto space-y-4 p-4">
                <div className="h-5 bg-gray-200 rounded animate-pulse" />
                <div className="h-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-28 bg-gray-200 rounded animate-pulse" />
            </div>}
            {!errorInfo && !isLoading && activities.length === 0 && <div >暂无数据</div>}
            {!errorInfo && !isLoading && activities.length > 0 &&
                <div className="w-full flex flex-col gap-5 max-w-4xl mx-auto md:gap-5">
                    <ActivityFilterBar />
                    <ActivityList
                        activities={activities}
                        authz={authz}
                        onItemClick={goActivityDetail}
                    />
                    <PageProvider />
                </div>
            }
        </>
    )
}

export default ActivityPage
