
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StaffPage = () => {
  const navigate = useNavigate();

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
        
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-center text-gray-500">Staff management coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default StaffPage;
