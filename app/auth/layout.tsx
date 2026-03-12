'use client'

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MouseEventHandler, ReactNode, useCallback, useEffect, useState } from "react"
import '@/styles/globals.css'
import { ThemeProvider } from "@/lib/components/theme-provider"
import { useRouter } from "next/navigation"

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [historyLength, setHistoryLength] = useState(0);

  useEffect(() => {
    const updateHistoryLength = () => {
        if (typeof window !== 'undefined') {
          setHistoryLength(window.history.length);
        }
    }

    updateHistoryLength();
  }, []);

  const goBack: MouseEventHandler = useCallback((e) => {
    e.preventDefault();
    if (historyLength > 1) router.back();
  }, [historyLength, router]);

  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="h-screen flex items-center">
            <div className="absolute top-15 left-15">
              <Link href="/" className="flex" onClick={goBack}>
                <ArrowLeft />
                Go Back
              </Link>
            </div>

            <div className="max-w-md m-auto w-full">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default AuthLayout