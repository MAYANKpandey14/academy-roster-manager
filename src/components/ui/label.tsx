
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, children, ...props }, ref) => {
  // Add a visual indicator for required fields
  const isRequired = props["aria-required"] === "true";
  
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    >
      {children}
      {isRequired && <span className="text-red-500 ml-1">*</span>}
    </LabelPrimitive.Root>
  );
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
