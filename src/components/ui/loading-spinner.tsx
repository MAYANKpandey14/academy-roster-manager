
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "secondary" | "muted";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = "md", 
  color = "primary", 
  className, 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };
  
  const colorClasses = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground"
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={cn(
        "animate-spin", 
        sizeClasses[size], 
        colorClasses[color],
        className
      )} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
