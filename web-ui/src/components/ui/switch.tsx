import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-7 w-16 shrink-0 items-center rounded-2xl bg-background p-0.5 transition-colors duration-250 outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-6 w-[39px] rounded-xl bg-card ring-0 transition-transform duration-250 data-[state=checked]:translate-x-[21px] data-[state=unchecked]:translate-x-0 dark:bg-foreground"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
