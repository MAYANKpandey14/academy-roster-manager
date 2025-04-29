
import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent, createCSVContent, handlePrint, handleDownload } from "@/utils/export";

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
    <div className="flex flex-wrap gap-2 justify-end">
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {!isMobile && <span className="ml-2">
            रिफ्रेश
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
        {!isMobile && <span className="ml-2">
          प्रिंट करें {selectedCount > 0 ? `चयनित (${selectedCount})` : ""}
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
        {!isMobile && <span className="ml-2">
          डाउनलोड CSV {selectedCount > 0 ? `चयनित (${selectedCount})` : ""}
        </span>}
      </Button>
    </div>
  );
}
