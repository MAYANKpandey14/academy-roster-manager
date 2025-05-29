
import { useState } from "react";
import { Trainee } from "@/types/trainee";
import { TraineeActions } from "../TraineeActions";
import { ArchiveConfirmationDialog } from "@/components/archive/ArchiveConfirmationDialog";
import { archiveTrainee } from "@/services/archiveApi";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface TraineeRowActionsProps {
  trainee: Trainee;
  onDelete?: () => void;
  onArchiveSuccess?: () => void;
}

export function TraineeRowActions({ trainee, onDelete, onArchiveSuccess }: TraineeRowActionsProps) {
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const { isHindi } = useLanguage();

  const handleArchive = () => {
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
      setShowArchiveDialog(false);
    } catch (error) {
      console.error("Error archiving trainee:", error);
      toast.error(isHindi ? 
        'प्रशिक्षु आर्काइव करने में विफल' : 
        'Failed to archive trainee'
      );
    }
  };

  return (
    <>
      <TraineeActions 
        trainee={trainee} 
        onDelete={onDelete}
        onArchive={handleArchive}
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
}
