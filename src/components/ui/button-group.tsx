
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  alignment?: "left" | "center" | "right" | "between";
  direction?: "row" | "column";
  spacing?: "none" | "tight" | "normal" | "loose";
  wrap?: boolean;
}

export function ButtonGroup({
  className,
  children,
  alignment = "right",
  direction = "row",
  spacing = "normal",
  wrap = true,
  ...props
}: ButtonGroupProps) {
  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
  };

  const spacingClasses = {
    none: "gap-0",
    tight: "gap-1",
    normal: "gap-2",
    loose: "gap-4",
  };

  const directionClasses = {
    row: "flex-row",
    column: "flex-col",
  };

  return (
    <div
      className={cn(
        "flex",
        directionClasses[direction],
        alignmentClasses[alignment],
        spacingClasses[spacing],
        wrap ? "flex-wrap" : "flex-nowrap",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
