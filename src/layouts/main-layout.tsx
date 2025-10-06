import { Toaster } from "@/components/ui/sonner"
import { LoadingProvider } from "@/hooks/use-loading"
import type { PropsWithChildren } from "react"


export const MainLayout: React.FC<PropsWithChildren> = ({ children }) => {

    return <LoadingProvider>{children}
        <Toaster />
    </LoadingProvider>
}