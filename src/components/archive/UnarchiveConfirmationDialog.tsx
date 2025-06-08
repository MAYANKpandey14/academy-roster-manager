
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";

interface UnarchiveConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  record: ArchivedStaff | ArchivedTrainee | null;
  type: 'staff' | 'trainee';
  isLoading?: boolean;
}

export function UnarchiveConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  record,
  type,
  isLoading = false
}: UnarchiveConfirmationDialogProps) {
  const { isHindi } = useLanguage();

  if (!record) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
            <RotateCcw className="h-5 w-5" />
            {isHindi ? 'अनआर्काइव की पुष्टि करें' : 'Confirm Unarchive'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p className={`text-sm text-amber-800 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi 
                  ? 'यह रिकॉर्ड आर्काइव से हटाकर सक्रिय सूची में वापस जोड़ दिया जाएगा।'
                  : 'This record will be removed from the archive and restored to the active list.'
                }
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="font-medium">
              {isHindi ? 'रिकॉर्ड विवरण:' : 'Record Details:'}
            </div>
            <div className="text-sm space-y-1">
              <div><strong>PNO:</strong> {record.pno}</div>
              <div><strong>{isHindi ? 'नाम:' : 'Name:'}</strong> {record.name}</div>
              <div><strong>{isHindi ? 'रैंक:' : 'Rank:'}</strong> {record.rank}</div>
              {type === 'trainee' && 'chest_no' in record && (
                <div><strong>{isHindi ? 'चेस्ट नंबर:' : 'Chest No:'}</strong> {record.chest_no}</div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </Button>
          
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            {isLoading 
              ? (isHindi ? 'अनआर्काइव कर रहे हैं...' : 'Unarchiving...') 
              : (isHindi ? 'अनआर्काइव करें' : 'Unarchive')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
