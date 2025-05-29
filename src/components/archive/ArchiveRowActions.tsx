
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Printer, Download, RotateCcw } from "lucide-react";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { unarchiveStaff, unarchiveTrainee } from "@/services/unarchiveApi";
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
  const [showUnarchiveDialog, setShowUnarchiveDialog] = useState(false);
  const [isUnarchiving, setIsUnarchiving] = useState(false);

  const handleUnarchive = async () => {
    setIsUnarchiving(true);
    try {
      let result;
      if (type === 'staff') {
        result = await unarchiveStaff(record.id);
      } else {
        result = await unarchiveTrainee(record.id);
      }

      if (result.error) {
        throw result.error;
      }

      toast.success(isHindi ? 
        `${type === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} सफलतापूर्वक बहाल किया गया` : 
        `${type === 'staff' ? 'Staff' : 'Trainee'} restored successfully`
      );
      
      onUnarchive(record);
    } catch (error) {
      console.error('Error unarchiving record:', error);
      toast.error(isHindi ? 
        'बहाल करने में त्रुटि' : 
        'Error restoring record'
      );
    } finally {
      setIsUnarchiving(false);
      setShowUnarchiveDialog(false);
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
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'देखें' : 'View'}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onPrint(record)}>
            <Printer className="mr-2 h-4 w-4" />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'प्रिंट करें' : 'Print'}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => onExport(record)}>
            <Download className="mr-2 h-4 w-4" />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'एक्सपोर्ट करें' : 'Export'}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowUnarchiveDialog(true)}
            className="text-green-600 hover:text-green-800"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'बहाल करें' : 'Unarchive'}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showUnarchiveDialog} onOpenChange={setShowUnarchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'बहाली की पुष्टि करें' : 'Confirm Restore'}
            </AlertDialogTitle>
            <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 
                `क्या आप वाकई इस ${type === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} रिकॉर्ड को सक्रिय स्थिति में बहाल करना चाहते हैं? यह रिकॉर्ड को मुख्य ${type === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} तालिका में वापस ले जाएगा।` :
                `Are you sure you want to restore this ${type} record to active status? This will move the record back to the main ${type} table.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnarchiving}>
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUnarchive}
              disabled={isUnarchiving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isUnarchiving ? 
                (isHindi ? 'बहाल कर रहे हैं...' : 'Restoring...') : 
                (isHindi ? 'बहाल करें' : 'Restore')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
