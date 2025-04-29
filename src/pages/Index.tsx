
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
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";

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

  const handleSearch = async (pno: string, chestNo: string, rollNo: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await filterTrainees(pno, chestNo, rollNo);
      
      if (error) {
        toast.error("Failed to search trainees");
        console.error(error);
        return false;
      }
      
      if (data) {
        setFilteredTrainees(data);
        if (data.length === 0) {
          toast.info("No trainees found matching your search criteria");
          return false;
        } else {
          toast.success(`Found ${data.length} trainee(s) matching your criteria`);
          return true;
        }
      }
      return false;
    } catch (error) {
      toast.error("An unexpected error occurred while searching");
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchTrainees();
    toast.success("डेटा रीफ्रेश किया गया");
  };

  const handlePrintAll = () => {
    if (filteredTrainees.length === 0) {
      toast.error("प्रिंट करने के लिए कोई प्रशिक्षु नहीं है");
      return;
    }
    
    // Create consolidated print content for all trainees
    let allContent = "";
    filteredTrainees.forEach(trainee => {
      allContent += createPrintContent(trainee);
    });
    
    handlePrint(allContent);
    toast.success(`${filteredTrainees.length} प्रशिक्षुओं का प्रिंट हो रहा है`);
  };

  const handleDownloadAll = () => {
    if (filteredTrainees.length === 0) {
      toast.error("डाउनलोड करने के लिए कोई प्रशिक्षु नहीं है");
      return;
    }
    
    // Create consolidated CSV content
    let allContent = "";
    // Get CSV header from first trainee
    allContent = createCSVContent(filteredTrainees[0]).split('\n')[0] + '\n';
    // Add all rows without duplicating headers
    filteredTrainees.forEach(trainee => {
      const content = createCSVContent(trainee);
      const rows = content.split('\n').slice(1).join('\n');
      allContent += rows + (rows ? '\n' : '');
    });
    
    handleDownload(allContent, `trainees_export_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`${filteredTrainees.length} प्रशिक्षुओं वाली CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई`);
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
          onShowAll={fetchTrainees}  // Added the missing onShowAll prop
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
