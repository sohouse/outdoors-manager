'use client'
import { FC, ReactNode, useCallback, useMemo } from "react";
import clsx from "clsx";
import { isMatch } from 'micromatch'
import { trim } from "lodash";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog.tsx";

const ActivityDetailModal: FC<{ title: string, match: string[], className?: string, children: ReactNode, id: string }> = ({ match, children }) => {
    const pathname = usePathname();
    const router = useRouter();
    // 优化项：使用useMemo的缓存结果来替代useEffect+useState组合
    // 避免过重的函数引入和循环渲染风险

    const show = useMemo(() =>
        isMatch(trim(pathname, '/'), match.map((m) => trim(m, '/'))),
        [pathname, match]
    );

    const close = useCallback(() => router.back(), [router]);
    return show ? (
        <Dialog open defaultOpen onOpenChange={close}>
            <DialogContent
                className={clsx('sm:max-w-[80%]')}
                onEscapeKeyDown={(event) => event.preventDefault()}
                onInteractOutside={(event) => event.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>
                        活动详情
                    </DialogTitle>
                    <DialogDescription />
                </DialogHeader>
                <div className="overflow-y-auto max-h-[80vh] w-full px-3">{children}</div>
            </DialogContent>
        </Dialog>
    ) : null;
}

export default ActivityDetailModal