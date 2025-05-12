
import { Staff } from "@/types/staff";
import { 
  MoreHorizontal, 
  Edit,
  Eye,
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
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { deleteStaff } from "@/services/staffApi";

export interface StaffRowActionsProps {
  staff: Staff;
  handlePrintAction?: (staffId: string) => void;
  handleDownloadAction?: (staffId: string) => void;
  handleExcelExport?: (staff: Staff) => void;
  handleDelete?: (staffId: string) => void;
  onRefresh?: () => void;
}

export function StaffRowActions({ 
  staff, 
  handlePrintAction, 
  handleDownloadAction, 
  handleExcelExport,
  onRefresh
}: StaffRowActionsProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = async () => {
    try {
      const { error } = await deleteStaff(staff.id);
      
      if (error) {
        throw error;
      }
      
      toast.success(isHindi ? "स्टाफ सदस्य सफलतापूर्वक हटा दिया गया" : "Staff member deleted successfully");
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(isHindi ? "स्टाफ सदस्य हटाने में विफल" : "Failed to delete staff member");
    } finally {
      setIsDeleteDialogOpen(false);
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
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-500 focus:text-red-500">
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
            <AlertDialogTitle>
              {isHindi ? "क्या आप इस स्टाफ सदस्य को हटाना चाहते हैं?" : "Are you sure you want to delete this staff member?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isHindi 
                ? "यह क्रिया स्थायी है और इसे वापस नहीं किया जा सकता है। यह सभी संबंधित डेटा भी हटा देगा।"
                : "This action is permanent and cannot be undone. This will also remove all associated data."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isHindi ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              {isHindi ? "हटाएं" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
