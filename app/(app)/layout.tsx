import { ReactNode } from 'react'
import '@/app/styles/globals.css';
import { Metadata } from 'next'
import { ThemeProvider } from '@/lib/components/theme-provider';
import { SidebarProvider } from '@/lib/components/ui/sidebar';
import AppSidebar from '@/lib/components/web/sidebar';
import Header from '@/lib/components/web/header';

export const metadata: Metadata = {
    title: "My Website"
}
const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html suppressHydrationWarning>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <SidebarProvider className='border-amber-50'>
                        <AppSidebar />
                        <main className='px-4 md:px-6 lg:px-8 w-full mx-auto flex flex-col'>
                            <Header />
                            <div className='flex-1 flex items-center justify-center'>
                                {children}
                            </div>
                        </main>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}

export default RootLayout