
import { ColumnDef, Row } from "@tanstack/react-table";

export type ActionType = "view" | "edit" | "print" | "download" | "delete";

export interface TableAction<T> {
  type: ActionType;
  label: string;
  icon: React.ReactNode;
  onClick: (row: T) => void;
}

export interface TableViewProps<T extends Record<string, any>> {
  data: T[];
  columns: ColumnDef<T, any>[];
  filterColumn?: string;
  filterPlaceholder?: string;
  isLoading?: boolean;
  totalLabelKey?: string;
  actions?: TableAction<T>[];
  onRefresh?: () => void;
  onRowSelectionChange?: (selected: Record<string, boolean>) => void;
  rowSelection?: Record<string, boolean>;
  getRowId?: (row: T, index: number) => string;
}

export interface TableActionsBarProps<T extends Record<string, any>> {
  selectedCount: number;
  isLoading: boolean;
  onRefresh?: () => void;
  bulkActions?: {
    print?: () => void;
    download?: () => void;
  };
}

export interface TableRowActionsProps<T extends Record<string, any>> {
  row: Row<T>;
  actions: TableAction<T>[];
}
