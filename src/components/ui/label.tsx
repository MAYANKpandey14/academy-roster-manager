
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { createHtmlWithPreservedSpecialChars } from "@/utils/textUtils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

interface LabelProps extends 
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
  VariantProps<typeof labelVariants> {
  preserveSpecialChars?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, children, preserveSpecialChars = true, ...props }, ref) => {
  const { i18n } = useTranslation();
  
  const isHindi = i18n.language === 'hi';
  const needsSpecialHandling = isHindi && preserveSpecialChars && typeof children === 'string';
  
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), 
        isHindi ? 'dynamic-text' : '',
        className
      )}
      {...props}
    >
      {needsSpecialHandling ? (
        <span 
          dangerouslySetInnerHTML={createHtmlWithPreservedSpecialChars(children as string, i18n.language)} 
        />
      ) : (
        children
      )}
    </LabelPrimitive.Root>
  )
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
