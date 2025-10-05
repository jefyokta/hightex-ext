import { Tab } from "@/components/ui/navigation"
import { Provider } from "@/hooks/use-current-cite"
import type { PropsWithChildren } from "react"



export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {
    return <div className="w-full relative h-full items-center pb-10 pt-5 px-5">
        <div className="w-full h-10 flex justify-between items-center">
            <h1 className="font-semibold text-sm">Hightex Reference Manager</h1>
            <div>
                <div className="text-xs text-end">Jepi Okta</div>
                <div className="text-xs text-end">12250314612</div>
            </div>
        </div>
        <div className="overflow-y-scroll h-[85%] my-5 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Provider>
                {children}
            </Provider>
        </div>
        <Tab />
    </div>
}