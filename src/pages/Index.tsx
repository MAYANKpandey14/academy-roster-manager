
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TraineeTable } from "@/components/trainee/TraineeTable";
import { TraineeFilters } from "@/components/trainee/TraineeFilters";
import { Button } from "@/components/ui/button";
import { Trainee } from "@/types/trainee";
import { Plus, RefreshCcw, Download, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getTrainees, filterTrainees } from "@/services/api";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [filteredTrainees, setFilteredTrainees] = useState<Trainee[]>([]);
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

  // Search trainees based on criteria
  const handleSearch = async (pno: string, chestNo: string, rollNo: string) => {
    setIsLoading(true);
    
    try {
      // We'll use the existing filterTrainees function but adapt it for our new search parameters
      const { data, error } = await filterTrainees(pno, chestNo, rollNo);
      
      if (error) {
        toast.error("Failed to search trainees");
        console.error(error);
        return;
      }
      
      if (data) {
        setFilteredTrainees(data);
        // If there are results, you might want to highlight this to the user
        if (data.length === 0) {
          toast.info("No trainees found matching your search criteria");
        } else {
          toast.success(`Found ${data.length} trainee(s) matching your criteria`);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred while searching");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTrainees();
    toast.success("Data refreshed");
  };

  const handlePrintAll = () => {
    printAllTrainees(filteredTrainees);
  };

  const handleDownloadAll = () => {
    downloadAllTraineesCSV(filteredTrainees);
  };

  const printAllTrainees = (traineesToPrint: Trainee[]) => {
    if (traineesToPrint.length === 0) {
      toast.error("No trainees to print");
      return;
    }
    
    // Create a print-friendly HTML document with table layout
    let printContent = `
      <html>
        <head>
          <title>Trainees List</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>RTC POLICE LINE, MORADABAD</h1>
            <p>TRAINEES LIST</p>
          </div>
          
          <table border="1" cellpadding="5" cellspacing="0">
            <thead>
              <tr>
                <th>PNO</th>
                <th>Name</th>
                <th>Father's Name</th>
                <th>District</th>
                <th>Arrival Date</th>
                <th>Departure Date</th>
                <th>Mobile</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    traineesToPrint.forEach(trainee => {
      printContent += `
        <tr>
          <td>${trainee.pno}</td>
          <td>${trainee.name}</td>
          <td>${trainee.father_name}</td>
          <td>${trainee.current_posting_district}</td>
          <td>${new Date(trainee.arrival_date).toLocaleDateString()}</td>
          <td>${new Date(trainee.departure_date).toLocaleDateString()}</td>
          <td>${trainee.mobile_number}</td>
        </tr>
      `;
    });
    
    printContent += `
            </tbody>
          </table>
          
          <div style="text-align: center; margin-top: 30px; font-size: 12px;">
            <p>This document was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
        </body>
      </html>
    `;
    
    // Create a new window to print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      // Wait for content to load before printing
      printWindow.setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    } else {
      toast.error("Failed to open print window. Please check your pop-up blocker settings.");
    }
  };

  const downloadAllTraineesCSV = (traineesToDownload: Trainee[]) => {
    if (traineesToDownload.length === 0) {
      toast.error("No trainees to download");
      return;
    }
    
    // Headers for the CSV file
    const headers = [
      "PNO", "Name", "Father's Name", "District", 
      "Arrival Date", "Departure Date", "Mobile"
    ];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    traineesToDownload.forEach(trainee => {
      const row = [
        trainee.pno,
        trainee.name,
        trainee.father_name,
        trainee.current_posting_district,
        new Date(trainee.arrival_date).toLocaleDateString(),
        new Date(trainee.departure_date).toLocaleDateString(),
        trainee.mobile_number
      ];
      
      // Escape any commas within the data fields
      const escapedRow = row.map(field => {
        const stringField = String(field);
        return stringField.includes(',') ? `"${stringField}"` : stringField;
      });
      
      csvContent += escapedRow.join(',') + '\n';
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `trainees_list_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`CSV file with ${traineesToDownload.length} trainees downloaded successfully`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">RTC POLICE LINE, MORADABAD</h1>
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
          onSearch={handleSearch}
          disabled={isLoading}
        />
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
          <div className="flex justify-end space-x-2 mb-4">
            <Button
              variant="outline"
              onClick={handlePrintAll}
              disabled={isLoading || filteredTrainees.length === 0}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print All
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadAll}
              disabled={isLoading || filteredTrainees.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Download All
            </Button>
          </div>
          
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
