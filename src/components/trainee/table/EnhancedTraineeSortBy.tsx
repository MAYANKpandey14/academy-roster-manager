
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, X } from "lucide-react";
import { traineeRanks } from "@/components/trainee/TraineeFormSchema";

interface EnhancedTraineeSortByProps {
  onSortChange: (sortBy: string) => void;
  currentSort: string;
}

export function EnhancedTraineeSortBy({ onSortChange, currentSort }: EnhancedTraineeSortByProps) {
  const { isHindi } = useLanguage();
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRank, setCustomRank] = useState("");

  // Filter out "Other" rank and exclude it from sort options
  const availableRanks = traineeRanks.filter(rank => rank !== "Other");

  const sortOptions = [
    { value: "none", label: isHindi ? "कोई क्रम नहीं" : "None" },
    { value: "chest_no", label: isHindi ? "चेस्ट नंबर" : "Chest No" },
    { value: "toli_no", label: isHindi ? "टोली नंबर" : "Toli No" },
    ...availableRanks.map(rank => ({
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
      <span className="text-sm text-gray-600">
        {isHindi ? "इसके अनुसार क्रमबद्ध करें:" : "Sort by:"}
      </span>
      
      <div className="flex items-center gap-2">
        <Select value={showCustomInput ? "custom_rank" : currentSort} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder={isHindi ? "क्रमबद्ध करें" : "Sort by"} />
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
