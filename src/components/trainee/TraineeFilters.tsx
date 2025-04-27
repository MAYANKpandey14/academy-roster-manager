
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface TraineeFiltersProps {
  onSearch: (pno: string, chestNo: string, rollNo: string) => void;
  disabled?: boolean;
}

export function TraineeFilters({
  onSearch,
  disabled = false,
}: TraineeFiltersProps) {
  const [pno, setPno] = useState("");
  const [chestNo, setChestNo] = useState("");
  const [rollNo, setRollNo] = useState("");
  const navigate = useNavigate();

  const handlePnoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPno(value);
  };

  const handleChestNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChestNo(value);
  };

  const handleRollNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRollNo(value);
  };

  const handleSearch = () => {
    onSearch(pno, chestNo, rollNo);
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
            onChange={handlePnoChange}
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
            onChange={handleChestNoChange}
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
            onChange={handleRollNoChange}
            disabled={disabled}
            maxLength={12}
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={handleSearch} disabled={disabled}>
          <Search className="mr-2 h-4 w-4" />
          Search Trainee
        </Button>
      </div>
    </div>
  );
}
