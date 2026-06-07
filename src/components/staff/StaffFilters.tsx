
import { useState } from "react";
import { Search, List, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface StaffFiltersProps {
  onSearch: (pno: string, name?: string) => Promise<boolean>;
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
  const [name, setName] = useState("");
  const { isHindi } = useLanguage();

  const handleSearch = async () => {
    if (!pno && !name) {
      toast.error(isHindi ? "कृपया खोजने के लिए PNO या नाम दर्ज करें" : "Please enter a PNO or name to search");
      return;
    }

    const found = await onSearch(pno, name);
    if (!found) {
      toast.error(isHindi ? "कोई स्टाफ खोजने के लिए मिला नहीं" : "No staff found matching your search criteria");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5 animate-scale-in">
      <h3 className={`text-lg font-display font-bold text-slate-900 dark:text-slate-100 ${isHindi ? 'font-mangal' : ''}`}>
        {isHindi ? "स्टाफ खोजें" : "Search Staff"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className={`text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "नाम" : "Name"}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              id="name"
              placeholder={isHindi ? "नाम दर्ज करें" : "Enter name..."}
              className="pl-10 h-10 border-slate-200 dark:border-slate-800 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pno" className={`text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isHindi ? 'font-mangal' : ''}`}>
            {isHindi ? "पीएनओ/ यूनिक आईडी" : "PNO/ Unique ID"}
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              id="pno"
              placeholder={isHindi ? "पीएनओ/ यूनिक आईडी दर्ज करें" : "Enter PNO/ Unique ID..."}
              className="pl-10 h-10 border-slate-200 dark:border-slate-800 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100"
              value={pno}
              onChange={(e) => setPno(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              maxLength={12}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <Button onClick={() => navigate('/staff/add')} variant="outline" className="h-10 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 animate-slide-in">
          <UserPlus className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "स्टाफ जोड़ें" : "Add Staff"}
          </span>
        </Button>
        <Button onClick={onShowAll} variant="outline" disabled={disabled} className="h-10 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 animate-slide-in">
          <List className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "सभी स्टाफ दिखाएं" : "Show All"}
          </span>
        </Button>
        <Button onClick={handleSearch} disabled={disabled} className="h-10 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white transition-colors animate-slide-in">
          <Search className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "खोजें" : "Search"}
          </span>
        </Button>
      </div>
    </div>
  );
}
