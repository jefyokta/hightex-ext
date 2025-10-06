import { useAuth } from "@/hooks/use-auth"
import { useNavigate } from "@/route"
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react"


export const Authenticated: React.FC<PropsWithChildren> = ({ children }) => {


    return <AuthProvider>{children}</AuthProvider>
}



const AuthContext = createContext<any>(null);
const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [user, setUser] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const to = useNavigate()
    useEffect(() => {
        setLoading(true)
        chrome.storage.session.get("user").then(r => {
            setUser(r.user)
            if (!r.user) {
                to({ path: "login" })
            }

        }).finally(() => {
            setLoading(false)
        })
    }, [])

    return loading ? <div className="text-xl">Loading.....</div> : <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};



export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be inside AuthProvider");
    return ctx;
};
