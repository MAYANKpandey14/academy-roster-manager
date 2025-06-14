
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { StaffRank } from "@/types/staff";
import { Plus, X } from "lucide-react";

interface EnhancedStaffSortByProps {
  onSortChange: (sortBy: string) => void;
  currentSort: string;
}

const STAFF_RANKS: StaffRank[] = [
  "R/CONST",
  "CONST", 
  "CONST/PTI",
  "CONST/ITI",
  "HC/CP",
  "HC/AP", 
  "HC-ITI",
  "HC-PTI",
  "SI/AP",
  "SI/CP",
  "RI",
  "RSI",
  "Inspector",
  "FALL",
  "Sweeper",
  "Barber", 
  "Washerman",
  "Peon",
  "Other"
];

export function EnhancedStaffSortBy({ onSortChange, currentSort }: EnhancedStaffSortByProps) {
  const { isHindi } = useLanguage();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRank, setCustomRank] = useState("");

  const sortOptions = [
    ...STAFF_RANKS.map(rank => ({
      value: `rank:${rank}`,
      label: rank
    }))
  ];

  const handleCustomRankSubmit = () => {
    if (customRank.trim()) {
      onSortChange(`rank:${customRank.trim()}`);
      setShowCustomInput(false);
    }
  };

  const handleCustomRankCancel = () => {
    setCustomRank("");
    setShowCustomInput(false);
  };

  const handleSelectChange = (value: string) => {
    if (value === "custom_rank") {
      setShowCustomInput(true);
    } else {
      onSortChange(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${isHindi ? 'font-hindi' : ''}`}>
        {isHindi ? "क्रमबद्ध करें:" : "Sort by:"}
      </span>
      
      <div className="flex items-center gap-2">
        <Select value={showCustomInput ? "custom_rank" : currentSort} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder={isHindi ? "सॉर्ट विकल्प चुनें" : "Select sort option"} />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
            <SelectItem value="custom_rank">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>{isHindi ? "कस्टम रैंक" : "Custom Rank"}</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {showCustomInput && (
          <div className="flex items-center gap-2">
            <Input
              placeholder={isHindi ? "रैंक दर्ज करें..." : "Enter rank..."}
              value={customRank}
              onChange={(e) => setCustomRank(e.target.value)}
              className="w-40"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCustomRankSubmit();
                } else if (e.key === 'Escape') {
                  handleCustomRankCancel();
                }
              }}
            />
            <Button
              size="sm"
              onClick={handleCustomRankSubmit}
              disabled={!customRank.trim()}
            >
              {isHindi ? "लागू करें" : "Apply"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCustomRankCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
