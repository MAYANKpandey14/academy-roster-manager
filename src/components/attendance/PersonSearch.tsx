
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { PersonData } from "@/types/attendance";
import { toast } from "sonner";
import { StaffRank } from "@/types/staff";

// Exporting the PersonData interface for other components
export { PersonData };

interface PersonSearchProps {
  onPersonFound: (person: PersonData, type: 'trainee' | 'staff') => void;
}

export const PersonSearch = ({ onPersonFound }: PersonSearchProps) => {
  const { isHindi } = useLanguage();
  const [searchType, setSearchType] = useState<'pno' | 'name'>('pno');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error(isHindi ? "खोज शब्द दर्ज करें" : "Enter search term");
      return;
    }
    
    setIsLoading(true);
    try {
      let traineeFound = false;
      
      // Search for trainee first
      const traineeQuery = supabase.from('trainees').select('*');
      
      if (searchType === 'pno') {
        traineeQuery.eq('pno', searchTerm as any);
      } else {
        traineeQuery.ilike('name', `%${searchTerm}%`);
      }
      
      const { data: traineeData, error: traineeError } = await traineeQuery;
      
      if (traineeError) {
        console.error("Trainee search error:", traineeError);
        throw traineeError;
      }
      
      if (traineeData && traineeData.length > 0) {
        traineeFound = true;
        const trainee = traineeData[0];
        
        // Type-safe access with custom mapping to PersonData
        const personData: PersonData = {
          id: trainee.id as string,
          pno: trainee.pno as string,
          name: trainee.name as string,
          mobile_number: trainee.mobile_number as string,
          chest_no: trainee.chest_no as string,
          rank: trainee.rank as string
        };
        
        onPersonFound(personData, 'trainee');
        return;
      }
      
      // If no trainee found, search for staff
      const staffQuery = supabase.from('staff').select('*');
      
      if (searchType === 'pno') {
        staffQuery.eq('pno', searchTerm as any);
      } else {
        staffQuery.ilike('name', `%${searchTerm}%`);
      }
      
      const { data: staffData, error: staffError } = await staffQuery;
      
      if (staffError) {
        console.error("Staff search error:", staffError);
        throw staffError;
      }
      
      if (staffData && staffData.length > 0) {
        const staff = staffData[0];
        
        // Type-safe access with custom mapping to PersonData
        const personData: PersonData = {
          id: staff.id as string,
          pno: staff.pno as string,
          name: staff.name as string,
          mobile_number: staff.mobile_number as string,
          rank: staff.rank as StaffRank
        };
        
        onPersonFound(personData, 'staff');
        return;
      }
      
      // If no results found
      toast.error(isHindi 
        ? "कोई परिणाम नहीं मिला" 
        : "No results found");
      
    } catch (error) {
      console.error("Search error:", error);
      toast.error(isHindi 
        ? "खोज में त्रुटि" 
        : "Error in search");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className={`text-xl font-semibold ${isHindi ? "font-mangal" : ""}`}>
        {isHindi ? "व्यक्ति खोजें" : "Search Person"}
      </h2>
      <div className="flex flex-wrap gap-2">
        <div className="flex-1 min-w-[250px]">
          <div className="flex gap-2 mb-2">
            <Button
              type="button"
              variant={searchType === 'pno' ? 'default' : 'outline'}
              onClick={() => setSearchType('pno')}
              size="sm"
              className={`${isHindi ? "font-hindi" : ""}`}
            >
              {isHindi ? "पीएनओ द्वारा" : "By PNO"}
            </Button>
            <Button
              type="button"
              variant={searchType === 'name' ? 'default' : 'outline'}
              onClick={() => setSearchType('name')}
              size="sm"
              className={`${isHindi ? "font-hindi" : ""}`}
            >
              {isHindi ? "नाम द्वारा" : "By Name"}
            </Button>
          </div>
          <Input
            type="text"
            placeholder={
              searchType === 'pno'
                ? isHindi ? "पीएनओ दर्ज करें" : "Enter PNO"
                : isHindi ? "नाम दर्ज करें" : "Enter Name"
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={handleKeyPress}
            className={isHindi ? "font-hindi" : ""}
          />
        </div>
        <Button 
          onClick={handleSearch}
          disabled={isLoading}
          className={isHindi ? "font-hindi self-end" : "self-end"}
        >
          {isLoading
            ? (isHindi ? "खोज रहा है..." : "Searching...")
            : (isHindi ? "खोजें" : "Search")}
        </Button>
      </div>
    </div>
  );
};
