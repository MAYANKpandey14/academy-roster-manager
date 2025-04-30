import { useState } from "react";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { TableWrapper } from "./TableWrapper";
import { TableFilters } from "./TableFilters";
import { TablePagination } from "./TablePagination";
import { useDataTable } from "./useDataTable";
import { useLanguage } from "@/contexts/LanguageContext";

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
  totalLabel = "total",
}: DataTableProps<TData, TValue>) {
  const { isHindi } = useLanguage();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
        filterPlaceholder={isHindi ? "खोजें..." : filterPlaceholder}
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
