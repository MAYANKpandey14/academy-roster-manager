
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  useReactTable
} from "@tanstack/react-table";

interface UseDataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  sorting: SortingState;
  setSorting: (value: SortingState) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (value: ColumnFiltersState) => void;
  rowSelection: Record<string, boolean>;
  onRowSelectionChange: (value: Record<string, boolean>) => void;
  getRowId?: (row: TData) => string;
}

export function useDataTable<TData, TValue>({
  data,
  columns,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  rowSelection,
  onRowSelectionChange,
  getRowId,
}: UseDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: onRowSelectionChange,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    ...(getRowId ? { getRowId } : {})
  });

  return table;
}
