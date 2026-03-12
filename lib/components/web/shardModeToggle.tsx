import { ReactNode } from "react"
import { ModeToggle } from "./modeToggle.tsx"

const ShardModeToggle = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <ModeToggle />
            {children}
        </div>
    )
}

export default ShardModeToggle