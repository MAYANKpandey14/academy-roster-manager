
import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { prepareTextForLanguage, shouldAlwaysUseEnglish } from "@/utils/textUtils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, lang, value, placeholder, ...props }, ref) => {
    const { i18n } = useTranslation();
    
    // Always use 'en' language for date and number inputs
    const isSpecialField = type && shouldAlwaysUseEnglish(type);
    
    // Use the provided lang or default to current app language
    const inputLang = isSpecialField ? 'en' : (lang || i18n.language);
    
    // Determine if KrutiDev font should be applied, never for date/number fields
    const isHindi = inputLang === 'hi' && !isSpecialField;
    
    // Apply appropriate font class based on input type
    let fontClass = '';
    if (isHindi) {
      if (placeholder) {
        fontClass = 'krutidev-placeholder';
      } else {
        fontClass = 'krutidev-text';
      }
    }
    
    // Process value for proper encoding if it's a string
    const processedValue = typeof value === 'string' 
      ? prepareTextForLanguage(value, inputLang) 
      : value;
      
    // Process placeholder for Hindi if needed
    const processedPlaceholder = isHindi && typeof placeholder === 'string'
      ? prepareTextForLanguage(placeholder, inputLang)
      : placeholder;
    
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
        placeholder={processedPlaceholder}
        accept-charset="UTF-8"
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
