
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EditStaff = () => {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
            <p className="text-center text-gray-500 my-8">
              Edit staff form for ID: {id} will be implemented in the next phase.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => {
                toast.info("Edit staff form will be implemented soon");
                navigate("/staff");
              }}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditStaff;
