
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ArchiveAllButtonProps {
  onArchiveAll: () => Promise<void>;
  isLoading: boolean;
  count: number;
  type: "staff" | "trainee";
}

export function ArchiveAllButton({ onArchiveAll, isLoading, count, type }: ArchiveAllButtonProps) {
  const { isHindi } = useLanguage();
  const isMobile = useIsMobile();
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchiveAll = async () => {
    try {
      setIsArchiving(true);
      await onArchiveAll();
    } finally {
      setIsArchiving(false);
    }
  };

  const typeLabel = type === "staff" 
    ? (isHindi ? "स्टाफ" : "Staff")
    : (isHindi ? "प्रशिक्षु" : "Trainees");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading || count === 0}
          className="archive-all-button animate-slide-in"
        >
          <Archive className="h-4 w-4" />
          {!isMobile && (
            <span className={`ml-2 ${isHindi ? 'font-mangal' : ''}`}>
              {isHindi ? `सभी ${typeLabel} आर्काइव करें` : `Archive All ${typeLabel}`} ({count})
            </span>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? `सभी ${typeLabel} आर्काइव करें` : `Archive All ${typeLabel}`}
          </AlertDialogTitle>
          <AlertDialogDescription className={isHindi ? 'font-hindi' : ''}>
            {isHindi
              ? `क्या आप वाकई सभी ${count} ${typeLabel} को आर्काइव करना चाहते हैं? यह उन्हें सक्रिय सूची से हटा देगा।`
              : `Are you sure you want to archive all ${count} ${typeLabel}? This will remove them from the active list.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isArchiving} className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? "रद्द करें" : "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleArchiveAll}
            disabled={isArchiving}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isArchiving ? 
              (isHindi ? "आर्काइव कर रहा है..." : "Archiving...") : 
              (isHindi ? "आर्काइव करें" : "Archive All")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
