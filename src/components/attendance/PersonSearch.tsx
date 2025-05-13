
import { useState, FormEvent } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Define a generic error type
interface GenericError {
  message: string;
}

// Interface for person data
export interface PersonData {
  id: string;
  pno: string;
  name: string;
  mobile_number: string;
  // Trainee-specific fields
  chest_no?: string;
  // Staff-specific fields
  rank?: string;
}

interface PersonSearchProps {
  onPersonFound: (person: PersonData, type: 'trainee' | 'staff') => void;
}

export function PersonSearch({ onPersonFound }: PersonSearchProps) {
  const { isHindi } = useLanguage();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error(isHindi ? "कृपया पीएनओ दर्ज करें" : "Please enter a PNO");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, try to search for a trainee
      const traineeResult = await searchPerson("trainee", searchQuery);
      
      if (traineeResult && 'person' in traineeResult) {
        // Found a trainee
        const traineeData: PersonData = {
          id: traineeResult.person.id,
          pno: traineeResult.person.pno,
          name: traineeResult.person.name,
          mobile_number: traineeResult.person.mobile_number,
          chest_no: traineeResult.person.chest_no
        };
        onPersonFound(traineeData, 'trainee');
        return;
      }
      
      // If no trainee found, try to search for staff
      const staffResult = await searchPerson("staff", searchQuery);
      
      if (staffResult && 'person' in staffResult) {
        // Found staff
        const staffData: PersonData = {
          id: staffResult.person.id,
          pno: staffResult.person.pno,
          name: staffResult.person.name,
          mobile_number: staffResult.person.mobile_number,
          rank: staffResult.person.rank
        };
        onPersonFound(staffData, 'staff');
        return;
      }
      
      // No person found
      toast.error(isHindi 
        ? "कोई व्यक्ति नहीं मिला" 
        : "No person found"
      );
      
    } catch (error) {
      console.error("Error searching person:", error);
      toast.error(isHindi 
        ? "व्यक्ति खोजने में त्रुटि" 
        : "Error searching person"
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generic function to search for a person (trainee or staff)
  const searchPerson = async (type: 'trainee' | 'staff', pno: string) => {
    try {
      const functionName = `${type}-attendance-view`;
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { pno }
      });
      
      if (error) {
        console.error(`Error calling ${functionName}:`, error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error(`Error searching for ${type}:`, error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          <Input
            type="text"
            placeholder={isHindi ? "पीएनओ दर्ज करें" : "Enter PNO"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`transition-all duration-200 ${isHindi ? "font-mangal" : ""}`}
          />
        </div>
        <div>
          <Button 
            type="submit" 
            disabled={isLoading} 
            className="w-full"
          >
            {isLoading ? (
              <span className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "खोज रहा है..." : "Searching..."}
              </span>
            ) : (
              <span className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "खोजें" : "Search"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
