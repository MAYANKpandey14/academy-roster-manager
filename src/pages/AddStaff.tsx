
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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
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
      
      // If there's a selected image and we have the staff ID, upload it
      if (selectedImage && response.data?.id) {
        try {
          const formData = new FormData();
          formData.append('file', selectedImage);
          formData.append('bucketName', 'staff_photos');
          formData.append('entityId', response.data.id);

          const uploadResponse = await fetch('https://zjgphamebgrclivvkhmw.supabase.co/functions/v1/process-image-upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqZ3BoYW1lYmdyY2xpdnZraG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTM2NDcsImV4cCI6MjA2MTI2OTY0N30.1SmOoYa7R4iybW0nCIuc-FrbYML-EP9yC2ykJ6kpUTo`,
            },
            body: formData,
          });

          if (!uploadResponse.ok) {
            console.warn('Image upload failed, but staff was created successfully');
          }
        } catch (imageError) {
          console.warn('Image upload failed:', imageError);
          // Don't fail the entire operation if image upload fails
        }
      }
      
      toast.success(isHindi ? "स्टाफ सफलतापूर्वक जोड़ा गया" : "Staff added successfully");
      navigate("/staff");
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error(isHindi ? "स्टाफ जोड़ने में विफल" : "Failed to add staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
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
                selectedImage={selectedImage} 
                onImageSelect={handleImageSelect} 
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddStaff;
