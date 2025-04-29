
import { Trainee } from "@/types/trainee";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { prepareTextForLanguage } from "@/utils/textUtils";

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
    } else {
      toast.success(t("printingTrainees", `Printing trainee details`));
    }
  };

  const handleDownloadTrainee = () => {
    // Process trainee name for file name to handle special characters
    const safeName = trainee.name.replace(/[^a-zA-Z0-9_\-]/g, '_');
    
    const csvContent = createCSVContent([trainee], i18n.language, t);
    handleDownload(
      csvContent, 
      `trainee_${trainee.pno}_${safeName}.csv`
    );
    toast.success(t("csvDownloaded", "CSV file downloaded successfully"));
  };

  return {
    handlePrintTrainee,
    handleDownloadTrainee
  };
}
