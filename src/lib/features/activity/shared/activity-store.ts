import { ActivityConditions } from '@/lib/features/activity/shared/activity.ts'
import { PaginateCondition, PaginateMeta } from '@/lib/types/pagination.ts'
import { create } from 'zustand'
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "@/lib/constants.ts";

type activityStoreType = {
    condition: ActivityConditions,
    paginateMeta: PaginateMeta,
    refreshFlag: number,
    setPaginateMeta: (meta: PaginateMeta) => void,
    setCondition: (condition: PaginateCondition) => void,
    setPageRefresh: () => void
}

const useActivityStore = create<activityStoreType>((set) => ({
    condition: {page: DEFAULT_PAGE, limit:DEFAULT_LIMIT},
    paginateMeta: {totalCount:0, limit:0, pageSize:0, totalPage:0, page:0},
    refreshFlag: 0,
    setPaginateMeta: (page) => set(() => ({
        paginateMeta: {...page}
    })),
    setCondition: (patch: Partial<ActivityConditions>) => set((state) => ({
        // 做筛选条件和分页条件的合并，不会冲掉筛选条件，后面的覆盖前面的同名属性
        condition: {...state.condition, ...patch}
    })),
    setPageRefresh: () => set((state) => ({
        refreshFlag: state.refreshFlag + 1
    }))
}))

export { useActivityStore }