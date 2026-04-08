import { useActivityStore } from '@/lib/features/activity/shared/activity-store.ts';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '../ui/pagination.tsx'
import {DEFAULT_LIMIT} from "@/lib/constants.ts";

const PageProvider = () => {
    const { paginateMeta, setCondition: setPageCondition } = useActivityStore();

    // 处理页码点击事件
    const handlePageChange = (page: number) => {
        setPageCondition({ page, limit: DEFAULT_LIMIT });
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(paginateMeta.page - 1);
                        }}
                        text='上一页'
                        disabled={!paginateMeta.page || paginateMeta.page <= 1} />
                </PaginationItem>
                {
                    Array.from({ length: paginateMeta.totalPage }).map((_, index) => (
                        <PaginationItem key={`activity${index}`}>
                            <PaginationLink isActive={index + 1 === paginateMeta.page} onClick={(e) => {
                                e.preventDefault();
                                handlePageChange(index + 1)
                            }}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))
                }

                <PaginationItem>
                    <PaginationNext
                        text='下一页'
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(paginateMeta.page + 1)
                        }}
                        disabled={!paginateMeta.page || paginateMeta.page >= paginateMeta.totalPage} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PageProvider