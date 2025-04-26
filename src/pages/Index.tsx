
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TraineeTable } from "@/components/trainee/TraineeTable";
import { TraineeFilters } from "@/components/trainee/TraineeFilters";
import { Button } from "@/components/ui/button";
import { Trainee } from "@/types/trainee";
import { Plus, RefreshCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTrainees, filterTrainees } from "@/services/api";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [filteredTrainees, setFilteredTrainees] = useState<Trainee[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all trainees on component mount
  useEffect(() => {
    fetchTrainees();
  }, []);

  const fetchTrainees = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await getTrainees();
      
      if (error) {
        toast.error("Failed to load trainees");
        console.error(error);
        return;
      }
      
      if (data) {
        setTrainees(data);
        setFilteredTrainees(data);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters using the API
  const applyFilters = async () => {
    setIsLoading(true);
    
    try {
      const dateString = dateFilter ? dateFilter.toISOString() : undefined;
      const { data, error } = await filterTrainees(nameFilter, districtFilter, dateString);
      
      if (error) {
        toast.error("Failed to filter trainees");
        console.error(error);
        return;
      }
      
      if (data) {
        setFilteredTrainees(data);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while filtering");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (value: string) => {
    setNameFilter(value);
    setTimeout(applyFilters, 0);
  };

  const handleDistrictChange = (value: string) => {
    setDistrictFilter(value);
    setTimeout(applyFilters, 0);
  };

  const handleDateChange = (value: Date | undefined) => {
    setDateFilter(value);
    setTimeout(applyFilters, 0);
  };

  const handleResetFilters = () => {
    setNameFilter("");
    setDistrictFilter("");
    setDateFilter(undefined);
    setFilteredTrainees(trainees);
  };

  const handleRefresh = () => {
    fetchTrainees();
    toast.success("Data refreshed");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trainees Management</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => navigate('/add-trainee')} disabled={isLoading}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Trainee
            </Button>
          </div>
        </div>
        
        <TraineeFilters
          onNameChange={handleNameChange}
          onDistrictChange={handleDistrictChange}
          onDateChange={handleDateChange}
          onReset={handleResetFilters}
          disabled={isLoading}
        />
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
          <h2 className="text-2xl font-semibold mb-6">Trainees List</h2>
          <TraineeTable 
            trainees={filteredTrainees} 
            onRefresh={handleRefresh} 
            isLoading={isLoading} 
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
