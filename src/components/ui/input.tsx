
import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { prepareTextForLanguage, shouldAlwaysUseEnglish, createHtmlWithPreservedSpecialChars, isAuthPage } from "@/utils/textUtils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  preserveSpecialChars?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, lang, value, placeholder, preserveSpecialChars = true, ...props }, ref) => {
    const { i18n } = useTranslation();
    
    // Disable Hindi for Auth pages and specific field types
    const isAuthPageActive = isAuthPage();
    
    // Always use 'en' language for auth pages, date and number inputs
    const isSpecialField = type && shouldAlwaysUseEnglish(type);
    const forceEnglish = isAuthPageActive || isSpecialField;
    
    // Use the provided lang or default to current app language
    const inputLang = forceEnglish ? 'en' : (lang || i18n.language);
    
    // Determine if KrutiDev font should be applied, never for date/number/auth fields
    const isHindi = inputLang === 'hi' && !forceEnglish;
    
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
      
    // Create a React component that can render the placeholder properly
    // with preserved special characters if Hindi is active
    const PlaceholderComponent = React.useMemo(() => {
      if (!placeholder || !isHindi || !preserveSpecialChars) return null;
      
      return (
        <style dangerouslySetInnerHTML={{
          __html: `
            #${props.id || ''}.custom-input::placeholder {
              font-family: 'KrutiDev', sans-serif;
            }
            .preserve-char {
              font-family: 'Space Grotesk', sans-serif !important;
            }
          `
        }} />
      );
    }, [placeholder, isHindi, preserveSpecialChars, props.id]);
    
    return (
      <>
        {PlaceholderComponent}
        <input
          id={props.id}
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            isHindi ? 'custom-input' : '',
            fontClass,
            className
          )}
          ref={ref}
          lang={inputLang}
          dir="ltr" // Always LTR as specified
          inputMode={isHindi ? "text" : undefined}
          value={processedValue}
          placeholder={placeholder}
          {...props}
        />
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
