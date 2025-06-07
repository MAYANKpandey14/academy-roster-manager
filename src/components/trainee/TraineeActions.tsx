
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye, Archive, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trainee } from "@/types/trainee";
import { useNavigate } from "react-router-dom";
import { useFetchAttendance } from "@/components/attendance/hooks/useFetchAttendance";
import { createPrintContent } from "@/utils/export/traineePrintUtils";
import { handlePrint } from "@/utils/export/printUtils";
import { DeleteConfirmationDialog } from "@/components/common/DeleteConfirmationDialog";
import { ArchiveConfirmationDialog } from "@/components/archive/ArchiveConfirmationDialog";
import { deleteTrainee } from "@/services/traineeApi";
import { archiveTrainee } from "@/services/archiveApi";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeActionsProps {
  trainee: Trainee;
  onArchive?: (trainee: Trainee) => void;
  onDelete?: () => void;
  onExport?: (trainee: Trainee) => void;
  onArchiveSuccess?: () => void;
}

export const TraineeActions = ({ 
  trainee, 
  onArchive, 
  onDelete, 
  onExport,
  onArchiveSuccess 
}: TraineeActionsProps) => {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch attendance and leave data for printing
  const { data: attendanceData } = useFetchAttendance(trainee.id, "trainee");

  const handleView = () => {
    navigate(`/trainees/${trainee.id}`);
  };

  const handleEdit = () => {
    navigate(`/trainees/${trainee.id}/edit`);
  };

  const handlePrintAction = async () => {
    if (attendanceData) {
      const printContent = await createPrintContent(
        [trainee], 
        false, 
        attendanceData.attendance, 
        attendanceData.leave
      );
      handlePrint(printContent);
    } else {
      // Print without attendance data if not loaded
      const printContent = await createPrintContent([trainee], false, [], []);
      handlePrint(printContent);
    }
  };

  const handleArchiveClick = () => {
    setShowArchiveDialog(true);
  };

  const handleArchiveConfirm = async (folderId: string) => {
    try {
      const { error } = await archiveTrainee(trainee.id, folderId);
      
      if (error) throw error;
      
      toast.success(isHindi ? 
        'प्रशिक्षु सफलतापूर्वक आर्काइव कर दिया गया' : 
        'Trainee archived successfully'
      );
      
      if (onArchiveSuccess) onArchiveSuccess();
      if (onArchive) onArchive(trainee);
      setShowArchiveDialog(false);
    } catch (error) {
      console.error("Error archiving trainee:", error);
      toast.error(isHindi ? 
        'प्रशिक्षु आर्काइव करने में विफल' : 
        'Failed to archive trainee'
      );
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const { error } = await deleteTrainee(trainee.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? 
        'प्रशिक्षु सफलतापूर्वक डिलीट कर दिया गया' : 
        'Trainee deleted successfully'
      );
      
      setShowDeleteDialog(false);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting trainee:", error);
      toast.error(isHindi ? 
        'प्रशिक्षु डिलीट करने में विफल' : 
        'Failed to delete trainee'
      );
    } finally {
      setIsDeleting(false);
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
          <DropdownMenuItem onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            {isHindi ? "देखें" : "View"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            {isHindi ? "संपादित करें" : "Edit"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrintAction}>
            <Printer className="mr-2 h-4 w-4" />
            {isHindi ? "प्रिंट करें" : "Print"}
          </DropdownMenuItem>
          {onExport && (
            <DropdownMenuItem onClick={() => onExport(trainee)}>
              <Download className="mr-2 h-4 w-4" />
              {isHindi ? "एक्सपोर्ट करें" : "Export"}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleArchiveClick}>
            <Archive className="mr-2 h-4 w-4" />
            {isHindi ? "आर्काइव करें" : "Archive"}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {isHindi ? "डिलीट करें" : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        itemName={trainee.name}
        isLoading={isDeleting}
      />

      <ArchiveConfirmationDialog
        isOpen={showArchiveDialog}
        onClose={() => setShowArchiveDialog(false)}
        onConfirm={handleArchiveConfirm}
        selectedRecords={[trainee]}
        recordType="trainee"
      />
    </>
  );
};
