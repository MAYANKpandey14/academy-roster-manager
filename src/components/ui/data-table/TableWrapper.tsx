
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface TableWrapperProps {
  table: any;
  columns: any[];
  isLoading: boolean;
}

export function TableWrapper({ table, columns, isLoading }: TableWrapperProps) {
  const { t } = useTranslation();
  
  return (
    <div className="overflow-hidden rounded-md border border-input bg-white">
      <div className="relative overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead 
                      key={header.id} 
                      className="h-11 whitespace-nowrap font-medium text-muted-foreground"
                    >
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
                  <LoadingSpinner 
                    size="lg" 
                    color="primary" 
                    text={t("loading", "Loading data...")} 
                  />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="animate-fade-in hover:bg-muted/50 transition-colors"
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
                  <span className="text-muted-foreground">
                    {t("noResults", "No results found.")}
                  </span>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
