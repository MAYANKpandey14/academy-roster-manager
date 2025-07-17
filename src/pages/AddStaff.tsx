
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StaffForm } from "@/components/staff/StaffForm";
import { StaffFormValues } from "@/components/staff/StaffFormSchema";
import { addStaff } from "@/services/staffApi";
import { toast } from "sonner";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";

const AddStaff = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  
  // Apply language inputs hook
  useLanguageInputs();

  const handleSubmit = async (data: StaffFormValues) => {
    try {
      setIsSubmitting(true);
      
      // First create staff without photo
      const staffData = {
        ...data,
        photo_url: null
      };
      
      const response = await addStaff(staffData);
      
      if (response.error) throw response.error;
      
      
      toast.success(isHindi ? "स्टाफ सफलतापूर्वक जोड़ा गया" : "Staff added successfully");
      navigate("/staff");
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error(isHindi ? "स्टाफ जोड़ने में विफल" : "Failed to add staff");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold dynamic-text">{isHindi ? "नया स्टाफ जोड़ें" : "Add New Staff"}</h1>
          <Button variant="outline" onClick={() => navigate("/staff")}>
            <span className="dynamic-text">{isHindi ? "रद्द करें" : "Cancel"}</span>
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <StaffForm 
                onSubmit={handleSubmit} 
                isSubmitting={isSubmitting} 
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddStaff;
