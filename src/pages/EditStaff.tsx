
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StaffForm } from "@/components/staff/StaffForm";
import { StaffFormValues } from "@/components/staff/StaffFormSchema";
import { getStaffById, updateStaff } from "@/services/staffApi";
import { toast } from "sonner";
import { Staff } from "@/types/staff";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";

const EditStaff = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaff] = useState<Staff | null>(null);
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  
  // Apply language inputs hook
  useLanguageInputs();

  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await getStaffById(id);
        
        if (error) throw error;
        
        // Ensure photo_url is properly handled
        const staffWithPhotoUrl = {
          ...data,
          photo_url: data.photo_url || ''
        };
        
        setStaff(staffWithPhotoUrl);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error(isHindi ? "स्टाफ विवरण लोड नहीं हो सकते" : "Failed to load staff details");
        navigate("/staff");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id, navigate, isHindi]);

  const handleSubmit = async (data: StaffFormValues) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      
      // Handle photo_url properly
      const formData = {
        ...data,
        photo_url: data.photo_url || null
      };
      
      const { error } = await updateStaff(id, formData);
      
      if (error) throw error;
      
      toast.success(isHindi ? "स्टाफ सफलतापूर्वक अपडेट हो गया" : "Staff updated successfully");
      navigate(`/staff/${id}`);
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error(isHindi ? "स्टाफ अपडेट नहीं हो सकते" : "Failed to update staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <p className="text-center dynamic-text">{isHindi ? "लोडिंग..." : "Loading..."}</p>
        </main>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <p className="text-center text-red-500 dynamic-text">{isHindi ? "स्टाफ नहीं मिला" : "Staff not found"}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold dynamic-text">{isHindi ? "स्टाफ संपादित करें" : "Edit Staff"}</h1>
          <Button variant="outline" onClick={() => navigate("/staff")}>
            <span className="dynamic-text">{isHindi ? "रद्द करें" : "Cancel"}</span>
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
