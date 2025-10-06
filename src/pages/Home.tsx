import { Button } from "@/components/ui/button"
import { InputDropdown } from "@/components/ui/input-dropdown"
import { Textarea } from "@/components/ui/textarea"
import { Provider, useCite } from "@/hooks/use-current-cite"
import { AppLayout } from "@/layouts/app-layout"
import { useNavigate } from "@/route"
import { Edit3 } from "lucide-react"
import { useEffect, useState } from "react"
import {
    IconBrandJavascript,
    IconCopy,
    IconCornerDownLeft,
    IconRefresh,
} from "@tabler/icons-react"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { message } from "@/background/helper"
import { Loading } from "@/components/ui/spinner"
import { useLoading } from "@/hooks/use-loading"
import { toast } from "sonner"


type ReferenceStoreResponse = {
    errors?: string[],
    data?: any
}
export const Home = () => {
    return <BibTexInput></BibTexInput>
}


export const BibTexInput = () => {
    const [editable, setEditable] = useState(false)
    const { setBib, bib, store } = useCite()
    const { setLoading } = useLoading()
    useEffect(() => {
        setLoading(true)
        message<{ data: string }, any>({ action: "getUrl" }, (res) => {
            if (res.ok) {
                setBib(res.data)
            } else {
                console.log("Failed to get URL data")
            }
        })
        setLoading(false)
    }, [])


    return (<div className="grid w-full max-w-md gap-4 px-2 py-3">
        <InputGroup
            className="!focus:ring-0 !focus-visible:ring-0 !focus:border-gray-200 !focus:outline-none"
        >
            <InputGroupTextarea
                id="textarea-code-32"
                placeholder="..."
                className="min-h-[200px] "
                onChange={(e) => setBib(e.target.value)}
                value={bib}
                readOnly={!editable}
            />
            <InputGroupAddon align="block-end" className="border-t">
                <InputDropdown />
                <InputGroupButton size="sm" className="ml-auto text-xs" variant="default" onClick={() => {
                    setLoading(true)
                    store()
                    .then<ReferenceStoreResponse>(r => r.json())
                    .then(r => {
                        r.errors && toast("error", { description: r.errors })
                        r.data && toast.success("added");
                    }).finally(()=>{
                        setLoading(false)
                    })       
                }


                }>
                    Save <IconCornerDownLeft />
                </InputGroupButton>
            </InputGroupAddon>
            <InputGroupAddon align="block-start" className="border-b">
                <InputGroupText className="font-mono font-medium">
                    Bibtex
                </InputGroupText>
                <InputGroupButton className="ml-auto" variant={editable ? "secondary" : 'ghost'} onClick={() => setEditable(prev => !prev)} size="icon-xs">
                    <Edit3 />
                </InputGroupButton>
                <InputGroupButton variant="ghost" size="icon-xs"
                    onClick={() => { navigator.clipboard.writeText(bib) }}
                >
                    <IconCopy />
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    </div>
    )
}
