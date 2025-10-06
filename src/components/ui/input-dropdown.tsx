import { ChevronDownIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { useEffect, useState } from "react";
import { CiteUtils } from "bibtex.js";
import { useCite } from "@/hooks/use-current-cite";

type CiteType = "Cite" | "Cite Author";

const handler: Record<
    CiteType,
    { name: CiteType; handler: (cite: CiteUtils) => string }
> = {
    "Cite": {
        name: "Cite",
        handler(cite) {
            return cite.toCite();
        },
    },
    "Cite Author": {
        name: "Cite Author",
        handler(cite) {
            return cite.toCiteA();
        },
    },
};

export const InputDropdown: React.FC = () => {
    const items: CiteType[] = ["Cite", "Cite Author"];
    const [selected, setSelected] = useState<CiteType>("Cite");
    const [output, setOutput] = useState<string>("");
    const { cite, bib } = useCite();

    const handleSelect = (type: CiteType) => {
        setSelected(type);
        if (!cite) return;
        const fn = handler[type];
        if (fn) setOutput(fn.handler(cite));
    };
    useEffect(() => {
        handleSelect(selected)
    },[bib])

    return (
        <div className="text-xs">
            <InputGroup className="ring-transparent">

                <InputGroupInput placeholder="" value={output} readOnly className="ring-transparent text-xs" />
                <InputGroupAddon align="inline-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <InputGroupButton variant="ghost" className="!pr-1.5 text-xs">
                                {selected} <ChevronDownIcon className="size-3" />
                            </InputGroupButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="[--radius:0.95rem]">
                            {items.map((it) => (
                                <DropdownMenuItem
                                    className="text-xs"
                                    key={it}
                                    onClick={() => handleSelect(it)}
                                >
                                    {it}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </InputGroupAddon>
            </InputGroup>
        </div>
    );
};
