import { ReactNode, Suspense } from 'react'
import '@/styles/globals.css'
import { Metadata } from 'next'
import { ThemeProvider } from '@/lib/components/theme-provider.tsx';
import { SidebarProvider } from '@/lib/components/ui/sidebar.tsx';
import AppSidebar from '@/lib/components/web/Sidebar.tsx';
import Header from '@/lib/components/web/Header.tsx';

export const metadata: Metadata = {
    title: "My Website"
}
const RootLayout = async ({ children }: { children: ReactNode }) => {
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
                            <Suspense fallback={null}>
                                <Header />
                            </Suspense>
                            <div className='flex-1 flex flex-col items-center'>
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
