
import { useState } from "react";
import { Search, List, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface StaffFiltersProps {
  onSearch: (pno: string) => Promise<boolean>;
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
  const { t, i18n } = useTranslation();

  const handleSearch = async () => {
    if (!pno) {
      toast.error(t("enterPNO", "Please enter a PNO to search"));
      return;
    }
    
    const found = await onSearch(pno);
    if (!found) {
      toast.error(t("noResults", "No staff found matching your search criteria"));
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
          {t("searchStaff", "Search Staff")}
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pno" className="dynamic-text">{t("pnoNumber", "PNO Number")}</Label>
          <Input
            id="pno"
            placeholder={t("enterPNO", "Enter PNO (9-digit)")}
            value={pno}
            onChange={(e) => setPno(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={9}
            lang={i18n.language}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-end gap-2">
        <Button onClick={() => navigate('/add-staff')} variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{t("addStaff", "Add Staff")}</span>
        </Button>
        <Button onClick={onShowAll} variant="outline" disabled={disabled}>
          <List className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{t("showAllStaff", "Show All Staff")}</span>
        </Button>
        <Button onClick={handleSearch} disabled={disabled}>
          <Search className="mr-2 h-4 w-4" />
          <span className="dynamic-text">{t("search", "Search")}</span>
        </Button>
      </div>
    </div>
  );
}
