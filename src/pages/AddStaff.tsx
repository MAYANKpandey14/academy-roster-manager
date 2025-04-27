
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StaffForm } from "@/components/staff/StaffForm";
import { StaffFormValues } from "@/components/staff/StaffFormSchema";
import { addStaff } from "@/services/staffApi";
import { toast } from "sonner";

const AddStaff = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: StaffFormValues) => {
    try {
      setIsSubmitting(true);
      const { error } = await addStaff(data);
      
      if (error) throw error;
      
      toast.success("Staff added successfully");
      navigate("/staff");
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error("Failed to add staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Add New Staff</h1>
          <Button variant="outline" onClick={() => navigate("/staff")}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <StaffForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddStaff;
