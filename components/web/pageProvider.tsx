import { useActivityStore } from '@/stores/activityStore';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from '../ui/pagination'

const PageProvider = () => {
    const { paginateMeta, setPageCondition } = useActivityStore();

    // 处理页码点击事件
    const handlePageChange = (page: number) => {
        setPageCondition({ page });
        // if (page !== paginateMeta.currentPage && page >= 1 && page <= totalPages) {
        // }
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(paginateMeta.currentPage - 1);
                        }}
                        text='上一页'
                        disabled={!paginateMeta.currentPage || paginateMeta.currentPage <= 1} />
                </PaginationItem>
                {
                    Array.from({ length: paginateMeta.totalPage }).map((_, index) => (
                        <PaginationItem key={`activity${index}`}>
                            <PaginationLink isActive={index + 1 === paginateMeta.currentPage} onClick={(e) => {
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
                            handlePageChange(paginateMeta.currentPage + 1)
                        }}
                        disabled={!paginateMeta.currentPage || paginateMeta.currentPage >= paginateMeta.totalPage} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default PageProvider