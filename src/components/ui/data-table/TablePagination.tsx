
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface TablePaginationProps {
  table: any;
  totalLabel: string;
  isLoading: boolean;
}

export function TablePagination({ 
  table, 
  totalLabel,
  isLoading 
}: TablePaginationProps) {
  const { t, i18n } = useTranslation();
  
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className={`flex-1 text-sm text-muted-foreground dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
        {table.getFilteredRowModel().rows.length} {t(totalLabel)}.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className={`text-sm font-medium dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("rowsPerPage")}
          </p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            {"<<"}
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
          >
            {"<"}
          </Button>
          <div className="flex items-center gap-1">
            <p className={`text-sm font-medium dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
              {t("page")}
            </p>
            <strong className={`text-sm font-medium dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
              {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
              {table.getPageCount()}
            </strong>
          </div>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
          >
            {">"}
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage() || isLoading}
          >
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}
