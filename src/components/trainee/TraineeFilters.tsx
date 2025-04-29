
import { useState } from "react";
import { Search, List, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

interface TraineeFiltersProps {
  onSearch: (pno: string, chestNo: string, rollNo: string) => Promise<boolean>;
  onShowAll: () => void;
  disabled?: boolean;
}

export function TraineeFilters({
  onSearch,
  onShowAll,
  disabled = false,
}: TraineeFiltersProps) {
  const navigate = useNavigate();
  const [pno, setPno] = useState("");
  const [chestNo, setChestNo] = useState("");
  const [rollNo, setRollNo] = useState("");
  const { t, i18n } = useTranslation();

  const handleSearch = async () => {
    if (!pno && !chestNo && !rollNo) {
      toast.error(t("selectTraineesToPrint", "Please enter at least one search criteria"));
      return;
    }
    
    const found = await onSearch(pno, chestNo, rollNo);
    if (!found) {
      toast.error(t("noResults", "No trainee found matching your search criteria"));
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
      <h3 className="text-lg font-medium mb-4">
        <span className={`dynamic-text ${i18n.language === 'hi' ? 'krutidev-heading' : ''}`}>
          {t("searchTrainees")}
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pno" className="dynamic-text">
            {t("pnoNumber")}
          </Label>
          <Input
            id="pno"
            placeholder={t("enterPNO")}
            value={pno}
            onChange={(e) => setPno(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={9}
            lang={i18n.language}
            preserveSpecialChars={true}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chestNo" className="dynamic-text">
            {t("chestNumber")}
          </Label>
          <Input
            id="chestNo"
            placeholder={t("enterChestNo")}
            value={chestNo}
            onChange={(e) => setChestNo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={4}
            lang={i18n.language}
            preserveSpecialChars={true}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rollNo" className="dynamic-text">
            <span dangerouslySetInnerHTML={{ 
              __html: i18n.language === 'hi' 
                ? `${t("rollNo")} <span class="preserve-char">/</span> ${t("uniqueId")}` 
                : `${t("rollNo")} / ${t("uniqueId")}` 
            }} />
          </Label>
          <Input
            id="rollNo"
            placeholder={t("enterRollNo")}
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={12}
            lang={i18n.language}
            preserveSpecialChars={true}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => navigate('/add-trainee')} variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{t("addNewTrainee")}</span>
        </Button>
        <Button onClick={onShowAll} variant="outline" disabled={disabled}>
          <List className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{t("showAllTrainees")}</span>
        </Button>
        <Button onClick={handleSearch} disabled={disabled}>
          <Search className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{t("searchTraineeBtn")}</span>
        </Button>
      </div>
    </div>
  );
}
