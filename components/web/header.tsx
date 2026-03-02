'use client'

import Link from "next/link"
import { buttonVariants } from "../ui/button"
import { ModeToggle } from "./modeToggle"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

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

  return (
    <nav className="w-full flex items-center justify-between h-full transition-[background-color] ease-in-out duration-300 border-b-2 border-gray-500 border-solid">
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
  )
}

export default Header