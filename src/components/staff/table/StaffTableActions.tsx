
import { Button } from "@/components/ui/button";
import { Download, Printer, RefreshCw, FileSpreadsheet } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Staff } from "@/types/staff";
import { toast } from "sonner";
import { createStaffPrintContent, createStaffCSVContent } from "@/utils/staffExportUtils";
import { handlePrint, handleDownload, exportStaffToExcel } from "@/utils/export";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArchiveAllButton } from "@/components/archive/ArchiveAllButton";
import { archiveAllStaff } from "@/services/archiveApi";

interface StaffTableActionsProps {
  staff: Staff[];
  isLoading: boolean;
  selectedCount: number;
  getSelectedStaff: () => Staff[];
  onRefresh?: () => void;
}

export function StaffTableActions({ 
  staff, 
  isLoading, 
  selectedCount,
  getSelectedStaff,
  onRefresh
}: StaffTableActionsProps) {
  const isMobile = useIsMobile();
  const { isHindi } = useLanguage();
  
  async function handlePrintAction() {
    const selectedStaff = getSelectedStaff();
    
    if (selectedStaff.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक स्टाफ सदस्य चुनें" : "Please select at least one staff member to print");
      return;
    }
    
    try {
      const content = await createStaffPrintContent(selectedStaff, isHindi);
      const success = handlePrint(content);
      
      if (success) {
        toast.success(isHindi ? "स्टाफ प्रिंट हो रहा है..." : `Printing ${selectedStaff.length} staff member(s)`);
      } else {
        toast.error(isHindi ? "प्रिंट विंडो खोलने में विफल" : "Failed to open print window. Please check your pop-up blocker settings.");
      }
    } catch (error) {
      console.error("Error creating print content:", error);
      toast.error(isHindi ? "प्रिंट सामग्री तैयार करने में त्रुटि" : "Error preparing print content");
    }
  }

  function handleExcelExport() {
    const selectedStaff = getSelectedStaff();
    
    if (selectedStaff.length === 0) {
      toast.error(isHindi ? "कृपया कम से कम एक स्टाफ सदस्य चुनें" : "Please select at least one staff member to export");
      return;
    }
    
    const success = exportStaffToExcel(selectedStaff, isHindi);
    
    if (success) {
      toast.success(isHindi ? "एक्सेल फ़ाइल सफलतापूर्वक डाउनलोड हो गई" : `Excel file with ${selectedStaff.length} staff members downloaded successfully`);
    } else {
      toast.error(isHindi ? "एक्सेल फ़ाइल डाउनलोड करने में त्रुटि" : "Error downloading Excel file");
    }
  }

  const handleArchiveAll = async () => {
    const staffIds = staff.map(s => s.id);
    
    try {
      const { error } = await archiveAllStaff(staffIds);
      
      if (error) throw error;
      
      toast.success(isHindi ? "सभी स्टाफ सफलतापूर्वक आर्काइव कर दिए गए" : "All staff archived successfully");
      
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error archiving all staff:", error);
      toast.error(isHindi ? "सभी स्टाफ आर्काइव करने में विफल" : "Failed to archive all staff");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-end">
      <ArchiveAllButton
        onArchiveAll={handleArchiveAll}
        isLoading={isLoading}
        count={staff.length}
        type="staff"
      />
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
          {isHindi ? "एक्सेल डाउनलोड करें" : "Download Excel"}{selectedCount > 0 ? ` (${selectedCount})` : ''}
        </span>}
      </Button>
    </div>
  );
}
