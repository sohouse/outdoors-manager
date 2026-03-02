import { ReactNode } from "react"
import { ModeToggle } from "./modeToggle"

const ShardModeToggle = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <ModeToggle />
            {children}
        </div>
    )
}

export default ShardModeToggle