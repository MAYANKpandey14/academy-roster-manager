
import { 
  MoreHorizontal, 
  Eye, 
  Printer, 
  Download, 
  ArchiveRestore
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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
  onUnarchive
}: ArchiveRowActionsProps) {
  const { isHindi } = useLanguage();
  const [isUnarchiveDialogOpen, setIsUnarchiveDialogOpen] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);

  const handleUnarchiveClick = () => {
    setIsUnarchiveDialogOpen(true);
  };

  const handleConfirmUnarchive = async () => {
    try {
      setIsUnarchiving(true);
      await onUnarchive(record);
      toast.success(isHindi ? 
        `${type === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} सफलतापूर्वक अनआर्काइव कर दिया गया` : 
        `${type === 'staff' ? 'Staff' : 'Trainee'} unarchived successfully`
      );
      setIsUnarchiveDialogOpen(false);
    } catch (error) {
      console.error("Error unarchiving:", error);
      toast.error(isHindi ? 
        `${type === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} अनआर्काइव करने में विफल` : 
        `Failed to unarchive ${type}`
      );
    } finally {
      setIsUnarchiving(false);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(record)}>
            <Eye className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "देखें" : "View"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onPrint(record)}>
            <Printer className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "प्रिंट करें" : "Print"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport(record)}>
            <Download className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "एक्सेल डाउनलोड करें" : "Export Excel"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleUnarchiveClick} className="text-blue-600 focus:text-blue-600">
            <ArchiveRestore className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "अनआर्काइव करें" : "Unarchive"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isUnarchiveDialogOpen} onOpenChange={setIsUnarchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 
                `${type === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} अनआर्काइव करने की पुष्टि करें` : 
                `Confirm Unarchive ${type === 'staff' ? 'Staff' : 'Trainee'}`}
            </AlertDialogTitle>
            <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
              {isHindi
                ? `क्या आप वाकई "${record.name}" को अनआर्काइव करना चाहते हैं? यह उन्हें सक्रिय सूची में वापस लाएगा।`
                : `Are you sure you want to unarchive "${record.name}"? This will restore them to the active list.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnarchiving} className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmUnarchive}
              disabled={isUnarchiving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUnarchiving ? 
                (isHindi ? "अनआर्काइव कर रहा है..." : "Unarchiving...") : 
                (isHindi ? "अनआर्काइव करें" : "Unarchive")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
