
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TraineeTable } from "@/components/trainee/TraineeTable";
import { TraineeFilters } from "@/components/trainee/TraineeFilters";
import { Button } from "@/components/ui/button";
import { Trainee } from "@/types/trainee";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data for demo purposes
// This would be replaced with actual data from Supabase
const mockTrainees: Trainee[] = [
  {
    id: "1",
    pno: "141020011",
    chest_no: "C12",
    name: "Mayank Pandey", 
    father_name: "RCP",
    arrival_date: "2025-01-05T00:00:00.000Z",
    departure_date: "2025-03-05T00:00:00.000Z",
    current_posting_district: "Moradabad",
    mobile_number: "7654321098",
    education: "BTECH CSE",
    date_of_birth: "1992-03-10T00:00:00.000Z",
    date_of_joining: "2021-02-15T00:00:00.000Z",
    blood_group: "B+",
    nominee: "MEENA",
    home_address: "452,Bank Colony,Khushalpur,Moradabad"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState<Trainee[]>(mockTrainees);
  const [filteredTrainees, setFilteredTrainees] = useState<Trainee[]>(mockTrainees);
  const [nameFilter, setNameFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const applyFilters = () => {
    let filtered = [...trainees];
    
    if (nameFilter) {
      filtered = filtered.filter(trainee => 
        trainee.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    if (districtFilter) {
      filtered = filtered.filter(trainee => 
        trainee.current_posting_district.toLowerCase().includes(districtFilter.toLowerCase())
      );
    }
    
    if (dateFilter) {
      filtered = filtered.filter(trainee => {
        const arrivalDate = new Date(trainee.arrival_date);
        const filterDate = new Date(dateFilter);
        return arrivalDate.toDateString() === filterDate.toDateString();
      });
    }
    
    setFilteredTrainees(filtered);
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
    // In a real app, this would refresh data from Supabase
    // For now, we'll just reset the filters
    handleResetFilters();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trainees Management</h1>
          <Button onClick={() => navigate('/add-trainee')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Trainee
          </Button>
        </div>
        
        <TraineeFilters
          onNameChange={handleNameChange}
          onDistrictChange={handleDistrictChange}
          onDateChange={handleDateChange}
          onReset={handleResetFilters}
        />
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
          <h2 className="text-2xl font-semibold mb-6">Trainees List</h2>
          <TraineeTable trainees={filteredTrainees} onRefresh={handleRefresh} />
        </div>
      </main>
    </div>
  );
};

export default Index;
