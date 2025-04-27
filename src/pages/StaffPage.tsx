
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Staff } from "@/types/staff";
import { getStaff } from "@/services/staffApi";
import { toast } from "sonner";
import { StaffTable } from "@/components/staff/StaffTable";

const StaffPage = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await getStaff();
      
      if (error) {
        throw error;
      }
      
      setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Failed to load staff');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Staff</h1>
          <Button onClick={() => navigate("/add-staff")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Staff
          </Button>
        </div>
        
        <StaffTable 
          staff={staff} 
          onRefresh={fetchStaff}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default StaffPage;
