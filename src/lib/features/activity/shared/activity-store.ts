import { PaginateMeta } from '@/lib/types/pagination.ts'
import { create } from 'zustand'
import {DEFAULT_LIMIT, DEFAULT_PAGE} from "@/lib/constants.ts";
import z from 'zod';
import { activityConditionCheck } from './activity-check';

export const defaultActivityCondition: z.output<typeof activityConditionCheck> = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
};

type ActivityCondition = z.output<typeof activityConditionCheck>;

type activityStore = {
    condition: ActivityCondition,
    paginateMeta: PaginateMeta,
    refreshFlag: number,
    setPaginateMeta: (meta: PaginateMeta) => void,
    setCondition: (condition: Partial<ActivityCondition>) => void,
    setPageRefresh: () => void
}

const useActivityStore = create<activityStore>((set) => ({
    condition: defaultActivityCondition,
    paginateMeta: {totalCount:0, limit:0, pageSize:0, totalPage:0, page:0},
    refreshFlag: 0,
    setPaginateMeta: (page) => set(() => ({
        paginateMeta: {...page}
    })),
    setCondition: (patch: Partial<ActivityCondition>) => set((state) => ({
        // 做筛选条件和分页条件的合并，不会冲掉筛选条件，后面的覆盖前面的同名属性
        condition: {...state.condition, ...patch}
    })),
    setPageRefresh: () => set((state) => ({
        refreshFlag: state.refreshFlag + 1
    }))
}))

export { useActivityStore }
