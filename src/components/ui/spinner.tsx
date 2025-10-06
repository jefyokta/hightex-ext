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


export function Loading() {
  return (
    <div className="flex flex-col justify-center w-full h-[650px] items-center gap-4">
      <Button  disabled size="sm">
        <Spinner />
        Processing
      </Button>
    </div>
  )
}


export { Spinner }
