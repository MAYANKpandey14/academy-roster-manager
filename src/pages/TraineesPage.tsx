
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TraineeTable } from "@/components/trainee/TraineeTable";
import { TraineeFilters } from "@/components/trainee/TraineeFilters";
import { Trainee, BloodGroup } from "@/types/trainee";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const TraineesPage = () => {
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const { t, i18n } = useTranslation();

  // Set input language for all inputs when component loads or language changes
  useEffect(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.lang = i18n.language;
    });
  }, [i18n.language]);

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
      toast.error(t('error'));
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
      toast.error(t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-6">{t('trainees')}</h1>
          <TraineeFilters
            onSearch={handleSearch}
            onShowAll={handleShowAll}
            disabled={isLoading}
          />
        </div>
        
        {showTable && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-6">
            <TraineeTable 
              trainees={trainees} 
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default TraineesPage;
