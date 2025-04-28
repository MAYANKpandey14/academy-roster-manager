
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StaffTable } from "@/components/staff/StaffTable";
import { StaffFilters } from "@/components/staff/StaffFilters";
import { Staff, StaffRank } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const { t } = useTranslation();
  
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
      toast.error(t('error', 'An error occurred'));
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
      toast.error(t('error', 'An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-6 dynamic-text">{t('staff', 'Staff')}</h1>
          <StaffFilters
            onSearch={handleSearch}
            onShowAll={handleShowAll}
            disabled={isLoading}
          />
        </div>
        
        {showTable && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-6">
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
