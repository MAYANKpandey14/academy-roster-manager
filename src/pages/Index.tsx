
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
import { useIsMobile } from "@/hooks/use-mobile";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/exportUtils";

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [filteredTrainees, setFilteredTrainees] = useState<Trainee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSearch = async (pno: string, chestNo: string, rollNo: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await filterTrainees(pno, chestNo, rollNo);
      
      if (error) {
        toast.error("Failed to search trainees");
        console.error(error);
        return;
      }
      
      if (data) {
        setFilteredTrainees(data);
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
    if (filteredTrainees.length === 0) {
      toast.error("No trainees to print");
      return;
    }
    const content = createPrintContent(filteredTrainees);
    handlePrint(content);
    toast.success(`Printing ${filteredTrainees.length} trainees`);
  };

  const handleDownloadAll = () => {
    if (filteredTrainees.length === 0) {
      toast.error("No trainees to download");
      return;
    }
    const content = createCSVContent(filteredTrainees);
    handleDownload(content, `trainees_export_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`CSV file with ${filteredTrainees.length} trainees downloaded successfully`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto py-6 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">RTC POLICE LINE, MORADABAD</h1>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCcw className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Refresh</span>}
            </Button>
            <Button onClick={() => navigate('/add-trainee')} disabled={isLoading}>
              <Plus className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Add New Trainee</span>}
            </Button>
          </div>
        </div>
        
        <TraineeFilters
          onSearch={handleSearch}
          disabled={isLoading}
        />
        
        <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm mt-6">
          <div className="flex flex-wrap gap-2 justify-end mb-4">
            <Button
              variant="outline"
              onClick={handlePrintAll}
              disabled={isLoading || filteredTrainees.length === 0}
              className="print-all-button"
            >
              <Printer className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Print All</span>}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadAll}
              disabled={isLoading || filteredTrainees.length === 0}
              className="download-all-button"
            >
              <Download className="h-4 w-4" />
              {!isMobile && <span className="ml-2">Download All</span>}
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
