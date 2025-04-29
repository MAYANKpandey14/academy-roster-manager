
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
    const fontClass = isHindi ? 'krutidev-text' : '';
    
    // Process value for proper encoding if it's a string
    const processedValue = typeof value === 'string' 
      ? prepareTextForLanguage(value, textareaLang) 
      : value;
    
    // Create a style component that handles placeholder special characters
    const PlaceholderComponent = React.useMemo(() => {
      if (!props.placeholder || !isHindi || !preserveSpecialChars) return null;
      
      // Create a unique ID for this textarea if not provided
      const textareaId = props.id || `textarea-${Math.random().toString(36).substring(2, 9)}`;
      
      return (
        <style dangerouslySetInnerHTML={{
          __html: `
            #${textareaId}.krutidev-text::placeholder {
              font-family: 'KrutiDev', sans-serif;
            }
            textarea::placeholder {
              color: var(--muted-foreground);
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
            isHindi ? 'krutidev-text' : '',
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
