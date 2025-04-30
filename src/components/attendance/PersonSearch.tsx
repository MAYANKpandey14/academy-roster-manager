
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
  mobile_number: string;
}

interface PersonSearchProps {
  onPersonFound: (person: PersonData, type: 'trainee' | 'staff') => void;
}

export function PersonSearch({ onPersonFound }: PersonSearchProps) {
  const { isHindi } = useLanguage();
  const [pno, setPno] = useState("");
  const [personType, setPersonType] = useState<'trainee' | 'staff'>('trainee');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pno) {
      toast.error(isHindi 
        ? "कृपया पी.एन.ओ. दर्ज करें" 
        : "Please enter the PNO");
      return;
    }
    
    setIsSearching(true);
    
    try {
      const tableName = personType === 'trainee' ? 'trainees' : 'staff';
      
      const { data, error } = await supabase
        .from(tableName)
        .select('id, pno, name, rank, mobile_number')
        .eq('pno', pno)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (!data) {
        toast.error(isHindi
          ? "कोई व्यक्ति नहीं मिला" 
          : "No person found");
        return;
      }
      
      // Create a properly shaped PersonData object - ensure type safety
      const personData: PersonData = {
        id: data.id,
        pno: data.pno,
        name: data.name,
        mobile_number: data.mobile_number
      };
      
      // Add rank for staff if available
      if (personType === 'staff' && data.rank) {
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

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="personType" className={`${isHindi ? "font-mangal" : ""}`}>
            {isHindi ? "व्यक्ति का प्रकार" : "Person Type"}
          </Label>
          <Select
            value={personType}
            onValueChange={(value: 'trainee' | 'staff') => setPersonType(value)}
          >
            <SelectTrigger id="personType">
              <SelectValue placeholder={isHindi ? "प्रकार चुनें" : "Select type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trainee">
                <span className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "प्रशिक्षु" : "Trainee"}
                </span>
              </SelectItem>
              <SelectItem value="staff">
                <span className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "स्टाफ" : "Staff"}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pno" className={`${isHindi ? "font-mangal" : ""}`}>
            {isHindi ? "पी.एन.ओ. संख्या" : "PNO Number"}
          </Label>
          <div className="flex space-x-2">
            <Input
              id="pno"
              value={pno}
              onChange={(e) => setPno(e.target.value)}
              placeholder={isHindi ? "पी.एन.ओ. दर्ज करें" : "Enter PNO"}
              className={isHindi ? "font-mangal" : ""}
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <span className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "खोज रहा है..." : "Searching..."}
                </span>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  <span className={isHindi ? "font-mangal" : ""}>
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
