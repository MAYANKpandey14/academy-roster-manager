
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
import { useState, useCallback, useRef, useEffect } from "react";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const unmountedRef = useRef(false);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      unmountedRef.current = true;
    };
  }, []);
  
  // Handle dropdown click safely with cleanup
  const handleDropdownItemClick = useCallback((action: () => void) => {
    // Close dropdown first to prevent UI issues
    return () => {
      try {
        action();
      } catch (error) {
        console.error("Error in dropdown action:", error);
        toast.error(isHindi ? "कार्रवाई प्रक्रिया में त्रुटि" : "Error processing action");
      }
    };
  }, [isHindi]);
  
  // Safe state update function
  const safeSetState = useCallback(<T,>(setter: React.Dispatch<React.SetStateAction<T>>) => {
    return (value: React.SetStateAction<T>) => {
      if (!unmountedRef.current) {
        setter(value);
      }
    };
  }, []);
  
  const handleDelete = useCallback(async () => {
    if (isDeleting) return; // Prevent multiple clicks
    
    safeSetState(setIsDeleting)(true);
    
    try {
      const { error } = await deleteStaff(staff.id);
      
      if (error) {
        throw error;
      }
      
      toast.success(isHindi ? "स्टाफ सदस्य सफलतापूर्वक हटा दिया गया" : "Staff member deleted successfully");
      
      // Close dialog before refresh to prevent UI freeze
      safeSetState(setIsDeleteDialogOpen)(false);
      
      // Delay refresh for proper UI handling
      if (onRefresh && !unmountedRef.current) {
        // Wrap refresh in a promise and defer execution
        await new Promise(resolve => {
          setTimeout(() => {
            if (!unmountedRef.current) {
              onRefresh();
            }
            resolve(true);
          }, 100);
        });
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(isHindi ? "स्टाफ सदस्य हटाने में विफल" : "Failed to delete staff member");
    } finally {
      if (!unmountedRef.current) {
        safeSetState(setIsDeleting)(false);
        // Ensure dialog is closed in case of an error
        safeSetState(setIsDeleteDialogOpen)(false);
      }
    }
  }, [staff.id, isHindi, onRefresh, isDeleting, safeSetState]);
  
  // Controlled close handler
  const handleOpenChange = useCallback((open: boolean) => {
    if (!isDeleting) {
      safeSetState(setIsDeleteDialogOpen)(open);
    }
  }, [isDeleting, safeSetState]);

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
          <DropdownMenuItem onClick={handleDropdownItemClick(() => navigate(`/staff/${staff.id}`))}>
            <Eye className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "देखें" : "View"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDropdownItemClick(() => navigate(`/staff/${staff.id}/edit`))}>
            <Edit className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "संपादित करें" : "Edit"}
            </span>
          </DropdownMenuItem>
          {handlePrintAction && (
            <DropdownMenuItem onClick={handleDropdownItemClick(() => handlePrintAction(staff.id))}>
              <Printer className="mr-2 h-4 w-4" />
              <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "प्रिंट करें" : "Print"}
              </span>
            </DropdownMenuItem>
          )}
          {handleExcelExport && (
            <DropdownMenuItem onClick={handleDropdownItemClick(() => handleExcelExport(staff))}>
              <FileSpreadsheet className="mr-2 h-4 w-4" /> 
              <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? "एक्सेल" : "Excel"}
              </span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={handleDropdownItemClick(() => safeSetState(setIsDeleteDialogOpen)(true))}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "हटाएं" : "Delete"}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent className="z-50">
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
            <AlertDialogCancel disabled={isDeleting}>
              {isHindi ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }} 
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? 
                (isHindi ? "हटा रहा है..." : "Deleting...") : 
                (isHindi ? "हटाएं" : "Delete")
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
