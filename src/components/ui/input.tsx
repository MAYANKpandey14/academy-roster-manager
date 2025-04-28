
import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { prepareTextForLanguage } from "@/utils/textUtils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, lang, value, ...props }, ref) => {
    const { i18n } = useTranslation();
    
    // Use the provided lang or default to current app language
    const inputLang = lang || i18n.language;
    
    // Determine if KrutiDev font should be applied
    const isHindi = inputLang === 'hi';
    const fontClass = isHindi ? 'krutidev-font' : '';
    
    // Process value for proper encoding if it's a string
    const processedValue = typeof value === 'string' 
      ? prepareTextForLanguage(value, inputLang) 
      : value;
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          fontClass,
          className
        )}
        ref={ref}
        lang={inputLang}
        dir="ltr" // Always LTR as specified
        inputMode={isHindi ? "text" : undefined}
        value={processedValue}
        accept-charset="UTF-8"
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
