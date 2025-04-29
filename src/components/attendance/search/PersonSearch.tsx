
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PersonType } from "../types";

interface PersonSearchProps {
  activeTab: PersonType;
  onPersonFound: (data: any) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export function PersonSearch({ 
  activeTab, 
  onPersonFound, 
  isSearching,
  setIsSearching 
}: PersonSearchProps) {
  const { t, i18n } = useTranslation();
  const [pno, setPno] = useState("");

  const handleSearch = async () => {
    if (!pno.trim()) {
      toast.error("कृपया पीएनओ दर्ज करें");
      return;
    }

    setIsSearching(true);

    try {
      const table = activeTab === 'trainee' ? 'trainees' : 'staff';
      const { data, error } = await supabase
        .from(table)
        .select('id, name, rank, mobile_number, pno')
        .eq('pno', pno.trim())
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        toast.error(`${activeTab === 'trainee' ? 'प्रशिक्षु' : 'स्टाफ'} नहीं मिला`);
        onPersonFound(null);
        return;
      }

      onPersonFound(data);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("डेटा खोजने में समस्या हुई");
      onPersonFound(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">पीएनओ से खोजें</h2>
      
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2 flex-grow">
          <Label htmlFor="pno">पीएनओ नंबर</Label>
          <Input
            id="pno"
            value={pno}
            onChange={(e) => setPno(e.target.value)}
            placeholder="पीएनओ दर्ज करें (9-अंक)"
            maxLength={9}
            lang={i18n.language}
            className="max-w-md"
          />
        </div>
        <Button 
          onClick={handleSearch} 
          disabled={isSearching}
          className="flex items-center gap-2"
        >
          <SearchIcon size={18} />
          <span>{isSearching ? 'खोज रहा है...' : 'खोजें'}</span>
        </Button>
      </div>
    </div>
  );
}
