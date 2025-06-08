
import { MoreHorizontal, Eye, Printer, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { useArchivePrintService } from "./hooks/useArchivePrintService";

interface ArchiveRowActionsProps {
  record: ArchivedStaff | ArchivedTrainee;
  type: 'staff' | 'trainee';
  onView: (record: ArchivedStaff | ArchivedTrainee) => void;
  onPrint: (record: ArchivedStaff | ArchivedTrainee) => void;
  onExport: (record: ArchivedStaff | ArchivedTrainee) => void;
  onUnarchive: (record: ArchivedStaff | ArchivedTrainee) => void;
}

export function ArchiveRowActions({
  record,
  type,
  onView,
  onPrint,
  onExport,
  onUnarchive,
}: ArchiveRowActionsProps) {
  const { isHindi } = useLanguage();
  const { handlePrintArchiveRecord, isLoading } = useArchivePrintService();

  const handlePrintClick = async () => {
    await handlePrintArchiveRecord(record, type);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg z-50">
        <DropdownMenuLabel className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? 'कार्य' : 'Actions'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onView(record)} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'देखें' : 'View'}
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handlePrintClick} 
          disabled={isLoading}
          className="cursor-pointer"
        >
          <Printer className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-hindi' : ''}>
            {isLoading 
              ? (isHindi ? 'प्रिंट हो रहा है...' : 'Printing...') 
              : (isHindi ? 'प्रिंट करें' : 'Print')
            }
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => onExport(record)} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'निर्यात करें' : 'Export'}
          </span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => onUnarchive(record)} className="cursor-pointer">
          <RotateCcw className="mr-2 h-4 w-4" />
          <span className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'अनआर्काइव करें' : 'Unarchive'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
