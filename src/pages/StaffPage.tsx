
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { StaffTable } from "@/components/staff/StaffTable";
import { StaffFilters } from "@/components/staff/StaffFilters";
import { Staff } from "@/types/staff";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const StaffPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const handleSearch = async (pno: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('pno', pno);
      
      if (error) throw error;
      
      setStaff(data || []);
      setShowTable(true);
      return data && data.length > 0;
    } catch (error) {
      console.error('Error searching staff:', error);
      toast.error('Failed to search staff');
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
      
      setStaff(data || []);
      setShowTable(true);
    } catch (error) {
      console.error('Error fetching all staff:', error);
      toast.error('Failed to load staff');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-6">Staff</h1>
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
