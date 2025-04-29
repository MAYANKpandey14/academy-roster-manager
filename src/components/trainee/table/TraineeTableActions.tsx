
import { Download, Printer, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";
import { ActionButton } from "@/components/ui/action-button";
import { ButtonGroup } from "@/components/ui/button-group";

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
  function handlePrintAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error("कृपया प्रिंट के लिए कम से कम एक प्रशिक्षु का चयन करें");
      return;
    }
    
    // Create consolidated print content for all selected trainees
    const allContent = createPrintContent(selectedTrainees);
    
    const success = handlePrint(allContent);
    
    if (success) {
      toast.success(`${selectedTrainees.length} प्रशिक्षु(ओं) का प्रिंट हो रहा है`);
    } else {
      toast.error("प्रिंट विंडो खोलने में विफल। कृपया अपनी पॉप-अप ब्लॉकर सेटिंग्स जांचें।");
    }
  }

  function handleDownloadAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error("कृपया डाउनलोड के लिए कम से कम एक प्रशिक्षु का चयन करें");
      return;
    }
    
    // Create consolidated CSV content for all selected trainees
    const csvContent = createCSVContent(selectedTrainees);
    
    handleDownload(csvContent, `selected_trainees_${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`${selectedTrainees.length} प्रशिक्षुओं वाली CSV फ़ाइल सफलतापूर्वक डाउनलोड की गई`);
  }

  return (
    <ButtonGroup className="mb-3">
      {onRefresh && (
        <ActionButton
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          icon={<RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />}
          showTextOnMobile={false}
        >
          रिफ्रेश
        </ActionButton>
      )}
      
      <ActionButton
        variant="outline"
        size="sm"
        onClick={handlePrintAction}
        className="print-button"
        disabled={isLoading || selectedCount === 0}
        icon={<Printer className="h-4 w-4" />}
        showTextOnMobile={false}
      >
        प्रिंट करें {selectedCount > 0 ? `(${selectedCount})` : ""}
      </ActionButton>
      
      <ActionButton
        variant="outline"
        size="sm"
        onClick={handleDownloadAction}
        className="download-button"
        disabled={isLoading || selectedCount === 0}
        icon={<Download className="h-4 w-4" />}
        showTextOnMobile={false}
      >
        डाउनलोड CSV {selectedCount > 0 ? `(${selectedCount})` : ""}
      </ActionButton>
    </ButtonGroup>
  );
}
