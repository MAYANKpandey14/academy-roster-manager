
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { staffRanks } from "@/components/staff/StaffFormSchema";

interface StaffSortByProps {
  onSortChange: (sortBy: string) => void;
  currentSort: string;
}

export function StaffSortBy({ onSortChange, currentSort }: StaffSortByProps) {
  const { isHindi } = useLanguage();

  const sortOptions = [
    { value: "name", label: isHindi ? "नाम" : "Name" },
    { value: "pno", label: "PNO" },
    { value: "rank", label: isHindi ? "रैंक" : "Rank" },
    { value: "district", label: isHindi ? "जिला" : "District" },
    { value: "mobile", label: isHindi ? "मोबाइल" : "Mobile" },
    ...staffRanks.map(rank => ({
      value: `rank:${rank}`,
      label: isHindi ? `रैंक: ${rank}` : `Rank: ${rank}`
    }))
  ];

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${isHindi ? 'font-hindi' : ''}`}>
        {isHindi ? "क्रमबद्ध करें:" : "Sort by:"}
      </span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={isHindi ? "सॉर्ट विकल्प चुनें" : "Select sort option"} />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
