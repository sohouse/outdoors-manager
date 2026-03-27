'use client'

import Link from "next/link"
import {buttonVariants} from "../ui/button.tsx"
import {ModeToggle} from "./ModeToggle.tsx"
import {useRouter, useSearchParams} from "next/navigation"
import React, {useEffect, useMemo, useState} from "react"
import {useScroll} from "@/lib/hooks/use-scroll.ts"
import {cn} from "@/lib/utils/tailwind-helper.ts"
import {Home, LogInIcon, LogOutIcon, UserPlus} from "lucide-react"
import {auth} from "@/lib/auth-client.ts";
import Image from "next/image";
import {COMMON_ROUTES} from "@/lib/config/routes.ts";
import {honoClient} from "@/lib/api/main.ts";

type loginUser = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null | undefined;
}

const Header = () => {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [user, setUser] = useState({} as loginUser);

    const route = useRouter();

    useEffect(() => {
        const loadUser = async () => {
            const {data} = await auth.getSession();
            if (data) {
                const user: loginUser = data.user;
                setUser(user);
            }
        }

        void loadUser();
    }, [])

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

    const userLogOut = async (e: React.MouseEvent) => {
        e.preventDefault();
        await honoClient.api.auth['logOut'].$get()
        route.push(COMMON_ROUTES.LOGIN)
    }

    return (
        <div className="flex justify-between items-center w-full min-h-30 sticky top-0 z-10 flex-row">
            <button
                className="md:hidden flex"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
                ☰
            </button>
            <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} 
        md:flex md:flex-row md:relative md:bg-transparent md:p-0 md:shadow-none md:w-full md:top-0
        flex-col top-auto w-full px-4`}>
                <nav className={cn('main-header', {'main-header-scroll': scrolled, 'main-header-unscroll': !scrolled})}>
                    <div className="flex items-center gap-8">
                        <Link href="/public">
                            <h1 className="md:text-3xl font-bold text-base">
                                Go<span className="text-blue-500">Hiking</span>
                            </h1>
                        </Link>

                        <div className="flex gap-5">
                            <Link className={buttonVariants({variant: "destructive"})} href="/public">
                                <div>
                                    <Home className="w-5 h-5 md:hidden"/>
                                    <span className="hidden md:inline">Home</span>
                                </div>
                            </Link>

                            <Link className={`${buttonVariants({variant: "destructive"})} hidden! md:inline!`}
                                  href={`/activity${urlQuery}`}>Activity</Link>
                            <Link className={`${buttonVariants({variant: "destructive"})} hidden! md:inline!`}
                                  href="/topics/create">Create</Link>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        {user ? (<div className="flex gap-5 ">
                            <div>
                                {user.image ?
                                    <Image src={user.image} className="rounded-full border-none" alt=''/>
                                    : <div>{user.name}</div>
                                }
                            </div>
                            <Link className={buttonVariants({variant: "destructive"})} href="" onClick={userLogOut}>
                                <div>
                                    <LogOutIcon className="w-5 h-5 md:hidden"/>
                                    <span className="hidden md:inline">LogOut</span>
                                </div>
                            </Link>
                        </div>) : (<div className="flex gap-5">
                            <Link className={buttonVariants({variant: "destructive"})} href="/auth/sign-up">
                                <div>
                                    <UserPlus className="w-5 h-5 md:hidden"/>
                                    <span className="hidden md:inline">Sign Up</span>
                                </div>
                            </Link>
                            <Link className={buttonVariants({variant: "destructive"})} href="/auth/login">
                                <div>
                                    <LogInIcon className="w-5 h-5 md:hidden"/>
                                    <span className="hidden md:inline">Login</span>
                                </div>
                            </Link>
                        </div>)}
                        <ModeToggle/>
                    </div>

                </nav>
            </div>
        </div>
    )
}

export default Header