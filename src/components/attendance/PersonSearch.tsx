import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PersonType } from "@/types/attendance";

// Export the PersonData interface so other components can use it
export interface PersonData {
  id: string;
  pno: string;
  name: string;
  mobile_number: string;
  chest_no?: string;
  rank?: string;
  current_posting_district?: string;
}

export const PersonSearch = ({ onPersonFound }: { onPersonFound: (person: PersonData, type: PersonType) => void }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);
  const { isHindi } = useLanguage();
  
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setNotFound(false); // Reset notFound state when input changes
  };
  
  const handleSearch = async () => {
    if (!searchTerm) {
      toast.error(isHindi ? 'कृपया खोज टर्म दर्ज करें' : 'Please enter a search term');
      return;
    }
    
    try {
      setIsSearching(true);
      setNotFound(false);

      // Try to find in trainees table first
      const { data: traineeData, error: traineeError } = await supabase
        .from('trainees')
        .select('*')
        .eq('pno', searchTerm as any)
        .maybeSingle();

      if (traineeError) {
        console.error('Error searching trainees:', traineeError);
        toast.error(isHindi ? 'खोज में त्रुटि' : 'Error in search');
        return;
      }

      if (traineeData) {
        // Trainee found
        const traineePersonData: PersonData = {
          id: traineeData.id,
          pno: traineeData.pno,
          name: traineeData.name,
          mobile_number: traineeData.mobile_number,
          chest_no: traineeData.chest_no,
          rank: traineeData.rank,
          current_posting_district: traineeData.current_posting_district
        };
        
        onPersonFound(traineePersonData, 'trainee');
        return;
      }

      // If not found in trainees, try staff
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .eq('pno', searchTerm as any)
        .maybeSingle();

      if (staffError) {
        console.error('Error searching staff:', staffError);
        toast.error(isHindi ? 'खोज में त्रुटि' : 'Error in search');
        return;
      }

      if (staffData) {
        // Staff found
        const staffPersonData: PersonData = {
          id: staffData.id,
          pno: staffData.pno,
          name: staffData.name,
          mobile_number: staffData.mobile_number,
          rank: staffData.rank,
          current_posting_district: staffData.current_posting_district
        };
        
        onPersonFound(staffPersonData, 'staff');
        return;
      }

      // Person not found in either table
      setNotFound(true);
    } catch (error) {
      console.error('Search error:', error);
      toast.error(isHindi ? 'खोज में त्रुटि' : 'Error in search');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder={isHindi ? "पी.एन.ओ. खोजें..." : "Search P.N.O..."}
        value={searchTerm}
        onChange={handleSearchTermChange}
        className="flex-grow"
      />
      <Button onClick={handleSearch} disabled={isSearching}>
        {isSearching ? (
          isHindi ? "खोज रहे हैं..." : "Searching..."
        ) : (
          <>
            <Search className="w-4 h-4 mr-2" />
            {isHindi ? "खोजें" : "Search"}
          </>
        )}
      </Button>
      {notFound && (
        <p className="text-red-500">
          {isHindi ? "कोई परिणाम नहीं मिला" : "No results found"}
        </p>
      )}
    </div>
  );
};
