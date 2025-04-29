
import { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TableRowActions } from "./TableRowActions";
import { TableAction } from "./types";

/**
 * Utility hook for creating selection and action columns for table views
 */
export function useTableColumns<T extends Record<string, any>>() {
  /**
   * Creates a selection column with checkbox for row selection
   */
  const createSelectionColumn = (): ColumnDef<T, any> => ({
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
  });

  /**
   * Creates an actions column with customizable row actions
   */
  const createActionsColumn = (
    actions: TableAction<T>[]
  ): ColumnDef<T, any> => ({
    id: "actions",
    cell: ({ row }: { row: Row<T> }) => <TableRowActions row={row} actions={actions} />,
    enableSorting: false,
    enableHiding: false,
  });

  return {
    createSelectionColumn,
    createActionsColumn,
  };
}
