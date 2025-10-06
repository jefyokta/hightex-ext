import { Tab } from "@/components/ui/navigation"
import { Provider } from "@/hooks/use-current-cite"
import { useEffect, useState, type PropsWithChildren } from "react"
import { Authenticated, useAuthContext } from "./authenticated"
import { LoadingProvider } from "@/hooks/use-loading"
import { MainLayout } from "./main-layout"



export const AppLayout: React.FC<PropsWithChildren> = ({ children }) => {

    return <MainLayout>
        <Authenticated>
            <div
                className="w-full relative h-full items-center pb-10 pt-5 px-5">
                <Nav />
                <div className="overflow-y-scroll h-[85%] my-5 relative [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <Provider>
                        {children}
                    </Provider>
                </div>
                <Tab />
            </div>
        </Authenticated>
    </MainLayout>
}

const Nav = () => {
    const { user } = useAuthContext()

    return <div className="w-full h-10 flex justify-between items-center">
        <h1 className="font-semibold text-sm">Hightex Reference Manager</h1>
        <div>
            <div className="text-xs text-end">{user?.name}</div>
            <div className="text-xs text-end">{user?.email.split("@")[0]}</div>
        </div>
    </div>
}