
import { 
  MoreHorizontal, 
  Edit,
  Eye,
  Download,
  Printer,
  FileSpreadsheet,
  Trash2
} from "lucide-react";
import { Trainee } from "@/types/trainee";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useTraineePrintService } from "@/components/trainee/view/TraineePrintService";
import { useLanguage } from "@/contexts/LanguageContext";
import { deleteTrainee } from "@/services/traineeApi";
import { toast } from "sonner";
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

interface TraineeActionsProps {
  trainee: Trainee;
  onDelete?: () => void;
}

export function TraineeActions({ trainee, onDelete }: TraineeActionsProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const { handlePrint, handleExcelExport } = useTraineePrintService(trainee);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const { error } = await deleteTrainee(trainee.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? "प्रशिक्षु सफलतापूर्वक हटा दिया गया" : "Trainee deleted successfully");
      setIsDeleteDialogOpen(false);
      
      // Call the onDelete callback to refresh the list
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting trainee:", error);
      toast.error(isHindi ? "प्रशिक्षु हटाने में विफल" : "Failed to delete trainee");
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
          <DropdownMenuItem onClick={() => navigate(`/trainees/${trainee.id}`)}>
            <Eye className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "देखें" : "View"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate(`/trainees/${trainee.id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "संपादित करें" : "Edit"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "प्रिंट करें" : "Print"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExcelExport}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> 
            <span className={`dynamic-text ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? "एक्सेल" : "Excel"}
            </span>
          </DropdownMenuItem>
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
              {isHindi ? "प्रशिक्षु हटाने की पुष्टि करें" : "Confirm Delete Trainee"}
            </AlertDialogTitle>
            <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
              {isHindi
                ? `क्या आप वाकई प्रशिक्षु "${trainee.name}" को हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।`
                : `Are you sure you want to delete trainee "${trainee.name}"? This action cannot be undone.`}
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
