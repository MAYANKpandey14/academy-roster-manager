
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { EditTraineeForm } from "@/components/trainee/EditTraineeForm";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";

// This would be replaced with an actual data fetch from Supabase
const getMockTrainee = (id: string, mockTrainees: Trainee[]): Trainee | undefined => {
  return mockTrainees.find(trainee => trainee.id === id);
};

// Mock data (same as in Index.tsx)
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

const EditTraineePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainee = async () => {
      try {
        // In a real app, this would fetch from Supabase
        const traineeData = getMockTrainee(id || "", mockTrainees);
        
        if (traineeData) {
          setTrainee(traineeData);
        } else {
          toast.error("Trainee not found");
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching trainee:", error);
        toast.error("Failed to load trainee data");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainee();
  }, [id, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center">Loading trainee data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!trainee) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-center text-red-500">Trainee not found</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <EditTraineeForm 
          trainee={trainee}
          onSuccess={() => {
            // In a real app, this would refresh data from Supabase
            navigate("/");
          }}
        />
      </main>
    </div>
  );
};

export default EditTraineePage;
