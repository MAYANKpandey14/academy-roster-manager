
import { useEffect, useState } from "react";
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
  
  // Apply language inputs hook - make sure it runs on language change
  useLanguageInputs();

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
    };

    fetchTrainee();
  }, [id, navigate, t]);

  // Force re-render when language changes
  useEffect(() => {
    // This empty dependency will trigger a re-render when i18n.language changes
  }, [i18n.language]);

  if (isLoading) {
    return <TraineeLoadingState />;
  }

  if (!trainee) {
    return <TraineeNotFound />;
  }

  const { handlePrintTrainee, handleDownloadTrainee } = useTraineePrintService({ trainee });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <TraineeHeader 
            trainee={trainee} 
            onPrint={handlePrintTrainee} 
            onDownload={handleDownloadTrainee}
          />
          
          <TraineeDetailsSection trainee={trainee} />
        </div>
      </main>
    </div>
  );
};

export default ViewTrainee;
