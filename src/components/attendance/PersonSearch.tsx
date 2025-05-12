
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { PersonType, getPersonTableName } from "@/types/attendance";

// Export PersonData interface so it can be used by other components
export interface PersonData {
  id: string;
  pno: string;
  name: string;
  mobile_number: string;
  chest_no?: string;
  rank?: string;
}

interface PersonSearchProps {
  onPersonFound: (person: PersonData, type: PersonType) => void;
}

export function PersonSearch({ onPersonFound }: PersonSearchProps) {
  const { isHindi } = useLanguage();
  const [pno, setPno] = useState("");
  const [personType, setPersonType] = useState<PersonType>('trainee');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pno) {
      toast.error(isHindi
        ? "कृपया पी.एन.ओ./ यूनिक आईडी दर्ज करें"
        : "Please enter the PNO/ Unique ID");
      return;
    }

    setIsSearching(true);

    try {
      const tableName = getPersonTableName(personType);

      // Define specific columns to select based on person type
      let columns = 'id, pno, name, mobile_number';
      if (personType === 'trainee') {
        columns += ', chest_no';
      } else {
        columns += ', rank';
      }

      // Fix with type assertion to handle the dynamic query
      const { data, error } = await supabase
        .from(tableName)
        .select(columns)
        .eq('pno', pno as any)
        .single();

      if (error) {
        throw error;
      }

      // Validate that data is not null before proceeding
      if (!data) {
        toast.error(isHindi
          ? "कोई व्यक्ति नहीं मिला"
          : "No person found");
        return;
      }

      // Use type assertion to handle the dynamic data shape
      const personData: PersonData = {
        id: (data as any).id,
        pno: (data as any).pno,
        name: (data as any).name,
        mobile_number: (data as any).mobile_number
      };

      // Add type-specific fields with proper type checking
      if (personType === 'trainee' && (data as any).chest_no) {
        personData.chest_no = (data as any).chest_no;
      } else if (personType === 'staff' && (data as any).rank) {
        personData.rank = (data as any).rank;
      }

      onPersonFound(personData, personType);

    } catch (error) {
      console.error("Error searching person:", error);
      toast.error(isHindi
        ? "व्यक्ति खोजने में त्रुटि"
        : "Error searching for person");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="personType" className={isHindi ? "font-hindi" : ""}>
            {isHindi ? "व्यक्ति का प्रकार" : "Person Type"}
          </Label>
          <Select
            value={personType}
            onValueChange={(value: PersonType) => setPersonType(value)}
          >
            <SelectTrigger id="personType" className="transition-all duration-200">
              <SelectValue placeholder={isHindi ? "प्रकार चुनें" : "Select type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trainee">
                <span className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "प्रशिक्षु" : "Trainee"}
                </span>
              </SelectItem>
              <SelectItem value="staff">
                <span className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "स्टाफ" : "Staff"}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pno" className={isHindi ? "font-hindi" : ""}>
            {isHindi ? "पीएनओ नंबर" : "PNO Number"}
          </Label>
          <div className="flex space-x-2">
            <Input
              id="pno"
              value={pno}
              onChange={(e) => setPno(e.target.value)}
              placeholder={isHindi ? "पीएनओ/ यूनिक आईडी दर्ज करें" : "Enter PNO/ Unique ID"}
              className={isHindi ? "font-hindi" : ""}
              maxLength={12}
            />
            <Button
              type="submit"
              disabled={isSearching}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
              {isSearching ? (
                <span className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "खोज रहा है..." : "Searching..."}
                </span>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  <span className={isHindi ? "font-hindi" : ""}>
                    {isHindi ? "खोजें" : "Search"}
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
