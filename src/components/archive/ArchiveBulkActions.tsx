
import { Button } from "@/components/ui/button";
import { Printer, Download, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { toast } from "sonner";

interface ArchiveBulkActionsProps {
  selectedRecords: (ArchivedStaff | ArchivedTrainee)[];
  type: 'staff' | 'trainee';
  onPrintSelected: (records: (ArchivedStaff | ArchivedTrainee)[]) => void;
  onExportSelected: (records: (ArchivedStaff | ArchivedTrainee)[]) => void;
  onClearSelection: () => void;
}

export function ArchiveBulkActions({ 
  selectedRecords, 
  type,
  onPrintSelected,
  onExportSelected,
  onClearSelection
}: ArchiveBulkActionsProps) {
  const { isHindi } = useLanguage();

  if (selectedRecords.length === 0) return null;

  const handlePrintSelected = () => {
    try {
      onPrintSelected(selectedRecords);
      toast.success(isHindi ? 
        `${selectedRecords.length} रिकॉर्ड प्रिंट करने के लिए तैयार` : 
        `Preparing ${selectedRecords.length} records for printing`
      );
    } catch (error) {
      toast.error(isHindi ? 'प्रिंट करने में त्रुटि' : 'Error printing records');
    }
  };

  const handleExportSelected = () => {
    try {
      onExportSelected(selectedRecords);
      toast.success(isHindi ? 
        `${selectedRecords.length} रिकॉर्ड एक्सेल में डाउनलोड हो रहे हैं` : 
        `Downloading ${selectedRecords.length} records as Excel`
      );
    } catch (error) {
      toast.error(isHindi ? 'एक्सपोर्ट में त्रुटि' : 'Error exporting records');
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium text-blue-800 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? 
            `${selectedRecords.length} ${type === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} चयनित` :
            `${selectedRecords.length} ${type === 'staff' ? 'staff' : 'trainee'}${selectedRecords.length > 1 ? 's' : ''} selected`
          }
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-blue-600 hover:text-blue-800"
        >
          {isHindi ? 'चयन साफ़ करें' : 'Clear selection'}
        </Button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrintSelected}
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <Printer className="h-4 w-4 mr-2" />
          <span className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'चयनित प्रिंट करें' : 'Print Selected'}
          </span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportSelected}
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <Download className="h-4 w-4 mr-2" />
          <span className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'चयनित एक्सपोर्ट करें' : 'Export Selected'}
          </span>
        </Button>
      </div>
    </div>
  );
}
