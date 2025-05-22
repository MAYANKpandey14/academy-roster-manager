
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { TraineeHeader } from "@/components/trainee/view/TraineeHeader";
import { TraineeDetailsSection } from "@/components/trainee/view/TraineeDetailsSection";
import { TraineeLoadingState } from "@/components/trainee/view/TraineeLoadingState";
import { TraineeNotFound } from "@/components/trainee/view/TraineeNotFound";
import { useTraineePrintService } from "@/components/trainee/view/TraineePrintService";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const ViewTrainee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isHindi } = useLanguage();
  
  // Apply language inputs hook
  useLanguageInputs();
  
  // Initialize print service with the trainee data
  const { handlePrint, handleExcelExport } = useTraineePrintService(trainee);

  useEffect(() => {
    const fetchTrainee = async () => {
      if (!id) {
        toast.error(isHindi ? "प्रशिक्षु आईडी नहीं मिली" : "Trainee ID not found");
        navigate("/trainees");
        return;
      }
      
      setIsLoading(true);
      
      try {
        console.log("Fetching trainee with ID:", id);
        
        // Direct Supabase query to fetch a single trainee by ID
        const { data, error } = await supabase
          .from('trainees')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Error fetching trainee:", error);
          throw error;
        }
        
        if (data) {
          console.log("Trainee data fetched:", data);
          setTrainee(data as Trainee);
        } else {
          console.error("No trainee found with ID:", id);
          toast.error(isHindi ? "प्रशिक्षु नहीं मिला" : "Trainee not found");
          navigate("/trainees");
        }
      } catch (error) {
        console.error("Error fetching trainee:", error);
        toast.error(isHindi ? "प्रशिक्षु डेटा लोड नहीं हो सका" : "Failed to load trainee data");
        navigate("/trainees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainee();
  }, [id, navigate, isHindi]);

  if (isLoading) {
    return <TraineeLoadingState />;
  }

  if (!trainee) {
    return <TraineeNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <TraineeHeader 
            trainee={trainee} 
            onPrint={handlePrint} 
            onDownload={handleExcelExport} 
            onExcelExport={handleExcelExport}
          />
          
          <TraineeDetailsSection trainee={trainee} />
        </div>
      </main>
    </div>
  );
};

export default ViewTrainee;
