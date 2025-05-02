import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { getTrainees } from "@/services/api";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { TraineeHeader } from "@/components/trainee/view/TraineeHeader";
import { TraineeDetailsSection } from "@/components/trainee/view/TraineeDetailsSection";
import { TraineeLoadingState } from "@/components/trainee/view/TraineeLoadingState";
import { TraineeNotFound } from "@/components/trainee/view/TraineeNotFound";
import { useTraineePrintService } from "@/components/trainee/view/TraineePrintService";
import { useLanguage } from "@/contexts/LanguageContext";

const ViewTrainee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isHindi } = useLanguage();
  
  // Apply language inputs hook
  useLanguageInputs();

  // Initialize print service with null trainee
  const { handlePrintTrainee, handleDownloadTrainee, handleExcelExport } = useTraineePrintService(trainee);

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
            toast.error(isHindi ? "प्रशिक्षु नहीं मिला" : "Trainee not found");
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Error fetching trainee:", error);
        toast.error(isHindi ? "प्रशिक्षु डेटा लोड नहीं हो सका" : "Failed to load trainee data");
        navigate("/");
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
            onPrint={handlePrintTrainee} 
            onDownload={handleDownloadTrainee}
            onExcelExport={handleExcelExport}
          />
          
          <TraineeDetailsSection trainee={trainee} />
        </div>
      </main>
    </div>
  );
};

export default ViewTrainee;
