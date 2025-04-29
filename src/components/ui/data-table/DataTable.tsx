
import { useState } from "react";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import { TableWrapper } from "./TableWrapper";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { useDataTable } from "./useDataTable";

interface DataTableProps<TData, TValue> {
  columns: any[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  isLoading?: boolean;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (value: Record<string, boolean>) => void;
  totalLabel?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn = "name",
  filterPlaceholder = "Search...",
  isLoading = false,
  rowSelection = {},
  onRowSelectionChange = () => {},
  totalLabel = "totalTrainees",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { t, i18n } = useTranslation();

  const table = useDataTable({
    data,
    columns,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    onRowSelectionChange,
  });

  return (
    <div>
      <TableFilters
        table={table}
        filterColumn={filterColumn}
        filterPlaceholder={filterPlaceholder}
        isLoading={isLoading}
      />
      
      <TableWrapper 
        table={table}
        columns={columns}
        isLoading={isLoading}
      />
      
      <TablePagination 
        table={table}
        totalLabel={totalLabel}
        isLoading={isLoading}
      />
    </div>
  );
}
