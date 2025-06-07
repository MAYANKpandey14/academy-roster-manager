
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
import { useLanguage } from "@/contexts/LanguageContext";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false
}: DeleteConfirmationDialogProps) {
  const { isHindi } = useLanguage();

  const defaultTitle = isHindi ? "क्या आप वाकई डिलीट करना चाहते हैं?" : "Are you sure you want to delete?";
  const defaultDescription = isHindi 
    ? `यह कार्रवाई पूर्ववत नहीं की जा सकती। ${itemName ? `"${itemName}"` : 'यह आइटम'} स्थायी रूप से डिलीट हो जाएगा।`
    : `This action cannot be undone. ${itemName ? `"${itemName}"` : 'This item'} will be permanently deleted.`;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={isHindi ? 'font-hindi' : ''}>
            {title || defaultTitle}
          </AlertDialogTitle>
          <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isLoading}
            className={isHindi ? 'font-hindi' : ''}
          >
            {isHindi ? "रद्द करें" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={`bg-destructive text-destructive-foreground hover:bg-destructive/90 ${isHindi ? 'font-hindi' : ''}`}
          >
            {isLoading ? (isHindi ? "डिलीट हो रहा है..." : "Deleting...") : (isHindi ? "डिलीट करें" : "Delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
