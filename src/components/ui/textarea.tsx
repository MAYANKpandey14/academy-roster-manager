
import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { prepareTextForLanguage } from "@/utils/textUtils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, lang, value, ...props }, ref) => {
    const { i18n } = useTranslation();
    
    // Use the provided lang or default to current app language
    const textareaLang = lang || i18n.language;
    
    // Determine if KrutiDev font should be applied
    const isHindi = textareaLang === 'hi';
    const fontClass = isHindi ? 'krutidev-font' : '';
    
    // Process value for proper encoding if it's a string
    const processedValue = typeof value === 'string' 
      ? prepareTextForLanguage(value, textareaLang) 
      : value;
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          fontClass,
          className
        )}
        ref={ref}
        lang={textareaLang}
        dir="ltr" // Always LTR as specified
        inputMode={isHindi ? "text" : undefined}
        value={processedValue}
        accept-charset="UTF-8"
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
