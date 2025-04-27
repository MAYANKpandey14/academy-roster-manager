import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { useParams, useNavigate } from "react-router-dom";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { getTrainees } from "@/services/api";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Edit, Printer, Download } from "lucide-react";

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

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Trainee Information - ${trainee?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; margin-bottom: 30px; }
            .trainee-info { border: 1px solid #ddd; padding: 20px; }
            .field { margin-bottom: 15px; }
            .field-label { font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin-bottom: 5px; }
            .header p { margin-top: 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RTC Police Line, Moradabad</h1>
            <p>RTC Trainee Information</p>
          </div>
          <div class="trainee-info">
            ${trainee ? `
              <div class="field"><span class="field-label">Name:</span> ${trainee.name}</div>
              <div class="field"><span class="field-label">PNO:</span> ${trainee.pno}</div>
              <div class="field"><span class="field-label">Chest No:</span> ${trainee.chest_no}</div>
              <div class="field"><span class="field-label">Father's Name:</span> ${trainee.father_name}</div>
              <div class="field"><span class="field-label">Date of Birth:</span> ${format(new Date(trainee.date_of_birth), 'PP')}</div>
              <div class="field"><span class="field-label">Date of Joining:</span> ${format(new Date(trainee.date_of_joining), 'PP')}</div>
              <div class="field"><span class="field-label">Training Period:</span> ${format(new Date(trainee.arrival_date), 'PP')} to ${format(new Date(trainee.departure_date), 'PP')}</div>
              <div class="field"><span class="field-label">Current Posting:</span> ${trainee.current_posting_district}</div>
              <div class="field"><span class="field-label">Mobile:</span> ${trainee.mobile_number}</div>
              <div class="field"><span class="field-label">Education:</span> ${trainee.education}</div>
              <div class="field"><span class="field-label">Blood Group:</span> ${trainee.blood_group}</div>
              <div class="field"><span class="field-label">Nominee:</span> ${trainee.nominee}</div>
              <div class="field"><span class="field-label">Home Address:</span> ${trainee.home_address}</div>
            ` : ''}
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 12px;">
            <p>This document was generated on ${format(new Date(), 'PP')} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      toast.error("Failed to open print window. Please check your pop-up blocker settings.");
    }
  };

  const handleDownload = () => {
    if (!trainee) return;

    const headers = [
      "PNO", "Chest No", "Name", "Father's Name", "Arrival Date",
      "Departure Date", "Current Posting District", "Mobile Number",
      "Education", "Date of Birth", "Date of Joining", "Blood Group",
      "Nominee", "Home Address"
    ];
    
    const values = [
      trainee.pno,
      trainee.chest_no,
      trainee.name,
      trainee.father_name,
      format(new Date(trainee.arrival_date), 'PP'),
      format(new Date(trainee.departure_date), 'PP'),
      trainee.current_posting_district,
      trainee.mobile_number,
      trainee.education,
      format(new Date(trainee.date_of_birth), 'PP'),
      format(new Date(trainee.date_of_joining), 'PP'),
      trainee.blood_group,
      trainee.nominee,
      trainee.home_address
    ];
    
    const csvContent = headers.join(',') + '\n' + values.join(',');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trainee_${trainee.pno}_${trainee.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success("CSV file downloaded successfully");
  };

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
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="print-button"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button 
                variant="outline"
                className="download-button"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
              <Button 
                onClick={() => navigate(`/edit-trainee/${trainee?.id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Trainee
              </Button>
            </div>
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
