
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
import { archiveTrainee } from "@/services/archiveApi";
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
  onArchive?: () => void;
}

export function TraineeActions({ trainee, onDelete, onArchive }: TraineeActionsProps) {
  const navigate = useNavigate();
  const { isHindi } = useLanguage();
  const { handlePrint, handleExcelExport } = useTraineePrintService(trainee);
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
      const { error } = await deleteTrainee(trainee.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? "प्रशिक्षु सफलतापूर्वक हटा दिया गया" : "Trainee deleted successfully");
      setIsDeleteDialogOpen(false);
      
      if (onDelete) onDelete();
    } catch (error) {
      console.error("Error deleting trainee:", error);
      toast.error(isHindi ? "प्रशिक्षु हटाने में विफल" : "Failed to delete trainee");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmArchive = async () => {
    try {
      setIsArchiving(true);
      const { error } = await archiveTrainee(trainee.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? "प्रशिक्षु सफलतापूर्वक आर्काइव कर दिया गया" : "Trainee archived successfully");
      setIsArchiveDialogOpen(false);
      
      if (onArchive) onArchive();
    } catch (error) {
      console.error("Error archiving trainee:", error);
      toast.error(isHindi ? "प्रशिक्षु आर्काइव करने में विफल" : "Failed to archive trainee");
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
              {isHindi ? "प्रशिक्षु आर्काइव करने की पुष्टि करें" : "Confirm Archive Trainee"}
            </AlertDialogTitle>
            <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
              {isHindi
                ? `क्या आप वाकई प्रशिक्षु "${trainee.name}" को आर्काइव करना चाहते हैं? यह उन्हें सक्रिय सूची से हटा देगा।`
                : `Are you sure you want to archive trainee "${trainee.name}"? This will remove them from the active list.`}
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
