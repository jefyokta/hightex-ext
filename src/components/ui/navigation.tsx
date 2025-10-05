import { HomeIcon, LogOut, QuoteIcon } from "lucide-react";
import { FloatingDock } from "./floating-dock";



export const Tab = () => {

    const links = [{
        title: "Home",
        icon: (<HomeIcon  className="w-full h-full"/>),
        path: "home"
    }, {
        title: "references",
        icon: (<QuoteIcon  className="w-full h-full"/>),
        path: "reference"

    }, {
        title: "logout",
        icon: (<LogOut  className="w-full h-full"/>),
        path: "logout"

    }];
    return <div className="flex absolute bottom-2 items-center justify-center  w-full">
        <FloatingDock items={links as any} />
    </div>
}