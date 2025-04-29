
import * as React from "react";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

export const actionButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionButtonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode;
  iconOnly?: boolean;
  isLoading?: boolean;
  showTextOnMobile?: boolean;
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      iconOnly = false,
      isLoading = false,
      showTextOnMobile = false,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const Comp = asChild ? Slot : "button";
    const shouldShowOnlyIcon = iconOnly || (isMobile && !showTextOnMobile);

    return (
      <Comp
        className={cn(actionButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        {!shouldShowOnlyIcon && children}
      </Comp>
    );
  }
);

ActionButton.displayName = "ActionButton";

export { ActionButton };
