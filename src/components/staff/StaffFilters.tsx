
import { useState } from "react";
import { Search, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface StaffFiltersProps {
  onSearch: (pno: string) => Promise<boolean>;
  onShowAll: () => void;
  disabled?: boolean;
}

export function StaffFilters({
  onSearch,
  onShowAll,
  disabled = false,
}: StaffFiltersProps) {
  const [pno, setPno] = useState("");

  const handleSearch = async () => {
    if (!pno) {
      toast.error("Please enter a PNO number");
      return;
    }
    
    const found = await onSearch(pno);
    if (!found) {
      toast.error("No staff member found with this PNO");
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
      <h3 className="text-lg font-medium mb-4">Search Staff</h3>
      
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
      </div>
      
      <div className="flex justify-end gap-2">
        <Button onClick={onShowAll} variant="outline" disabled={disabled}>
          <List className="mr-2 h-4 w-4" />
          Show All Staff
        </Button>
        <Button onClick={handleSearch} disabled={disabled}>
          <Search className="mr-2 h-4 w-4" />
          Search Staff
        </Button>
      </div>
    </div>
  );
}
