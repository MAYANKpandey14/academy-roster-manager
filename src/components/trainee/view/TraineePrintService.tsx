
import { Trainee } from "@/types/trainee";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/exportUtils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { prepareTextForLanguage } from "@/utils/textUtils";
import { useLanguage } from "@/contexts/LanguageContext";

export interface TraineePrintServiceProps {
  trainee: Trainee;
}

export function useTraineePrintService({ trainee }: TraineePrintServiceProps) {
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();

  const handlePrintTrainee = () => {
    const printContent = createPrintContent([trainee], currentLanguage, t);
    const printSuccess = handlePrint(printContent);
    
    if (!printSuccess) {
      toast.error(t("failedToPrint", "Failed to open print window. Please check your pop-up blocker settings."));
    } else {
      toast.success(t("printingTrainees", `Printing trainee details`));
    }
  };

  const handleDownloadTrainee = () => {
    const csvContent = createCSVContent([trainee], currentLanguage, t);
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
