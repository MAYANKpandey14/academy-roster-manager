import { useState, useEffect } from "react";
import { ColumnDef, ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { TableWrapper } from "@/components/ui/data-table/TableWrapper";
import { TableFilters } from "@/components/ui/data-table/TableFilters";
import { TablePagination } from "@/components/ui/data-table/TablePagination";
import { useDataTable } from "@/components/ui/data-table/useDataTable";
import { TableViewProps } from "./types";
import { TableActionsBar } from "./TableActionsBar";

export function TableView<T extends Record<string, any>>({
  data,
  columns,
  filterColumn = "name",
  filterPlaceholder,
  isLoading = false,
  totalLabelKey = "totalItems",
  actions,
  onRefresh,
  onRowSelectionChange,
  rowSelection: externalRowSelection,
  getRowId
}: TableViewProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedCount, setSelectedCount] = useState(0);

  // Sync with external row selection if provided
  useEffect(() => {
    if (externalRowSelection) {
      setRowSelection(externalRowSelection);
    }
  }, [externalRowSelection]);

  // Handle internal row selection changes
  const handleRowSelectionChange = (newSelection: Record<string, boolean>) => {
    setRowSelection(newSelection);
    
    // Update selected count
    setSelectedCount(Object.keys(newSelection).length);
    
    // Propagate selection change to parent if callback provided
    if (onRowSelectionChange) {
      onRowSelectionChange(newSelection);
    }
  };

  // Create table instance
  const table = useDataTable({
    data,
    columns,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    rowSelection,
    onRowSelectionChange: handleRowSelectionChange,
    getRowId
  });

  // Get selected rows
  function getSelectedRows(): T[] {
    const selectedIndices = Object.keys(rowSelection);
    return selectedIndices.map(id => {
      // If we have a getRowId function, we need to find the row by the custom id
      if (getRowId) {
        return data.find((row, index) => getRowId(row, index) === id) as T;
      }
      // Otherwise, assume id is the index
      return data[parseInt(id)];
    }).filter(Boolean); // Filter out any undefined values
  }

  return (
    <div className="space-y-4">
      {/* Action bar with bulk actions */}
      <TableActionsBar
        selectedCount={selectedCount}
        isLoading={isLoading}
        onRefresh={onRefresh}
        bulkActions={{
          print: actions?.find(a => a.type === 'print')?.onClick && (() => {
            const selectedItems = getSelectedRows();
            if (selectedItems.length > 0) {
              const printAction = actions.find(a => a.type === 'print');
              if (printAction) {
                selectedItems.forEach(item => printAction.onClick(item));
              }
            }
          }),
          download: actions?.find(a => a.type === 'download')?.onClick && (() => {
            const selectedItems = getSelectedRows();
            if (selectedItems.length > 0) {
              const downloadAction = actions.find(a => a.type === 'download');
              if (downloadAction) {
                selectedItems.forEach(item => downloadAction.onClick(item));
              }
            }
          })
        }}
      />

      {/* Search filters */}
      <TableFilters
        table={table}
        filterColumn={filterColumn}
        filterPlaceholder={filterPlaceholder || `${filterColumn} से खोजें...`}
        isLoading={isLoading}
      />
      
      {/* Main table */}
      <TableWrapper 
        table={table}
        columns={columns}
        isLoading={isLoading}
      />
      
      {/* Pagination */}
      <TablePagination 
        table={table}
        totalLabel={totalLabelKey}
        isLoading={isLoading}
      />
    </div>
  );
}
