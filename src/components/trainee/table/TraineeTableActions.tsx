
import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";
import { useTranslation } from "react-i18next";

interface TraineeTableActionsProps {
  trainees: Trainee[];
  isLoading: boolean;
  selectedCount: number;
  getSelectedTrainees: () => Trainee[];
  onRefresh?: () => void;
}

export function TraineeTableActions({ 
  trainees, 
  isLoading, 
  selectedCount,
  getSelectedTrainees,
  onRefresh
}: TraineeTableActionsProps) {
  const isMobile = useIsMobile();
  const { t, i18n } = useTranslation();
  
  function handlePrintAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(t("selectTraineesToPrint", "कृपया प्रिंट के लिए कम से कम एक प्रशिक्षु का चयन करें"));
      return;
    }
    
    // Fix parameter count - remove t parameter
    const content = createPrintContent(selectedTrainees);
    const success = handlePrint(content);
    
    if (success) {
      toast.success(t("printingTrainees", `${selectedTrainees.length} प्रशिक्षु(ओं) का प्रिंट हो रहा है`));
    } else {
      toast.error(t("failedToPrint", "प्रिंट विंडो खोलने में विफल। कृपया अपनी पॉप-अप ब्लॉकर सेटिंग्स जांचें।"));
    }
  }

  function handleDownloadAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(t("selectTraineesToDownload", "कृपया डाउनलोड के लिए कम से कम एक प्रशिक्षु का चयन करें"));
      return;
    }
    
    // Fix parameter count - remove extra parameters
    const content = createCSVContent(selectedTrainees);
    handleDownload(content, `selected_trainees_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(t("traineeCSVDownloaded", `${selectedTrainees.length} प्रशिक्षुओं वाली CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई`));
  }

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {!isMobile && <span className={`ml-2 dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
            {t("refresh", "Refresh")}
          </span>}
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrintAction}
        className="print-button"
        disabled={isLoading || selectedCount === 0}
      >
        <Printer className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {t("print", "Print")} {selectedCount > 0 ? `${t("selected", "Selected")} (${selectedCount})` : ""}
        </span>}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadAction}
        className="download-button"
        disabled={isLoading || selectedCount === 0}
      >
        <Download className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 dynamic-text ${i18n.language === 'hi' ? 'krutidev-text' : ''}`}>
          {t("download", "Download")} {selectedCount > 0 ? `${t("selected", "Selected")} (${selectedCount})` : ""}
        </span>}
      </Button>
    </div>
  );
}
