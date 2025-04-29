
import { useState } from "react";
import { Search, List, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface TraineeFiltersProps {
  onSearch: (pno: string, chestNo: string, rollNo: string) => Promise<boolean>;
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
  const [rollNo, setRollNo] = useState("");

  const handleSearch = async () => {
    if (!pno && !chestNo && !rollNo) {
      toast.error("कृपया कम से कम एक खोज मानदंड दर्ज करें");
      return;
    }
    
    const found = await onSearch(pno, chestNo, rollNo);
    if (!found) {
      toast.error("आपके खोज मानदंडों से मेल खाने वाला कोई प्रशिक्षु नहीं मिला");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-medium mb-4 krutidev-heading">
        प्रशिक्षुओं की खोज
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pno" className="krutidev-text">पीएनओ नंबर</Label>
          <Input
            id="pno"
            placeholder="पीएनओ दर्ज करें"
            value={pno}
            onChange={(e) => setPno(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={9}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chestNo" className="krutidev-text">चेस्ट नंबर</Label>
          <Input
            id="chestNo"
            placeholder="चेस्ट नंबर दर्ज करें"
            value={chestNo}
            onChange={(e) => setChestNo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rollNo" className="krutidev-text">
            रोल नंबर / विशिष्ट आईडी
          </Label>
          <Input
            id="rollNo"
            placeholder="रोल नंबर दर्ज करें"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={12}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => navigate('/add-trainee')} variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="krutidev-text">नया प्रशिक्षु जोड़ें</span>
        </Button>
        <Button onClick={onShowAll} variant="outline" disabled={disabled}>
          <List className="mr-2 h-4 w-4" />
          <span className="krutidev-text">सभी प्रशिक्षु दिखाएं</span>
        </Button>
        <Button onClick={handleSearch} disabled={disabled}>
          <Search className="mr-2 h-4 w-4" />
          <span className="krutidev-text">प्रशिक्षु खोजें</span>
        </Button>
      </div>
    </div>
  );
}
