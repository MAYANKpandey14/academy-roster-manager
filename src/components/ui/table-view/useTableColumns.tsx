
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { TableAction } from "./types";
import { TableRowActions } from "./TableRowActions";

export function useTableColumns<T extends Record<string, any>>(
  baseColumns: ColumnDef<T, any>[],
  actions: TableAction<T>[],
  isLoading: boolean = false
): ColumnDef<T, any>[] {
  // Create selection column
  const selectionColumn: ColumnDef<T, any> = {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() 
            ? true 
            : table.getIsSomePageRowsSelected() 
              ? "indeterminate" 
              : false
        }
        onCheckedChange={(value: CheckedState) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        disabled={isLoading}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: CheckedState) => row.toggleSelected(!!value)}
        aria-label="Select row"
        disabled={isLoading}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };

  // Create actions column
  const actionsColumn: ColumnDef<T, any> = {
    id: "actions",
    header: "",
    cell: ({ row }) => <TableRowActions row={row} actions={actions} />,
    enableSorting: false,
    enableHiding: false,
  };

  // Combine all columns
  return [
    selectionColumn,
    ...baseColumns,
    actionsColumn,
  ];
}
