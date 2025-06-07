
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2, Printer, Download, Archive } from "lucide-react";
import { Link } from "react-router-dom";
import { Trainee } from "@/types/trainee";
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
import { deleteTrainee } from "@/services/traineeApi";
import { toast } from "sonner";
import { createPrintContent, exportTraineesToExcel } from "@/utils/export";
import { handlePrint } from "@/utils/export";
import { useFetchAttendance } from "@/components/attendance/hooks/useFetchAttendance";

interface TraineeActionsProps {
  trainee: Trainee;
  onDelete?: () => void;
  onArchive?: () => void;
}

export function TraineeActions({ trainee, onDelete, onArchive }: TraineeActionsProps) {
  const { isHindi } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const { fetchAttendanceRecords, fetchLeaveRecords } = useFetchAttendance();

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const { error } = await deleteTrainee(trainee.id);
      if (error) throw error;
      
      toast.success(isHindi ? 
        'प्रशिक्षानिवेशी सफलतापूर्वक हटा दिया गया' : 
        'Trainee deleted successfully'
      );
      
      if (onDelete) onDelete();
    } catch (error) {
      console.error('Error deleting trainee:', error);
      toast.error(isHindi ? 
        'प्रशिक्षानिवेशी हटाने में विफल' : 
        'Failed to delete trainee'
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handlePrintTrainee = async () => {
    setIsPrinting(true);
    try {
      // Fetch attendance and leave data for this trainee
      const [attendanceRecords, leaveRecords] = await Promise.all([
        fetchAttendanceRecords(trainee.id, 'trainee'),
        fetchLeaveRecords(trainee.id, 'trainee')
      ]);

      const content = await createPrintContent([trainee], isHindi, attendanceRecords, leaveRecords);
      const success = handlePrint(content);
      
      if (success) {
        toast.success(isHindi ? 'प्रिंट तैयार है' : 'Print ready');
      } else {
        toast.error(isHindi ? 'प्रिंट विंडो खोलने में विफल' : 'Failed to open print window');
      }
    } catch (error) {
      console.error('Error printing trainee:', error);
      toast.error(isHindi ? 'प्रिंट करने में त्रुटि' : 'Error printing trainee');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleExport = () => {
    try {
      exportTraineesToExcel([trainee], isHindi);
      toast.success(isHindi ? 'एक्सेल फ़ाइल डाउनलोड हो गई' : 'Excel file downloaded');
    } catch (error) {
      console.error('Error exporting trainee:', error);
      toast.error(isHindi ? 'एक्सपोर्ट करने में त्रुटि' : 'Error exporting trainee');
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
          <DropdownMenuItem asChild>
            <Link to={`/trainees/${trainee.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'देखें' : 'View'}
              </span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to={`/trainees/${trainee.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'संपादित करें' : 'Edit'}
              </span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handlePrintTrainee} disabled={isPrinting}>
            <Printer className="mr-2 h-4 w-4" />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isPrinting ? (isHindi ? 'प्रिंट हो रहा है...' : 'Printing...') : (isHindi ? 'प्रिंट करें' : 'Print')}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'एक्सपोर्ट करें' : 'Export'}
            </span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {onArchive && (
            <DropdownMenuItem 
              onClick={onArchive}
              className="text-orange-600 hover:text-orange-800"
            >
              <Archive className="mr-2 h-4 w-4" />
              <span className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'आर्काइव करें' : 'Archive'}
              </span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'हटाएं' : 'Delete'}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'हटाने की पुष्टि करें' : 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 
                `क्या आप वाकई "${trainee.name}" को हटाना चाहते हैं? यह क्रिया को पूर्ववत नहीं किया जा सकता।` :
                `Are you sure you want to delete "${trainee.name}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 
                (isHindi ? 'हटा रहे हैं...' : 'Deleting...') : 
                (isHindi ? 'हटाएं' : 'Delete')
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
