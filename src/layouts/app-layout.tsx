import { Tab } from "@/components/ui/navigation"
import type { PropsWithChildren } from "react"



export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="w-full relative h-full items-center pb-10 pt-5 px-5">
        <div className="w-full h-10"><h1 className="font-semibold text-2xl">Hightex Reference Manager</h1></div>
        <div className="overflow-y-scroll h-[85%] my-5 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {children}
        </div>
        <Tab />
    </div>
}