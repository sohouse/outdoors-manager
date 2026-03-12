'use client'

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation'
import { ReactNode } from 'react'

const CarLayout = ({ auth, children }: { auth: ReactNode, children: ReactNode }) => {
    const p = useSelectedLayoutSegment('a');
    return (
        <div>
            <nav>
                <Link href="/car/login">Open modal</Link>
            </nav>
            {auth}
            {children}
            layoutSegment: {p}
        </div>
    )
}

export default CarLayout