
import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw, FileSpreadsheet } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent, createCSVContent, exportTraineesToExcel } from "@/utils/export";
import { handlePrint, handleDownload } from "@/utils/export";
import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeTableActionsProps {
  trainees: Trainee[];
  sortedTrainees: Trainee[];
  sortBy: string;
  isLoading: boolean;
  selectedCount: number;
  getSelectedTrainees: () => Trainee[];
  onRefresh?: () => void;
}

export function TraineeTableActions({ 
  trainees, 
  sortedTrainees,
  sortBy,
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
  
  function handleExcelExport() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक प्रशिक्षानिवेशी चुनें" : "Please select at least one trainee to export");
      return;
    }
    
    const success = exportTraineesToExcel(selectedTrainees, isHindi, true);
    
    if (success) {
      toast.success(isHindi ? "एक्सेल फ़ाइल सफलतापूर्वक डाउनलोड हो गई" : `Excel file with ${selectedTrainees.length} trainees downloaded successfully`);
    } else {
      toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
    }
  }
  
  function handleAllExcelExport() {
    // Export all trainees (sorted if sorting is applied)
    const dataToExport = sortBy !== "none" ? sortedTrainees : trainees;
    
    const success = exportTraineesToExcel(dataToExport, isHindi, true, sortBy);
    
    if (success) {
      toast.success(isHindi ? "सभी प्रशिक्षानिवेशी एक्सेल फ़ाइल में डाउनलोड हो गए" : `All trainees exported to Excel successfully`);
    } else {
      toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
    }
  }

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="animate-slide-in"
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
        className="print-button animate-slide-in"
        disabled={isLoading || selectedCount === 0}
      >
        <Printer className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "चयनित प्रिंट करें" : "Print Selected"}{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </span>}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExcelExport}
        className="excel-button animate-slide-in"
        disabled={isLoading || selectedCount === 0}
      >
        <FileSpreadsheet className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "चयनित एक्सेल डाउनलोड करें" : "Export Selected"}{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </span>}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleAllExcelExport}
        className="excel-all-button animate-slide-in"
        disabled={isLoading}
      >
        <FileSpreadsheet className="h-4 w-4" />
        {!isMobile && <span className={`ml-2 ${isHindi ? 'font-mangal' : ''}`}>
          {isHindi ? "सभी एक्सेल डाउनलोड करें" : "Export All"}
        </span>}
      </Button>
    </div>
  );
}
