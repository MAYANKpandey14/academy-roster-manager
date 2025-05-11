
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TraineeTable } from "@/components/trainee/TraineeTable";
import { TraineeFilters } from "@/components/trainee/TraineeFilters";
import { Trainee, BloodGroup, TraineeRank } from "@/types/trainee";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

const TraineesPage = () => {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const { isHindi } = useLanguage();

  const handleSearch = async (pno: string, chestNo: string, rollNo: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      let query = supabase.from('trainees').select('*');
      
      if (pno) query = query.eq('pno', pno);
      if (chestNo) query = query.eq('chest_no', chestNo);
      if (rollNo) query = query.eq('id', rollNo);

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Convert the data to ensure it matches the Trainee type
      const typedTrainees: Trainee[] = data?.map(item => ({
        ...item,
        blood_group: item.blood_group as BloodGroup,
        rank: (item.rank || 'CONST') as TraineeRank // Cast and provide default if needed
      })) || [];
      
      setTrainees(typedTrainees);
      setShowTable(true);
      return typedTrainees.length > 0;
    } catch (error) {
      console.error('Error searching trainees:', error);
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
        .from('trainees')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      // Convert the data to ensure it matches the Trainee type
      const typedTrainees: Trainee[] = data?.map(item => ({
        ...item,
        blood_group: item.blood_group as BloodGroup,
        rank: (item.rank || 'CONST') as TraineeRank // Cast and provide default
      })) || [];
      
      setTrainees(typedTrainees);
      setShowTable(true);
    } catch (error) {
      console.error('Error fetching all trainees:', error);
      toast.error(isHindi ? 'एक त्रुटि हुई' : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareRegistrationForm = () => {
    const registrationUrl = `${window.location.origin}/trainee-register`;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: isHindi ? 'प्रशिक्षु पंजीकरण फॉर्म' : 'Trainee Registration Form',
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

  const handleRefresh = () => {
    if (trainees.length > 0) {
      // If we already have trainees, refresh with the same query
      handleShowAll();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4 animate-fade-in">
        <div className="mb-6 flex flex-wrap items-center justify-between">
          <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'प्रशिक्षु' : 'Trainees'}
          </h1>
          <Button 
            variant="outline" 
            onClick={handleShareRegistrationForm}
            className="flex items-center gap-2 ml-auto mb-4"
          >
            <Share2 size={16} />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'प्रशिक्षु पंजीकरण फॉर्म शेयर करें' : 'Share Trainee Register Form'}
            </span>
          </Button>
        </div>
        
        <TraineeFilters
          onSearch={handleSearch}
          onShowAll={handleShowAll}
          disabled={isLoading}
        />
        
        {showTable && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-6 animate-scale-in">
            <TraineeTable 
              trainees={trainees} 
              isLoading={isLoading}
              onRefresh={handleRefresh}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default TraineesPage;
