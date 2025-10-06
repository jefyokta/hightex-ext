import { Plus, QuoteIcon } from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import type React from "react"
import { bibToObject, CiteUtils } from "bibtex.js"
import { useEffect, useState } from "react"
import { useCite } from "@/hooks/use-current-cite"
import { useNavigate } from "@/route"

export const Reference: React.FC<{ cite: CiteUtils }> = ({ cite }) => {
    return (
        <Item variant="outline" size={'sm'}>
            <ItemMedia>
                <Avatar className="size-10">
                    <AvatarFallback><QuoteIcon /></AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{cite.getTitle()}</ItemTitle>
                <ItemDescription>{cite.formatAuthorname() || ""} In {cite.getCite().data.year || "unkown year"}</ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button
                    size="icon-sm"
                    variant="outline"
                    className="rounded-full"
                    aria-label="Invite"
                >
                    <Plus />
                </Button>
            </ItemActions>
        </Item>
    )
}

export const ReferencesList = () => {

    const [reference, setReference] = useState<CiteUtils[]>([])
    const { getReference } = useCite();

    const to = useNavigate()

    const handler =()=> getReference().then(r => {
        if (r.bib && !r.error) {

            const cites = bibToObject(r.bib.map(r => r.bib).join("\n"))
            setReference(cites.map(c => { console.log(c); return new CiteUtils(c) }))
        }
        if (r.error) {
            r.error == 'Unauthenticated.'  && to({path:"login"})
            
        }
        console.log(r)
    })
    useEffect(() => {

        handler()

    }, [])
    return <div className="flex flex-col w-full h-[400px] overflow-y-auto space-y-3">

        {reference.length == 0 ? <h1 className="text-center">No data</h1> : reference.map((e, i) => {
            return <Reference cite={e} key={i} />
        })}


    </div>
}
