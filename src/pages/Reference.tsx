import { ReferencesList } from "@/components/ui/reference-item"
import { AppLayout } from "@/layouts/app-layout"
import { useState } from "react"


export const Reference = () => {

    const [references, setReference] = useState([])

    return <div className="h-full overflow-y-auto">
        <ReferencesList />
    </div>
}