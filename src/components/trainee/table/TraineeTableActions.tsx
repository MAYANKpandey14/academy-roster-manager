import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { isHindi } = useLanguage();
  
  function handlePrintAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक प्रशिक्षानिवेशी चुनें" : "Please select at least one trainee to print");
      return;
    }
    
    const content = createPrintContent(selectedTrainees, isHindi);
    const success = handlePrint(content);
    
    if (success) {
      toast.success(isHindi ? "प्रशिक्षानिवेशी प्रिंट हो रहा है..." : `Printing ${selectedTrainees.length} trainee(s)`);
    } else {
      toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.");
    }
  }

  function handleDownloadAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक प्रशिक्षानिवेशी चुनें" : "Please select at least one trainee to download");
      return;
    }
    
    const content = createCSVContent(selectedTrainees, isHindi ? 'hi' : 'en');
    handleDownload(content, `selected_trainees_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(isHindi ? "प्रशिक्षानिवेशी CSV फ़ाइल सफलतापूर्वक डाउनलोड हो गई है..." : `CSV file with ${selectedTrainees.length} trainees downloaded successfully`);
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
          {!isMobile && <span className={`ml-2 dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "अपडेट करें" : "Refresh"}
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
        {!isMobile && <span className={`ml-2 dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "प्रिंट" : "Print"} {selectedCount > 0 ? `${isHindi ? "चुने गए" : "Selected"} (${selectedCount})` : ""}
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
        {!isMobile && <span className={`ml-2 dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? "डाउनलोड" : "Download"} {selectedCount > 0 ? `${isHindi ? "चुने गए" : "Selected"} (${selectedCount})` : ""}
        </span>}
      </Button>
    </div>
  );
}
