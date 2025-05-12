
import { Trainee } from "@/types/trainee";
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
import { TraineeActions } from "../TraineeActions";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trash2 } from "lucide-react";

interface TraineeRowActionsProps {
  trainee: Trainee;
  onDeleteSuccess?: () => void;
}

export function TraineeRowActions({ trainee, onDeleteSuccess }: TraineeRowActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isHindi } = useLanguage();

  const handleDelete = async () => {
    if (!trainee.id) return;
    
    try {
      setIsDeleting(true);
      
      // Delete the trainee from the database
      const { error } = await supabase
        .from('trainees')
        .delete()
        .eq('id', trainee.id);
      
      if (error) throw error;
      
      toast.success(isHindi ? "प्रशिक्षु सफलतापूर्वक हटा दिया गया" : "Trainee deleted successfully");
      
      // Call the onDeleteSuccess callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Error deleting trainee:", error);
      toast.error(isHindi ? "प्रशिक्षु हटाने में त्रुटि हुई" : "Error deleting trainee");
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="flex items-center">
      <TraineeActions trainee={trainee} />
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button 
            className="ml-2 text-red-500 hover:text-red-700 transition-colors"
            disabled={isDeleting}
            title={isHindi ? "हटाएं" : "Delete"}
          >
            <Trash2 size={16} />
            <span className="sr-only">{isHindi ? "हटाएं" : "Delete"}</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={isHindi ? "font-hindi" : ""}>
              {isHindi ? "क्या आप वाकई इस प्रशिक्षु को हटाना चाहते हैं?" : "Delete Trainee"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isHindi 
                ? `क्या आप वाकई ${trainee.name} (${trainee.pno}) को हटाना चाहते हैं? यह क्रिया अपरिवर्तनीय है।`
                : `Are you sure you want to delete ${trainee.name} (${trainee.pno})? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={isHindi ? "font-hindi" : ""}>
              {isHindi ? "रद्द करें" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              {isHindi ? "हटाएं" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
