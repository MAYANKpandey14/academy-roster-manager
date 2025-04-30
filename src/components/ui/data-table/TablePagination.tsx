import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { isHindi } = useLanguage();
  
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className={`flex-1 text-sm text-muted-foreground ${isHindi ? 'font-mangal' : ''}`}>
        {table.getFilteredRowModel().rows.length} {isHindi ? "कुल" : totalLabel}.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className={`text-sm font-medium ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "प्रति पृष्ठ पंक्तियाँ" : "Rows per page"}
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
            <p className={`text-sm font-medium ${isHindi ? 'font-mangal' : ''}`}>
              {isHindi ? "पृष्ठ" : "Page"}
            </p>
            <strong className={`text-sm font-medium ${isHindi ? 'font-mangal' : ''}`}>
              {table.getState().pagination.pageIndex + 1} {isHindi ? "में से" : "of"}{" "}
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
