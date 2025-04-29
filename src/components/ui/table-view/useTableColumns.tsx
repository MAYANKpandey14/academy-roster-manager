
import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRowActions } from "./TableRowActions";
import { TableAction } from "./types";

/**
 * Utility hook for creating table columns with selection and actions
 */
export function useTableColumns<T extends Record<string, any>>(
  baseColumns: ColumnDef<T, any>[] = [],
  actions: TableAction<T>[] = [],
  isLoading: boolean = false
): ColumnDef<T, any>[] {
  // Create selection column with checkbox
  const selectionColumn: ColumnDef<T, any> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  // Create actions column with row actions
  const actionsColumn: ColumnDef<T, any> = {
    id: "actions",
    cell: ({ row }: { row: Row<T> }) => <TableRowActions row={row} actions={actions} />,
    enableSorting: false,
    enableHiding: false,
  };

  // Return all columns with selection and actions
  let columns = [...baseColumns];
  
  // Only add selection and actions columns if not in loading state
  if (!isLoading) {
    // Add selection column first
    columns.unshift(selectionColumn);
    
    // Add actions column last if we have actions
    if (actions.length > 0) {
      columns.push(actionsColumn);
    }
  }
  
  return columns;
}
