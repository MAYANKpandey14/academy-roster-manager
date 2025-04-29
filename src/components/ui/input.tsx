
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    // Always use 'en' language for date, number, tel inputs
    const isSpecialField = type === 'date' || type === 'number' || type === 'tel' || type === 'email' || type === 'password';
    
    // Apply appropriate font class based on input type
    const fontClass = isSpecialField ? '' : 'font-mangal';
    
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          fontClass,
          className
        )}
        ref={ref}
        dir="ltr"
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
