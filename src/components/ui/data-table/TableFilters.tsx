
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

interface TableFiltersProps {
  table: any;
  filterColumn: string;
  filterPlaceholder: string;
  isLoading: boolean;
}

export function TableFilters({ 
  table, 
  filterColumn, 
  isLoading 
}: TableFiltersProps) {
  const { t, i18n } = useTranslation();
  
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-2">
        <Input
          value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
          disabled={isLoading}
          lang={i18n.language}
        />
      </div>
      <div className="flex items-center space-x-2">
        <p className={`text-sm text-gray-500 dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
          {table.getFilteredRowModel().rows.length} {t("rowsSelected")}
        </p>
      </div>
    </div>
  );
}
