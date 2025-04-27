
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TraineeTable } from "@/components/trainee/TraineeTable";

const TraineesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Trainees</h1>
          <Button onClick={() => navigate("/add-trainee")}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Trainee
          </Button>
        </div>
        
        <TraineeTable />
      </main>
    </div>
  );
};

export default TraineesPage;
