import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-black",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-gray-400",
        "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
