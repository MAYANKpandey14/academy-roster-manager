
import { Staff } from "@/types/staff";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface StaffRowActionsProps {
  staff: Staff;
  handlePrintAction?: (staffId: string) => void;
  handleDownloadAction?: (staffId: string) => void;
  handleExcelExport?: (staff: Staff) => void;
  handleDelete?: (staffId: string) => void;
  onDeleteSuccess?: () => void;
}

export function StaffRowActions({ 
  staff, 
  handlePrintAction, 
  handleDownloadAction, 
  handleExcelExport,
  handleDelete,
  onDeleteSuccess
}: StaffRowActionsProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteStaff = async () => {
    if (!staff.id) return;
    
    try {
      setIsDeleting(true);
      
      // Delete the staff member from the database
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', staff.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? "स्टाफ सदस्य सफलतापूर्वक हटा दिया गया" : "Staff member deleted successfully");
      
      // Call the onDeleteSuccess callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(isHindi ? "स्टाफ सदस्य हटाने में त्रुटि हुई" : "Error deleting staff member");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="flex items-center">
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
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-700">
                <Trash2 className="mr-2 h-4 w-4" />
                <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? "हटाएं" : "Delete"}
                </span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "स्टाफ सदस्य हटाएं" : "Delete Staff Member"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {isHindi 
                    ? `क्या आप वाकई ${staff.name} (${staff.pno}) को हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।`
                    : `Are you sure you want to delete ${staff.name} (${staff.pno})? This action cannot be undone.`
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "रद्द करें" : "Cancel"}
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={deleteStaff} 
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  {isHindi ? "हटाएं" : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
