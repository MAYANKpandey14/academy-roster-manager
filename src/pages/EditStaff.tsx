
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
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";

const EditStaff = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [staff, setStaff] = useState<Staff | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Apply language inputs hook
  useLanguageInputs();

  useEffect(() => {
    const fetchStaff = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await getStaffById(id);
        
        if (error) throw error;
        
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
        toast.error(t("failedToLoadStaffDetails", "Failed to load staff details"));
        navigate("/staff");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, [id, navigate, t]);

  const handleSubmit = async (data: StaffFormValues) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      const { error } = await updateStaff(id, data);
      
      if (error) throw error;
      
      toast.success(t("staffUpdatedSuccessfully", "Staff updated successfully"));
      navigate("/staff");
    } catch (error) {
      console.error("Error updating staff:", error);
      toast.error(t("failedToUpdateStaff", "Failed to update staff"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <p className="text-center dynamic-text">{t("loading", "Loading...")}</p>
        </main>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <p className="text-center text-red-500 dynamic-text">{t("staffNotFound", "Staff not found")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold dynamic-text">{t("editStaff", "Edit Staff")}</h1>
          <Button variant="outline" onClick={() => navigate("/staff")}>
            <span className="dynamic-text">{t("cancel", "Cancel")}</span>
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
