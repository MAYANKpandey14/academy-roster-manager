
import { useState } from "react";
import { StaffTable } from "@/components/staff/StaffTable";
import { StaffFilters } from "@/components/staff/StaffFilters";
import { Staff, StaffRank } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Share2, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFuzzySearch } from "@/hooks/useFuzzySearch";
import { NaturalLanguageSearch } from "@/components/search/NaturalLanguageSearch";

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const { performServerSearch } = useFuzzySearch<Staff>({ table: "staff" });
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [searchMode, setSearchMode] = useState<"quick" | "ai">("quick");
  const { isHindi } = useLanguage();
  const isMobile = useIsMobile();

  const handleAISearchResults = (
    table: "trainees" | "staff",
    data: any[]
  ) => {
    const typedStaff: Staff[] = data.map(item => ({
      ...item,
      rank: item.rank as StaffRank,
      blood_group: item.blood_group as Staff['blood_group']
    }));
    setStaff(typedStaff);
    setShowTable(true);
  };

  const handleClearAISearch = () => {
    setStaff([]);
    setShowTable(false);
  };
  
  // Use the language inputs hook for better language support
  useLanguageInputs();

  const handleSearch = async (pno: string, name?: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (name && !pno) {
        const results = await performServerSearch(name);
        setStaff(results);
        setShowTable(true);
        return results.length > 0;
      }

      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('pno', pno);
      
      if (error) throw error;
      
      // Convert the data to ensure it matches the Staff type
      const typedStaff: Staff[] = data?.map(item => ({
        ...item,
        rank: item.rank as StaffRank,
        blood_group: item.blood_group as Staff['blood_group']
      })) || [];
      
      setStaff(typedStaff);
      setShowTable(true);
      return typedStaff.length > 0;
    } catch (error) {
      console.error('Error searching staff:', error);
      toast.error(isHindi ? 'एक त्रुटि हुई' : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAll = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Convert the data to ensure it matches the Staff type
      const typedStaff: Staff[] = data?.map(item => ({
        ...item,
        rank: item.rank as StaffRank,
        blood_group: item.blood_group as Staff['blood_group']
      })) || [];
      
      setStaff(typedStaff);
      setShowTable(true);
    } catch (error) {
      console.error('Error fetching all staff:', error);
      toast.error(isHindi ? 'एक त्रुटि हुई' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareRegistrationForm = () => {
    const registrationUrl = `${window.location.origin}/staff-register`;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: isHindi ? 'स्टाफ पंजीकरण फॉर्म' : 'Staff Registration Form',
        text: isHindi ? 'कृपया इस लिंक का उपयोग करके पंजीकरण फॉर्म भरें' : 'Please fill the registration form using this link',
        url: registrationUrl
      }).catch(err => {
        console.error('Error sharing:', err);
        fallbackCopyToClipboard(registrationUrl);
      });
    } else {
      fallbackCopyToClipboard(registrationUrl);
    }
  };

  const fallbackCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(isHindi ? 'लिंक क्लिपबोर्ड पर कॉपी किया गया' : 'Link copied to clipboard');
    }).catch(err => {
      console.error('Could not copy text: ', err);
      toast.error(isHindi ? 'लिंक कॉपी नहीं किया जा सका' : 'Could not copy link');
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto py-6 px-4 animate-fade-in">
        {/* Search Mode Tabs & Share Button */}
        <div className="flex flex-wrap items-center justify-between border-b border-gray-200 dark:border-gray-800 mb-6 gap-4">
          <div className="flex">
            <button
              onClick={() => setSearchMode("quick")}
              className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-[2px] transition-all ${
                searchMode === "quick"
                  ? "border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {isHindi ? "त्वरित खोज" : "Quick Search"}
            </button>
            <button
              onClick={() => setSearchMode("ai")}
              className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-[2px] transition-all flex items-center gap-1.5 ${
                searchMode === "ai"
                  ? "border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              {isHindi ? "स्मार्ट एआई खोज" : "AI Smart Search"}
            </button>
          </div>

          <Button 
            variant="outline" 
            onClick={handleShareRegistrationForm}
            className="flex items-center gap-2 mb-2 h-9 text-xs border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            <Share2 size={14} />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'पंजीकरण फॉर्म शेयर करें' : 'Share Registration Form'}
            </span>
          </Button>
        </div>

        {searchMode === "quick" ? (
          <StaffFilters
            onSearch={handleSearch}
            onShowAll={handleShowAll}
            disabled={isLoading}
          />
        ) : (
          <NaturalLanguageSearch
            onSearchResults={handleAISearchResults}
            onClear={handleClearAISearch}
          />
        )}
        
        {showTable && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-6 animate-scale-in">
            <StaffTable 
              staff={staff} 
              onRefresh={handleShowAll}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default StaffPage;
