
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

interface TableFiltersProps {
  table: any;
  filterColumn: string;
  filterPlaceholder: string;
  isLoading: boolean;
  rankFilterEnabled?: boolean;
  rankFilterPlaceholder?: string;
}

export function TableFilters({ 
  table, 
  filterColumn, 
  isLoading,
  rankFilterEnabled = false,
  rankFilterPlaceholder = "Filter by rank..."
}: TableFiltersProps) {
  const { isHindi } = useLanguage();
  
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          disabled={isLoading}
          lang={isHindi ? 'hi' : 'en'}
        />
        
        {rankFilterEnabled && (
          <Input
            placeholder={isHindi ? "रैंक से फिल्टर करें..." : rankFilterPlaceholder}
            value={(table.getColumn("rank")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("rank")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
            disabled={isLoading}
            lang={isHindi ? 'hi' : 'en'}
          />
        )}
      </div>
      <div className="flex items-center space-x-2">
        <p className={`text-sm text-gray-500 ${isHindi ? 'font-mangal' : ''}`}>
          {table.getFilteredSelectedRowModel().rows.length} {isHindi ? "में से" : "of"}{" "}
          {table.getFilteredRowModel().rows.length} {isHindi ? "पंक्तियाँ चुनी गईं" : "rows selected"}
        </p>
      </div>
    </div>
  );
}
