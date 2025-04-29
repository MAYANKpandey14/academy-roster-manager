
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TableFiltersProps {
  table: any;
  filterColumn: string;
  filterPlaceholder: string;
  isLoading: boolean;
}

export function TableFilters({ 
  table, 
  filterColumn, 
  filterPlaceholder,
  isLoading 
}: TableFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 space-y-3 md:space-y-0 animate-fade-in">
      <div className="relative w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          placeholder={filterPlaceholder}
          className="pl-9 max-w-full bg-white font-mangal"
          disabled={isLoading}
        />
      </div>
      <div className="text-sm text-muted-foreground font-mangal">
        <p>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <span className="font-medium text-primary mr-1">
              {table.getFilteredSelectedRowModel().rows.length} चयनित
            </span>
          )}
          कुल {table.getFilteredRowModel().rows.length} में से
        </p>
      </div>
    </div>
  );
}
