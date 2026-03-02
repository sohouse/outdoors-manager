import { ActivityCondition } from '@/types/activity'
import { PaginateCondition, PaginateMeta } from '@/types/pagination'
import { create } from 'zustand'

type activityStoreType = {
    condition: ActivityCondition,
    paginateMeta: PaginateMeta,
    refreshFlag: number,
    setPaginateMeta: (meta: PaginateMeta) => void,
    setPageCondition: (condition: PaginateCondition) => void,
    setPageRefresh: () => void
}

const useActivityStore = create<activityStoreType>((set) => ({
    condition: {page: 1, limit:5},
    paginateMeta: {totalCount:0, currentCount:0, pageSize:0, totalPage:0, currentPage:0},
    refreshFlag: 0,
    setPaginateMeta: (page) => set(() => ({
        paginateMeta: {...page}
    })),
    setPageCondition: (condition) => set(() => ({
        condition: condition
    })),
    setPageRefresh: () => set((state) => ({
        refreshFlag: state.refreshFlag + 1
    }))
}))

export { useActivityStore }