
import { useState } from "react";
import { Search, List, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeFiltersProps {
  onSearch: (pno: string, chestNo: string) => Promise<boolean>;
  onShowAll: () => void;
  disabled?: boolean;
}

export function TraineeFilters({
  onSearch,
  onShowAll,
  disabled = false,
}: TraineeFiltersProps) {
  const navigate = useNavigate();
  const [pno, setPno] = useState("");
  const [chestNo, setChestNo] = useState("");
  const { isHindi } = useLanguage();

  const handleSearch = async () => {
    if (!pno && !chestNo) {
      toast.error(isHindi ? "कृपया कम से कम एक खोज मानदंड दर्ज करें" : "Please enter at least one search criteria");
      return;
    }

    const found = await onSearch(pno, chestNo);
    if (!found) {
      toast.error(isHindi ? "आपकी खोज मानदंडों से मेल खाने वाला कोई प्रशिक्षु नहीं मिला" : "No trainee found matching your search criteria");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4 animate-scale-in">
      <h3 className={`text-lg font-medium mb-4 ${isHindi ? 'font-mangal' : ''}`}>
        {isHindi ? "प्रशिक्षु खोजें" : "Search Trainees"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pno" className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "पीएनओ/ यूनिक आईडी" : "PNO/ Unique ID"}
          </Label>
          <Input
            id="pno"
            placeholder={isHindi ? "पीएनओ/ यूनिक आईडी दर्ज करें" : "Enter PNO/ Unique ID"}
            value={pno}
            onChange={(e) => setPno(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={12}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="chestNo" className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "चेस्ट नंबर" : "Chest Number"}
          </Label>
          <Input
            id="chestNo"
            placeholder={isHindi ? "चेस्ट नंबर दर्ज करें (4 अंक)" : "Enter Chest No (4-digit)"}
            value={chestNo}
            onChange={(e) => setChestNo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={4}
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => navigate('/add-trainee')} variant="outline" className="animate-slide-in">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "नया प्रशिक्षु जोड़ें" : "Add New Trainee"}
          </span>
        </Button>
        <Button onClick={onShowAll} variant="outline" disabled={disabled} className="animate-slide-in">
          <List className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "सभी प्रशिक्षु दिखाएं" : "Show All Trainees"}
          </span>
        </Button>
        <Button onClick={handleSearch} disabled={disabled} className="animate-slide-in">
          <Search className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "प्रशिक्षु खोजें" : "Search Trainee"}
          </span>
        </Button>
      </div>
    </div>
  );
}
