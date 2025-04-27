
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StaffForm } from "@/components/staff/StaffForm";
import { StaffFormValues } from "@/components/staff/StaffFormSchema";
import { getStaffById, updateStaff } from "@/services/staffApi";
import { toast } from "sonner";

const EditStaff = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaff] = useState<StaffFormValues | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await getStaffById(id);
        
        if (error) throw error;
        
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error("Failed to load staff details");
        navigate("/staff");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id, navigate]);

  const handleSubmit = async (data: StaffFormValues) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const { error } = await updateStaff(id, data);
      
      if (error) throw error;
      
      toast.success("Staff updated successfully");
      navigate("/staff");
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error("Failed to update staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <p className="text-center">Loading...</p>
        </main>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <p className="text-center text-red-500">Staff not found</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Edit Staff</h1>
          <Button variant="outline" onClick={() => navigate("/staff")}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <StaffForm 
              initialData={staff} 
              onSubmit={handleSubmit} 
              isSubmitting={isSubmitting} 
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditStaff;
