
import { useState } from "react";
import { Search, List, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface StaffFiltersProps {
  onSearch: (pno: string, identifier?: string, identifierType?: string) => Promise<boolean>;
  onShowAll: () => void;
  disabled?: boolean;
}

export function StaffFilters({
  onSearch,
  onShowAll,
  disabled = false,
}: StaffFiltersProps) {
  const navigate = useNavigate();
  const [pno, setPno] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [searchBy, setSearchBy] = useState<"pno" | "unique_id">("pno");
  const { isHindi } = useLanguage();

  const handleSearch = async () => {
    if (searchBy === "pno" && !pno) {
      toast.error(isHindi ? "कृपया खोजने के लिए PNO दर्ज करें" : "Please enter a PNO to search");
      return;
    }
    
    if (searchBy === "unique_id" && !uniqueId) {
      toast.error(isHindi ? "कृपया खोजने के लिए यूनिक आईडी दर्ज करें" : "Please enter a Unique ID to search");
      return;
    }
    
    // Pass the appropriate identifier based on search type
    const identifier = searchBy === "pno" ? pno : uniqueId;
    const found = await onSearch(identifier, searchBy === "unique_id" ? uniqueId : undefined, searchBy);
    
    if (!found) {
      toast.error(isHindi 
        ? "कोई स्टाफ खोजने के लिए मिला नहीं" 
        : "No staff found matching your search criteria");
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
      <h3 className="text-lg font-medium mb-4">
        <span className={`dynamic-text ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "स्टाफ खोजें" : "Search Staff"}
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="searchBy" className="dynamic-text">
            {isHindi ? "इसके द्वारा खोजें" : "Search By"}
          </Label>
          <Select 
            value={searchBy} 
            onValueChange={(value: "pno" | "unique_id") => setSearchBy(value)}
          >
            <SelectTrigger id="searchBy">
              <SelectValue placeholder={isHindi ? "खोज का प्रकार चुनें" : "Select search type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pno">
                <span className="dynamic-text">{isHindi ? "पीएनओ नंबर" : "PNO Number"}</span>
              </SelectItem>
              <SelectItem value="unique_id">
                <span className="dynamic-text">{isHindi ? "यूनिक आईडी / आधार नंबर" : "Unique ID / Adhaar Number"}</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {searchBy === "pno" ? (
          <div className="space-y-2">
            <Label htmlFor="pno" className="dynamic-text">{isHindi ? "पीएनओ नंबर" : "PNO Number"}</Label>
            <Input
              id="pno"
              placeholder={isHindi ? "पीएनओ दर्ज करें (9 अंक)" : "Enter PNO (9-digit)"}
              value={pno}
              onChange={(e) => setPno(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              maxLength={9}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="uniqueId" className="dynamic-text">{isHindi ? "यूनिक आईडी / आधार नंबर" : "Unique ID / Adhaar Number"}</Label>
            <Input
              id="uniqueId"
              placeholder={isHindi ? "यूनिक आईडी / आधार नंबर (12 अंक)" : "Enter Unique ID / Adhaar Number (12-digit)"}
              value={uniqueId}
              onChange={(e) => setUniqueId(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              maxLength={12}
            />
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => navigate('/add-staff')} variant="outline" className="animate-slide-in">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{isHindi ? "स्टाफ जोड़ें" : "Add Staff"}</span>
        </Button>
        <Button onClick={onShowAll} variant="outline" disabled={disabled} className="animate-slide-in">
          <List className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{isHindi ? "सभी स्टाफ दिखाएं" : "Show All Staff"}</span>
        </Button>
        <Button onClick={handleSearch} disabled={disabled} className="animate-slide-in">
          <Search className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{isHindi ? "खोजें" : "Search"}</span>
        </Button>
      </div>
    </div>
  );
}
