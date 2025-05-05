
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

export interface PersonData {
  id: string;
  pno: string;
  name: string;
  rank?: string;
  chest_no?: string;
  mobile_number: string;
}

interface PersonSearchProps {
  onPersonFound: (person: PersonData, type: 'trainee' | 'staff') => void;
}

type SearchType = 'pno' | 'alt_id';
type PersonType = 'trainee' | 'staff';

export function PersonSearch({ onPersonFound }: PersonSearchProps) {
  const { isHindi } = useLanguage();
  const [pno, setPno] = useState("");
  const [altId, setAltId] = useState("");
  const [personType, setPersonType] = useState<PersonType>('trainee');
  const [searchBy, setSearchBy] = useState<SearchType>('pno');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input based on search type
    if (searchBy === 'pno' && !pno) {
      toast.error(isHindi
        ? "कृपया पी.एन.ओ. दर्ज करें"
        : "Please enter the PNO");
      return;
    }

    if (searchBy === 'alt_id' && !altId) {
      toast.error(isHindi
        ? personType === 'trainee' 
          ? "कृपया रोल नंबर दर्ज करें" 
          : "कृपया यूनिक आईडी दर्ज करें"
        : personType === 'trainee'
          ? "Please enter Roll Number"
          : "Please enter Unique ID");
      return;
    }

    setIsSearching(true);

    try {
      const tableName = personType === 'trainee' ? 'trainees' : 'staff';

      // Define specific columns to select based on person type
      let columns = 'id, pno, name, mobile_number';
      if (personType === 'trainee') {
        columns += ', chest_no';
      } else {
        columns += ', rank';
      }

      // Build query based on search type and person type
      let query = supabase.from(tableName).select(columns);
      
      if (searchBy === 'pno') {
        query = query.eq('pno', pno);
      } else if (searchBy === 'alt_id') {
        // For trainee, search by chest_no; for staff, search by adhaar_number
        const fieldName = personType === 'trainee' ? 'chest_no' : 'adhaar_number';
        query = query.eq(fieldName, altId);
      }

      const { data, error } = await query.single();

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

      // Create a person data object with the correct shape
      const personData: PersonData = {
        id: data.id,
        pno: data.pno,
        name: data.name,
        mobile_number: data.mobile_number
      };

      // Add type-specific fields
      if (personType === 'trainee' && data.chest_no) {
        personData.chest_no = data.chest_no;
      } else if (personType === 'staff' && data.rank) {
        personData.rank = data.rank;
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

  // Dynamic label and placeholder based on person type and search type
  const getAltIdLabel = () => {
    return personType === 'trainee' 
      ? (isHindi ? "रोल नंबर / चेस्ट नंबर" : "Roll Number / Chest Number")
      : (isHindi ? "यूनिक आईडी / आधार नंबर" : "Unique ID / Adhaar Number");
  };

  const getAltIdPlaceholder = () => {
    return personType === 'trainee'
      ? (isHindi ? "रोल नंबर / चेस्ट नंबर दर्ज करें" : "Enter Roll Number / Chest Number")
      : (isHindi ? "यूनिक आईडी / आधार नंबर दर्ज करें (12 अंक)" : "Enter Unique ID / Adhaar Number (12-digit)");
  };

  const getAltIdMaxLength = () => {
    return personType === 'trainee' ? undefined : 12;
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="personType" className={isHindi ? "font-hindi" : ""}>
            {isHindi ? "व्यक्ति का प्रकार" : "Person Type"}
          </Label>
          <Select
            value={personType}
            onValueChange={(value: PersonType) => {
              setPersonType(value);
              // Reset IDs when changing person type
              setPno("");
              setAltId("");
            }}
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
          <Label htmlFor="searchBy" className={isHindi ? "font-hindi" : ""}>
            {isHindi ? "इसके द्वारा खोजें" : "Search By"}
          </Label>
          <Select
            value={searchBy}
            onValueChange={(value: SearchType) => {
              setSearchBy(value);
              // Reset values when changing search method
              setPno("");
              setAltId("");
            }}
          >
            <SelectTrigger id="searchBy" className="transition-all duration-200">
              <SelectValue placeholder={isHindi ? "खोज विधि चुनें" : "Select search method"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pno">
                <span className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "पीएनओ नंबर" : "PNO Number"}
                </span>
              </SelectItem>
              <SelectItem value="alt_id">
                <span className={isHindi ? "font-hindi" : ""}>
                  {personType === 'trainee' 
                    ? (isHindi ? "रोल नंबर / चेस्ट नंबर" : "Roll Number / Chest Number")
                    : (isHindi ? "यूनिक आईडी / आधार नंबर" : "Unique ID / Adhaar Number")}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {searchBy === 'pno' ? (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="pno" className={isHindi ? "font-hindi" : ""}>
              {isHindi ? "पीएनओ नंबर" : "PNO Number"}
            </Label>
            <div className="flex space-x-2">
              <Input
                id="pno"
                value={pno}
                onChange={(e) => setPno(e.target.value)}
                placeholder={isHindi ? "पीएनओ दर्ज करें (9 अंक)" : "Enter PNO (9-digit)"}
                className={isHindi ? "font-hindi" : ""}
                maxLength={9}
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
        ) : (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="altId" className={isHindi ? "font-hindi" : ""}>
              {getAltIdLabel()}
            </Label>
            <div className="flex space-x-2">
              <Input
                id="altId"
                value={altId}
                onChange={(e) => setAltId(e.target.value)}
                placeholder={getAltIdPlaceholder()}
                className={isHindi ? "font-hindi" : ""}
                maxLength={getAltIdMaxLength()}
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
        )}
      </div>
    </form>
  );
}
