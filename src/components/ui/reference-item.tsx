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
import type { CiteUtils } from "bibtex.js"

export const Reference: React.FC<{ cite: CiteUtils }> = ({ cite }) => {
    return (
        <Item variant="outline" size={'sm'}>
            <ItemMedia>
                <Avatar className="size-10">
                    <AvatarFallback><QuoteIcon /></AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                <ItemTitle>Title</ItemTitle>
                <ItemDescription>In 2002</ItemDescription>
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
    return <div className="flex flex-col w-full h-[400px] overflow-y-auto space-y-3">

        {[1, 2, 2, 2, 2, , 2, 2, , 2, 2, 2, 2, 2, , 2, 2, 2, 2, , 2, 2].map((e, i) => {
            {/* @ts-ignore */ }
            return <Reference key={i} />
        })}


    </div>
}
