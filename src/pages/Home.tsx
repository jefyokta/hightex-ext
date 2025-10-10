import { Button } from "@/components/ui/button"
import { InputDropdown } from "@/components/ui/input-dropdown"
import { Textarea } from "@/components/ui/textarea"
import { Provider, useCite } from "@/hooks/use-current-cite"
import { AppLayout } from "@/layouts/app-layout"
import { useNavigate } from "@/route"
import { Edit3 } from "lucide-react"
import { useEffect, useState } from "react"
import {
    IconCopy,
    IconCornerDownLeft,
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
import { TaskManager, type Task, type TaskStatus } from "@/task/manager"
import { PopUpWorker } from "@/worker/popup-worker"


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
    const [myLoading, setMyLoading] = useState(false)
    useEffect(() => {

        const listener = TaskManager.watchMulti(["scholar.fetch", "bib.fetch", 'ieee.bib'], async (tasks) => {
            try {
                setLoading(true)
                if (tasks.length > 0) {
                    const task = tasks.reduce((latest, t) =>
                        !latest || t.createdAt > latest.createdAt ? t : latest,
                        undefined as Task<"scholar.fetch" | "bib.fetch" | 'ieee.bib'> | undefined
                    );
                    if (!task) {
                        return;
                    }

                    if (task.status == 'done') {
                        PopUpWorker.onTaskDone(task as Task<"scholar.fetch", 'done'>, (t) => {
                            setBib(t.result.bibtex)
                            TaskManager.done(t.taskName,true)
                        })
                    }
                    if (task.status == 'pending') {
                        PopUpWorker.onTask(task as Task<any, "pending">)

                    }
                }

            } catch (error) {
                console.log(error)
                let message: string = 'Unexpected error, please try again later';
                if (typeof error == 'string') {
                    message = error
                }
                if (error instanceof Error) {
                    message = error.message
                }
                toast.error(message)
            } finally {
                setLoading(false)
            }
        })

        return () => TaskManager.unwatch(listener)
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
                <InputGroupButton size="sm" disabled={myLoading} className="ml-auto text-xs" variant="default" onClick={async () => {
                    try {
                        console.log(bib)
                        setMyLoading(true)
                        const response = await store()
                        const r = await response.json() as ReferenceStoreResponse
                        console.log(r)
                        r.errors && toast("error", { description: (typeof r.errors == 'string' ? r.errors : Object.entries(r.errors).map(([k, v]) => v[0])[0]), position: "top-center" })
                        !r.errors && r.data && toast.success("added", { position: "top-center" });
                    } catch (error) {
                        toast("error", { description: "No Internet connection", position: "top-center" })
                    } finally {
                        setMyLoading(false)
                    }
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
