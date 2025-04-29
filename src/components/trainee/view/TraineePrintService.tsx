
import { Trainee } from "@/types/trainee";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/exportUtils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export interface TraineePrintServiceProps {
  trainee: Trainee;
}

export function useTraineePrintService({ trainee }: TraineePrintServiceProps) {
  const { t, i18n } = useTranslation();

  const handlePrintTrainee = () => {
    const printContent = createPrintContent([trainee], i18n.language, t);
    const printSuccess = handlePrint(printContent);
    
    if (!printSuccess) {
      toast.error(t("failedToPrint", "Failed to open print window. Please check your pop-up blocker settings."));
    }
  };

  const handleDownloadTrainee = () => {
    const csvContent = createCSVContent([trainee], i18n.language, t);
    handleDownload(
      csvContent, 
      `trainee_${trainee.pno}_${trainee.name.replace(/\s+/g, '_')}.csv`
    );
    toast.success(t("csvDownloaded", "CSV file downloaded successfully"));
  };

  return {
    handlePrintTrainee,
    handleDownloadTrainee
  };
}
