
import { Staff } from "@/types/staff";
import { 
  MoreHorizontal, 
  Edit,
  Eye,
  Download,
  Printer,
  FileSpreadsheet,
  Trash2,
  Archive
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
import { archiveStaff } from "@/services/archiveApi";
import { toast } from "sonner";

export interface StaffRowActionsProps {
  staff: Staff;
  handlePrintAction?: (staffId: string) => void;
  handleDownloadAction?: (staffId: string) => void;
  handleExcelExport?: (staff: Staff) => void;
  onDelete?: () => void;
  onArchive?: () => void;
}

export function StaffRowActions({ 
  staff, 
  handlePrintAction, 
  handleDownloadAction, 
  handleExcelExport,
  onDelete,
  onArchive
}: StaffRowActionsProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleArchiveClick = () => {
    setIsArchiveDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await deleteStaff(staff.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? "स्टाफ सफलतापूर्वक हटा दिया गया" : "Staff deleted successfully");
      setIsDeleteDialogOpen(false);
      
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(isHindi ? "स्टाफ हटाने में विफल" : "Failed to delete staff");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmArchive = async () => {
    try {
      setIsArchiving(true);
      const { error } = await archiveStaff(staff.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? "स्टाफ सफलतापूर्वक आर्काइव कर दिया गया" : "Staff archived successfully");
      setIsArchiveDialogOpen(false);
      
      if (onArchive) onArchive();
    } catch (error) {
      console.error("Error archiving staff:", error);
      toast.error(isHindi ? "स्टाफ आर्काइव करने में विफल" : "Failed to archive staff");
    } finally {
      setIsArchiving(false);
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
          <DropdownMenuItem onClick={handleArchiveClick} className="text-orange-600 focus:text-orange-600">
            <Archive className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "आर्काइव करें" : "Archive"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "हटाएं" : "Delete"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "स्टाफ आर्काइव करने की पुष्टि करें" : "Confirm Archive Staff"}
            </AlertDialogTitle>
            <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
              {isHindi
                ? `क्या आप वाकई स्टाफ सदस्य "${staff.name}" को आर्काइव करना चाहते हैं? यह उन्हें सक्रिय सूची से हटा देगा।`
                : `Are you sure you want to archive staff member "${staff.name}"? This will remove them from the active list.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isArchiving} className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmArchive}
              disabled={isArchiving}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isArchiving ? 
                (isHindi ? "आर्काइव कर रहा है..." : "Archiving...") : 
                (isHindi ? "आर्काइव करें" : "Archive")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
