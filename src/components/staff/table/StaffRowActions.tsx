
import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Eye, Archive, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Staff } from "@/types/staff";
import { useNavigate } from "react-router-dom";
import { useFetchAttendance } from "@/components/attendance/hooks/useFetchAttendance";
import { createStaffPrintContent } from "@/utils/export/staffPrintUtils";
import { handlePrint } from "@/utils/export/printUtils";
import { DeleteConfirmationDialog } from "@/components/common/DeleteConfirmationDialog";
import { deleteStaff } from "@/services/staffApi";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface StaffRowActionsProps {
  staff: Staff;
  onArchive?: (staff: Staff) => void;
  onDelete?: () => void;
  onExport?: (staff: Staff) => void;
}

export const StaffRowActions = ({ staff, onArchive, onDelete, onExport }: StaffRowActionsProps) => {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch attendance and leave data for printing
  const { data: attendanceData } = useFetchAttendance(staff.id, "staff");

  const handleView = () => {
    navigate(`/staff/${staff.id}`);
  };

  const handleEdit = () => {
    navigate(`/staff/${staff.id}/edit`);
  };

  const handlePrintAction = async () => {
    if (attendanceData) {
      const printContent = await createStaffPrintContent(
        [staff], 
        false, 
        attendanceData.attendance, 
        attendanceData.leave
      );
      handlePrint(printContent);
    } else {
      // Print without attendance data if not loaded
      const printContent = await createStaffPrintContent([staff], false, [], []);
      handlePrint(printContent);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const { error } = await deleteStaff(staff.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? 
        'स्टाफ सफलतापूर्वक डिलीट कर दिया गया' : 
        'Staff deleted successfully'
      );
      
      setShowDeleteDialog(false);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(isHindi ? 
        'स्टाफ डिलीट करने में विफल' : 
        'Failed to delete staff'
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
            <DropdownMenuItem onClick={() => onExport(staff)}>
              <Download className="mr-2 h-4 w-4" />
              {isHindi ? "एक्सपोर्ट करें" : "Export"}
            </DropdownMenuItem>
          )}
          {onArchive && (
            <DropdownMenuItem onClick={() => onArchive(staff)}>
              <Archive className="mr-2 h-4 w-4" />
              {isHindi ? "आर्काइव करें" : "Archive"}
            </DropdownMenuItem>
          )}
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
        itemName={staff.name}
        isLoading={isDeleting}
      />
    </>
  );
};
