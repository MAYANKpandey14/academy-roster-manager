
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { getTrainees } from "@/services/api";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { TraineeHeader } from "@/components/trainee/view/TraineeHeader";
import { TraineeDetailsSection } from "@/components/trainee/view/TraineeDetailsSection";
import { TraineeLoadingState } from "@/components/trainee/view/TraineeLoadingState";
import { TraineeNotFound } from "@/components/trainee/view/TraineeNotFound";
import { useTraineePrintService } from "@/components/trainee/view/TraineePrintService";

const ViewTrainee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState<Trainee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  
  // Apply language inputs hook
  useLanguageInputs();

  // Fetch trainee data using useCallback to avoid recreation on every render
  const fetchTrainee = useCallback(async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await getTrainees();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const traineeData = data.find(t => t.id === id);
        
        if (traineeData) {
          setTrainee(traineeData);
        } else {
          toast.error(t("traineeNotFound", "Trainee not found"));
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error fetching trainee:", error);
      toast.error(t("failedToFetchTrainee", "Failed to load trainee data"));
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate, t]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchTrainee();
  }, [fetchTrainee]);

  // Handle language changes
  useEffect(() => {
    // Re-fetch or re-render when language changes
    if (trainee) {
      // Just trigger a re-render when language changes if trainee is already loaded
      setTrainee({...trainee});
    }
  }, [i18n.language, trainee]);

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
            onPrint={() => {
              // Access functions from the hook inside render to avoid React error #310
              const { handlePrintTrainee } = useTraineePrintService({ trainee });
              handlePrintTrainee();
            }}
            onDownload={() => {
              // Access functions from the hook inside render to avoid React error #310
              const { handleDownloadTrainee } = useTraineePrintService({ trainee });
              handleDownloadTrainee();
            }}
          />
          
          <TraineeDetailsSection trainee={trainee} />
        </div>
      </main>
    </div>
  );
};

export default ViewTrainee;
