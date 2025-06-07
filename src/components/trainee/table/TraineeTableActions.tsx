
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw, FileSpreadsheet, Archive, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { createPrintContent, createCSVContent, exportTraineesToExcel } from "@/utils/export";
import { handlePrint, handleDownload } from "@/utils/export";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArchiveConfirmationDialog } from "@/components/archive/ArchiveConfirmationDialog";
import { DeleteConfirmationDialog } from "@/components/common/DeleteConfirmationDialog";
import { archiveAllTrainees } from "@/services/archiveApi";
import { deleteTrainee } from "@/services/traineeApi";

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
  const [showArchiveAllDialog, setShowArchiveAllDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  async function handlePrintAction() {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक प्रशिक्षानिवेशी चुनें" : "Please select at least one trainee to print");
      return;
    }
    
    try {
      const content = await createPrintContent(selectedTrainees, isHindi);
      const success = handlePrint(content);
      
      if (success) {
        toast.success(isHindi ? "प्रशिक्षानिवेशी प्रिंट हो रहा है..." : `Printing ${selectedTrainees.length} trainee(s)`);
      } else {
        toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.");
      }
    } catch (error) {
      console.error("Error creating print content:", error);
      toast.error(isHindi ? "प्रिंट सामग्री तैयार करने में त्रुटि" : "Error preparing print content");
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
    const dataToExport = sortBy !== "none" ? sortedTrainees : trainees;
    
    const success = exportTraineesToExcel(dataToExport, isHindi, true, sortBy);
    
    if (success) {
      toast.success(isHindi ? "सभी प्रशिक्षानिवेशी एक्सेल फ़ाइल में डाउनलोड हो गए" : `All trainees exported to Excel successfully`);
    } else {
      toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
    }
  }

  const handleArchiveAll = async (folderId: string) => {
    const traineeIds = trainees.map(t => t.id);
    
    try {
      const { error } = await archiveAllTrainees(traineeIds, folderId);
      
      if (error) throw error;
      
      toast.success(isHindi ? "सभी प्रशिक्षानिवेशी सफलतापूर्वक आर्काइव कर दिए गए" : "All trainees archived successfully");
      
      if (onRefresh) onRefresh();
      setShowArchiveAllDialog(false);
    } catch (error) {
      console.error("Error archiving all trainees:", error);
      toast.error(isHindi ? "सभी प्रशिक्षानिवेशी आर्काइव करने में विफल" : "Failed to archive all trainees");
    }
  };

  const handleDeleteSelected = () => {
    const selectedTrainees = getSelectedTrainees();
    
    if (selectedTrainees.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक प्रशिक्षानिवेशी चुनें" : "Please select at least one trainee to delete");
      return;
    }
    
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    const selectedTrainees = getSelectedTrainees();
    setIsDeleting(true);
    
    try {
      // Delete each selected trainee
      for (const trainee of selectedTrainees) {
        const { error } = await deleteTrainee(trainee.id);
        if (error) throw error;
      }
      
      toast.success(isHindi ? 
        `${selectedTrainees.length} प्रशिक्षानिवेशी सफलतापूर्वक डिलीट कर दिए गए` : 
        `${selectedTrainees.length} trainee(s) deleted successfully`
      );
      
      setShowDeleteDialog(false);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting trainees:", error);
      toast.error(isHindi ? 
        'प्रशिक्षानिवेशी डिलीट करने में विफल' : 
        'Failed to delete trainee(s)'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowArchiveAllDialog(true)}
          disabled={isLoading || trainees.length === 0}
          className="animate-slide-in"
        >
          <Archive className="h-4 w-4" />
          {!isMobile && <span className={`ml-2 dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "सभी आर्काइव करें" : "Archive All"} ({trainees.length})
          </span>}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteSelected}
          disabled={isLoading || selectedCount === 0}
          className="animate-slide-in text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          {!isMobile && <span className={`ml-2 dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? "चयनित डिलीट करें" : "Delete Selected"} ({selectedCount})
          </span>}
        </Button>
        
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

      <ArchiveConfirmationDialog
        isOpen={showArchiveAllDialog}
        onClose={() => setShowArchiveAllDialog(false)}
        onConfirm={handleArchiveAll}
        selectedRecords={trainees}
        recordType="trainee"
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title={isHindi ? "चयनित प्रशिक्षानिवेशी डिलीट करें" : "Delete Selected Trainees"}
        description={isHindi ? 
          `क्या आप वाकई ${selectedCount} प्रशिक्षानिवेशी को डिलीट करना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।` :
          `Are you sure you want to delete ${selectedCount} trainee(s)? This action cannot be undone.`
        }
        isLoading={isDeleting}
      />
    </>
  );
}
