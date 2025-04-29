
import * as React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { prepareTextForLanguage, shouldAlwaysUseEnglish, isAuthPage } from "@/utils/textUtils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  preserveSpecialChars?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, lang, value, preserveSpecialChars = true, ...props }, ref) => {
    const { i18n } = useTranslation();
    
    // Disable Hindi for Auth pages
    const isAuthPageActive = isAuthPage();
    
    // Use the provided lang or default to current app language, but force English for auth pages
    const textareaLang = isAuthPageActive ? 'en' : (lang || i18n.language);
    
    // Determine if KrutiDev font should be applied
    const isHindi = textareaLang === 'hi' && !isAuthPageActive;
    const fontClass = isHindi ? 'krutidev-font' : '';
    
    // Process value for proper encoding if it's a string
    const processedValue = typeof value === 'string' 
      ? prepareTextForLanguage(value, textareaLang) 
      : value;
    
    // Create a React component that can render the placeholder properly
    // with preserved special characters if Hindi is active
    const PlaceholderComponent = React.useMemo(() => {
      if (!props.placeholder || !isHindi || !preserveSpecialChars) return null;
      
      return (
        <style dangerouslySetInnerHTML={{
          __html: `
            #${props.id || ''}.custom-textarea::placeholder {
              font-family: 'KrutiDev', sans-serif;
            }
            .preserve-char {
              font-family: 'Space Grotesk', sans-serif !important;
            }
          `
        }} />
      );
    }, [props.placeholder, isHindi, preserveSpecialChars, props.id]);
    
    return (
      <>
        {PlaceholderComponent}
        <textarea
          id={props.id}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isHindi ? 'custom-textarea krutidev-text' : '',
            className
          )}
          ref={ref}
          lang={textareaLang}
          dir="ltr" // Always LTR as specified
          inputMode={isHindi ? "text" : undefined}
          value={processedValue}
          {...props}
        />
      </>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
