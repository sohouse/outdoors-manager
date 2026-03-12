import { ReactNode } from "react"
import { ModeToggle } from "./ModeToggle.tsx"

const ShardModeToggle = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <ModeToggle />
            {children}
        </div>
    )
}

export default ShardModeToggle