'use client'

import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { ModeToggle } from "./modeToggle"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"
import { useScroll } from "@/hooks/useScroll"
import { cn } from "@/lib/utils"

const Header = () => {

  // 保存当前路径
  const searchParams = useSearchParams();
  /* 缓存searchParams，每次页面渲染会执行两个动作：
    1，把searchParams解析为URLSearchParams实例
    2，判断要不要加?拼接为完整的URL
    而当搜索字符串不变时，useMemo缓存了这两步的操作。
  */
  const urlQuery = useMemo(() => {
    const query = searchParams.toString();
    return query ? `?${query}` : '';
  }, [searchParams]);

  const scrolled = useScroll(10);

  return (
    <div className="flex justify-between items-center pb-5 gap-5 w-full min-h-30 sticky top-0 z-10 ">
      <nav className={cn('main-header', { 'main-header-scroll': scrolled, 'main-header-unscroll': !scrolled })}>
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className="text-3xl font-bold">
              My<span className="text-blue-500">Website</span>
            </h1>
          </Link>

          <div className="flex gap-5">
            <Link className={buttonVariants({ variant: "destructive" })} href="/">Home</Link>
            <Link className={buttonVariants({ variant: "destructive" })} href={`/activity${urlQuery}`}>Activity</Link>
            <Link className={buttonVariants({ variant: "destructive" })} href="/topics/create">Create</Link>
          </div>
        </div>

        <div className="flex gap-5">
          <Link className={buttonVariants({ variant: "destructive" })} href="/auth/sign-up">Sign up</Link>
          <Link className={buttonVariants({ variant: "destructive" })} href="/auth/login">Login</Link>
          <ModeToggle />
        </div>

      </nav>
    </div>
  )
}

export default Header