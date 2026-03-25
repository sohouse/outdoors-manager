import Link from "next/link"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarTrigger } from "../ui/sidebar.tsx"
import { buttonVariants } from "../ui/button.tsx"

const items = [
    {
        title: "活动管理",
        url: "/activity",
    },
    {
        title: "领队管理",
        url: "/leader",
    },
    {
        title: "车辆管理",
        url: "/car",
    },
    {
        title: "物资管理",
        url: "/material",
    },
]

const AppSidebar = () => {
    return (
        <Sidebar>
            <SidebarContent >
                <SidebarGroup>
                    <div className="flex justify-between">
                        <SidebarGroupLabel>Application</SidebarGroupLabel>
                        <SidebarTrigger />
                    </div>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                items.map(item => (
                                    <SidebarMenuItem key={item.title}>
                                        <Link className={buttonVariants({ variant: "outline", className: "w-full flex justify-center my-2" })} href={item.url}>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}

export default AppSidebar