
import { flexRender } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface TableWrapperProps {
  table: any;
  columns: any[];
  isLoading: boolean;
}

export function TableWrapper({ table, columns, isLoading }: TableWrapperProps) {
  const { t, i18n } = useTranslation();
  
  return (
    <div className="responsive-table-container animate-fade-in">
      <Table className="responsive-table">
        <TableHeader className="responsive-table-header">
          {table.getHeaderGroups().map((headerGroup: any) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header: any) => {
                return (
                  <TableHead key={header.id} className="bg-muted/50 h-11">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-60 text-center">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="dynamic-text text-muted-foreground">
                    {t("loading")}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row: any) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="animate-slide-in hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell: any) => {
                  return (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                <span className="dynamic-text text-muted-foreground">
                  {t("noResults")}
                </span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
