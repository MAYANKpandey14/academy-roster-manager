
import { X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemoveFilter: (filterKey: string) => void;
  onResetAll: () => void;
}

export function ActiveFilters({ filters, onRemoveFilter, onResetAll }: ActiveFiltersProps) {
  const { isHindi } = useLanguage();

  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 border rounded-lg">
      <span className={`text-sm font-medium text-gray-700 ${isHindi ? 'font-hindi' : ''}`}>
        {isHindi ? "सक्रिय फिल्टर:" : "Active Filters:"}
      </span>
      
      {filters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="group relative px-3 py-1 pr-8 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <span className={`text-xs ${isHindi ? 'font-hindi' : ''}`}>
            {filter.label}: {filter.value}
          </span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={isHindi ? "फिल्टर हटाएं" : "Remove filter"}
          >
            <X className="h-3 w-3 text-gray-500 hover:text-gray-700" />
          </button>
        </Badge>
      ))}
      
      <Button
        variant="outline"
        size="sm"
        onClick={onResetAll}
        className="ml-2 h-8 px-3 text-xs"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        <span className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? "सभी रीसेट करें" : "Reset All"}
        </span>
      </Button>
    </div>
  );
}
