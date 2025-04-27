
import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { getTrainees } from "@/services/api";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit } from "lucide-react";

const ViewTrainee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainee = async () => {
      try {
        const { data, error } = await getTrainees();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const traineeData = data.find(t => t.id === id);
          
          if (traineeData) {
            setTrainee(traineeData);
          } else {
            toast.error("Trainee not found");
            navigate("/");
          }
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
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Trainee Details</h1>
            <Button 
              onClick={() => navigate(`/edit-trainee/${trainee.id}`)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Trainee
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">PNO</h3>
                <p className="mt-1">{trainee.pno}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Chest No</h3>
                <p className="mt-1">{trainee.chest_no}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1">{trainee.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Father's Name</h3>
                <p className="mt-1">{trainee.father_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Posting District</h3>
                <p className="mt-1">{trainee.current_posting_district}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Mobile Number</h3>
                <p className="mt-1">{trainee.mobile_number}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Education</h3>
                <p className="mt-1">{trainee.education}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Blood Group</h3>
                <p className="mt-1">{trainee.blood_group}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nominee</h3>
                <p className="mt-1">{trainee.nominee}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Home Address</h3>
                <p className="mt-1">{trainee.home_address}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
                <p className="mt-1">{format(new Date(trainee.date_of_birth), 'PP')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date of Joining</h3>
                <p className="mt-1">{format(new Date(trainee.date_of_joining), 'PP')}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Training Period</h3>
                <p className="mt-1">
                  {format(new Date(trainee.arrival_date), 'PP')} - {format(new Date(trainee.departure_date), 'PP')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewTrainee;
