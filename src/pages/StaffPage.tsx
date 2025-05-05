
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { StaffFilters } from "@/components/staff/StaffFilters";
import { StaffTable } from "@/components/staff/StaffTable";
import { supabase } from "@/integrations/supabase/client";
import { Staff } from "@/types/staff";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function StaffPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isHindi } = useLanguage();

  const fetchAllStaff = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStaffList(data || []);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast.error(isHindi ? "स्टाफ लोड नहीं हो सका" : "Failed to load staff");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (identifier: string, uniqueId?: string, identifierType?: string) => {
    setIsLoading(true);
    try {
      let query = supabase.from('staff').select('*');
      
      // Search based on identifier type
      if (identifierType === "unique_id" && uniqueId) {
        // Search by unique ID/Adhaar number using the adhaar_number field
        query = query.eq('adhaar_number', uniqueId);
      } else {
        // Default: search by PNO
        query = query.eq('pno', identifier);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        setStaffList(data);
        return true;
      } else {
        setStaffList([]);
        return false;
      }
    } catch (error) {
      console.error("Error searching staff:", error);
      toast.error(isHindi ? "स्टाफ खोज में त्रुटि" : "Error searching staff");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStaff();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className={`text-2xl font-semibold mb-6 ${isHindi ? "font-mangal" : ""}`}>
          {isHindi ? "स्टाफ प्रबंधन" : "Staff Management"}
        </h1>

        <StaffFilters 
          onSearch={handleSearch} 
          onShowAll={fetchAllStaff} 
          disabled={isLoading}
        />

        <div className="mt-6">
          <StaffTable 
            staffList={staffList} 
            isLoading={isLoading} 
            onRefresh={fetchAllStaff} 
          />
        </div>
      </main>
    </div>
  );
}
