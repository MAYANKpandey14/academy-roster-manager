import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TraineeForm } from "@/components/trainee/TraineeForm";
import { TraineeTable } from "@/components/trainee/TraineeTable";
import { TraineeFilters } from "@/components/trainee/TraineeFilters";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trainee } from "@/types/trainee";
import { Plus } from "lucide-react";

// Mock data for demo purposes
// This would be replaced with actual data from Supabase
const mockTrainees: Trainee[] = [
  {
    id: "1",
    pno: "PN12345",
    chest_no: "C789",
    name: "John Smith",
    father_name: "Michael Smith",
    arrival_date: "2025-01-10T00:00:00.000Z",
    departure_date: "2025-03-10T00:00:00.000Z",
    current_posting_district: "Central District",
    mobile_number: "9876543210",
    education: "Graduate",
    date_of_birth: "1990-05-15T00:00:00.000Z",
    date_of_joining: "2020-01-01T00:00:00.000Z",
    blood_group: "O+",
    nominee: "Emily Smith",
    home_address: "123 Main Street, Central City"
  },
  {
    id: "2",
    pno: "PN67890",
    chest_no: "C456",
    name: "David Johnson",
    father_name: "Robert Johnson",
    arrival_date: "2025-01-15T00:00:00.000Z",
    departure_date: "2025-03-15T00:00:00.000Z",
    current_posting_district: "Eastern District",
    mobile_number: "8765432109",
    education: "Post Graduate",
    date_of_birth: "1988-08-20T00:00:00.000Z",
    date_of_joining: "2019-06-01T00:00:00.000Z",
    blood_group: "B+",
    nominee: "Sarah Johnson",
    home_address: "456 Oak Avenue, East Town"
  },
  {
    id: "3",
    pno: "PN24680",
    chest_no: "C123",
    name: "Maria Garcia",
    father_name: "Carlos Garcia",
    arrival_date: "2025-01-05T00:00:00.000Z",
    departure_date: "2025-03-05T00:00:00.000Z",
    current_posting_district: "Western District",
    mobile_number: "7654321098",
    education: "Masters in Criminal Justice",
    date_of_birth: "1992-03-10T00:00:00.000Z",
    date_of_joining: "2021-02-15T00:00:00.000Z",
    blood_group: "A-",
    nominee: "Ana Garcia",
    home_address: "789 Pine Street, West End"
  },
  {
    id: "4",
    pno: "PN123123",
    chest_no: "C12",
    name: "Mayank Pandey",
    father_name: "RCP",
    arrival_date: "2025-01-05T00:00:00.000Z",
    departure_date: "2025-03-05T00:00:00.000Z",
    current_posting_district: "Western District",
    mobile_number: "7654321098",
    education: "BTECH CSE",
    date_of_birth: "1992-03-10T00:00:00.000Z",
    date_of_joining: "2021-02-15T00:00:00.000Z",
    blood_group: "B+",
    nominee: "MEENA",
    home_address: "789 Pine Street, West End"
  }
];

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [trainees, setTrainees] = useState<Trainee[]>(mockTrainees);
  const [filteredTrainees, setFilteredTrainees] = useState<Trainee[]>(mockTrainees);
  const [nameFilter, setNameFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const handleFormSuccess = (newTrainee: Trainee) => {
    // Add the new trainee to both the main list and filtered list
    const updatedTrainees = [...trainees, newTrainee];
    setTrainees(updatedTrainees);
    setFilteredTrainees(updatedTrainees);
    setIsFormOpen(false);
  };

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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Trainee Management</h1>
            <Button onClick={() => setIsFormOpen(true)}>
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
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Trainees List</h2>
            <TraineeTable trainees={filteredTrainees} onRefresh={handleRefresh} />
          </div>
        </div>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <TraineeForm 
              onSuccess={handleFormSuccess} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Index;
