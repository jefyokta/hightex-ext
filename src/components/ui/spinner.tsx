import { Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}


export function Loading({className}:{className?:string}) {
  return (
    <div className={` flex-col justify-center fixed w-full h-[650px] items-center gap-4 ${className}`}>
      <Button  disabled size="sm">
        <Spinner />
        Processing
      </Button>
    </div>
  )
}


export { Spinner }
