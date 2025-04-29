
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TableRowActionsProps } from "./types";
import { Row } from "@tanstack/react-table";

export function TableRowActions<T extends Record<string, any>>({ 
  row, 
  actions 
}: TableRowActionsProps<T>) {
  if (!actions || actions.length === 0) return null;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open menu">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => (
          <DropdownMenuItem 
            key={action.type} 
            onClick={() => action.onClick(row.original)}
          >
            <span className="mr-2 h-4 w-4">{action.icon}</span>
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
