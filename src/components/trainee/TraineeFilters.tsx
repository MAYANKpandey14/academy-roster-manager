
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
      toast.error("Please enter at least one search criteria");
      return;
    }
    
    const found = await onSearch(pno, chestNo, rollNo);
    if (!found) {
      toast.error("No trainee found matching your search criteria");
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
      <h3 className="text-lg font-medium mb-4">Search Trainees</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pno">PNO Number</Label>
          <Input
            id="pno"
            placeholder="Enter 9-digit PNO"
            value={pno}
            onChange={(e) => setPno(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={9}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chestNo">Chest Number</Label>
          <Input
            id="chestNo"
            placeholder="Enter 4-digit Chest No"
            value={chestNo}
            onChange={(e) => setChestNo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rollNo">Roll No / Unique Id</Label>
          <Input
            id="rollNo"
            placeholder="Enter 12-digit Roll No"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={12}
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button onClick={() => navigate('/add-trainee')} variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Trainee
        </Button>
        <Button onClick={onShowAll} variant="outline" disabled={disabled}>
          <List className="mr-2 h-4 w-4" />
          Show All Trainees
        </Button>
        <Button onClick={handleSearch} disabled={disabled}>
          <Search className="mr-2 h-4 w-4" />
          Search Trainee
        </Button>
      </div>
    </div>
  );
}
