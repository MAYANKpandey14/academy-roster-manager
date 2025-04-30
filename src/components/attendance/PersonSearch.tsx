
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
      
      // Define specific columns to select based on person type
      let columns = 'id, pno, name, mobile_number';
      if (personType === 'trainee') {
        columns += ', chest_no';
      } else {
        columns += ', rank';
      }
      
      const { data, error } = await supabase
        .from(tableName)
        .select(columns)
        .eq('pno', pno)
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
      
      // Now we know data is not null, create a properly shaped PersonData object
      const personData: PersonData = {
        id: data.id,
        pno: data.pno,
        name: data.name,
        mobile_number: data.mobile_number
      };
      
      // Add type-specific fields
      if (personType === 'trainee' && 'chest_no' in data) {
        personData.chest_no = data.chest_no;
      } else if (personType === 'staff' && 'rank' in data) {
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
    <form onSubmit={handleSearch} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="personType" className={`${isHindi ? "font-mangal" : ""}`}>
            {isHindi ? "व्यक्ति का प्रकार" : "Person Type"}
          </Label>
          <Select
            value={personType}
            onValueChange={(value: 'trainee' | 'staff') => setPersonType(value)}
          >
            <SelectTrigger id="personType" className="transition-all duration-200">
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
            <Button 
              type="submit" 
              disabled={isSearching}
              className="transition-all duration-200 hover:scale-105 active:scale-95"
            >
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
