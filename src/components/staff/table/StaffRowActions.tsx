
import { Staff } from "@/types/staff";
import { 
  MoreHorizontal, 
  Edit,
  Eye,
  Download,
  Printer,
  FileSpreadsheet,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
import { deleteStaff } from "@/services/staffApi";
import { toast } from "sonner";

export interface StaffRowActionsProps {
  staff: Staff;
  handlePrintAction?: (staffId: string) => void;
  handleDownloadAction?: (staffId: string) => void;
  handleExcelExport?: (staff: Staff) => void;
  onDelete?: () => void;
}

export function StaffRowActions({ 
  staff, 
  handlePrintAction, 
  handleDownloadAction, 
  handleExcelExport,
  onDelete
}: StaffRowActionsProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await deleteStaff(staff.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? "स्टाफ सफलतापूर्वक हटा दिया गया" : "Staff deleted successfully");
      setIsDeleteDialogOpen(false);
      
      // Call the onDelete callback to refresh the list
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(isHindi ? "स्टाफ हटाने में विफल" : "Failed to delete staff");
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
          <DropdownMenuItem onClick={() => navigate(`/staff/${staff.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "देखें" : "View"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/staff/${staff.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "संपादित करें" : "Edit"}
            </span>
          </DropdownMenuItem>
          {handlePrintAction && (
            <DropdownMenuItem onClick={() => handlePrintAction(staff.id)}>
              <Printer className="mr-2 h-4 w-4" />
              <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "प्रिंट करें" : "Print"}
              </span>
            </DropdownMenuItem>
          )}
          {handleExcelExport && (
            <DropdownMenuItem onClick={() => handleExcelExport(staff)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> 
              <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "एक्सेल" : "Excel"}
              </span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "हटाएं" : "Delete"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "स्टाफ हटाने की पुष्टि करें" : "Confirm Delete Staff"}
            </AlertDialogTitle>
            <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
              {isHindi
                ? `क्या आप वाकई स्टाफ सदस्य "${staff.name}" को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`
                : `Are you sure you want to delete staff member "${staff.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 
                (isHindi ? "हटा रहा है..." : "Deleting...") : 
                (isHindi ? "हटाएं" : "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
