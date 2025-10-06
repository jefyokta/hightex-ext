import { Loading } from "@/components/ui/spinner";
import { createContext, useContext, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from "react";

const LoadingContext = createContext<{ setLoading: Dispatch<SetStateAction<boolean>>, loading: boolean }>({ setLoading: () => { }, loading: false })



export const LoadingProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [loading, setLoading] = useState(false)
    return <LoadingContext.Provider value={{ setLoading, loading }}>
        {loading ? <Loading></Loading> : children}
    </LoadingContext.Provider>

}

export const useLoading = () => {

    return useContext(LoadingContext)
}