
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TraineeTable } from "@/components/trainee/TraineeTable";
import { TraineeFilters } from "@/components/trainee/TraineeFilters";
import { Trainee, BloodGroup } from "@/types/trainee";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

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
        blood_group: item.blood_group as BloodGroup
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
        blood_group: item.blood_group as BloodGroup
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
        <div className="mb-6">
          <h1 className={`text-2xl font-semibold mb-6 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'प्रशिक्षु' : 'Trainees'}
          </h1>
          <TraineeFilters
            onSearch={handleSearch}
            onShowAll={handleShowAll}
            disabled={isLoading}
          />
        </div>
        
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
