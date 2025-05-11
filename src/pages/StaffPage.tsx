
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { StaffTable } from "@/components/staff/StaffTable";
import { StaffFilters } from "@/components/staff/StaffFilters";
import { Staff, StaffRank } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const { isHindi } = useLanguage();
  
  // Use the language inputs hook for better language support
  useLanguageInputs();

  const handleSearch = async (pno: string): Promise<boolean> => {
    setIsLoading(true);
    try {
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
      <Header />
      <main className="container mx-auto py-6 px-4 animate-fade-in">
        <div className="mb-6 flex flex-wrap items-center justify-between">
          <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'स्टाफ' : 'Staff'}
          </h1>
          <Button 
            variant="outline" 
            onClick={handleShareRegistrationForm}
            className="flex items-center gap-2 ml-auto mb-4"
          >
            <Share2 size={16} />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'स्टाफ पंजीकरण फॉर्म शेयर करें' : 'Share Staff Register Form'}
            </span>
          </Button>
        </div>

        <StaffFilters
          onSearch={handleSearch}
          onShowAll={handleShowAll}
          disabled={isLoading}
        />
        
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
