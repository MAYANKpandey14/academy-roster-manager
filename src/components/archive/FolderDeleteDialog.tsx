
import { useState, useEffect } from "react";
import { ArchiveFolder } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Folder, FileText, AlertTriangle } from "lucide-react";

interface FolderDeleteDialogProps {
  folder: ArchiveFolder | null;
  allFolders: ArchiveFolder[];
  recordType: 'staff' | 'trainee';
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export function FolderDeleteDialog({ 
  folder, 
  allFolders, 
  recordType, 
  isOpen, 
  onClose, 
  onDeleted 
}: FolderDeleteDialogProps) {
  const { isHindi } = useLanguage();
  const [selectedTargetFolder, setSelectedTargetFolder] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Get other folders (excluding the current one)
  const otherFolders = allFolders.filter(f => f.id !== folder?.id);

  useEffect(() => {
    if (isOpen) {
      setSelectedTargetFolder("");
    }
  }, [isOpen]);

  const handleDelete = async () => {
    if (!folder) return;
    
    setIsDeleting(true);
    try {
      // If folder has items and no target folder selected, show error
      if (folder.item_count > 0 && !selectedTargetFolder) {
        toast.error(isHindi ? 'कृपया लक्ष्य फ़ोल्डर चुनें' : 'Please select a target folder');
        return;
      }

      const { error } = await supabase.functions.invoke('delete-archive-folder', {
        body: { 
          folderId: folder.id,
          targetFolderId: selectedTargetFolder || null,
          recordType
        }
      });
      
      if (error) throw error;
      
      toast.success(isHindi ? 'फ़ोल्डर सफलतापूर्वक हटा दिया गया' : 'Folder deleted successfully');
      onDeleted();
      onClose();
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error(isHindi ? 'फ़ोल्डर हटाने में त्रुटि' : 'Error deleting folder');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!folder) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {isHindi ? 'फ़ोल्डर हटाएं' : 'Delete Folder'}
          </AlertDialogTitle>
          <AlertDialogDescription className={`text-left ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'आप निम्नलिखित फ़ोल्डर को हटाने वाले हैं:' : 'You are about to delete the following folder:'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Folder Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Folder className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{folder.folder_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="h-3 w-3" />
              <span>{folder.item_count} {isHindi ? 'आइटम' : 'items'}</span>
            </div>
            {folder.description && (
              <p className="text-sm text-gray-600 mt-1">{folder.description}</p>
            )}
          </div>

          {/* Move contents if folder has items */}
          {folder.item_count > 0 && (
            <div className="space-y-2">
              <Label className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'आइटमों को इस फ़ोल्डर में ले जाएं:' : 'Move items to this folder:'}
              </Label>
              <Select value={selectedTargetFolder} onValueChange={setSelectedTargetFolder}>
                <SelectTrigger>
                  <SelectValue placeholder={isHindi ? 'फ़ोल्डर चुनें' : 'Select folder'} />
                </SelectTrigger>
                <SelectContent>
                  {otherFolders.map((targetFolder) => (
                    <SelectItem key={targetFolder.id} value={targetFolder.id}>
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-orange-500" />
                        <span>{targetFolder.folder_name}</span>
                        <span className="text-sm text-gray-500">
                          ({targetFolder.item_count} {isHindi ? 'आइटम' : 'items'})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {otherFolders.length === 0 && (
                <p className={`text-sm text-amber-600 ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? 'कोई अन्य फ़ोल्डर उपलब्ध नहीं है। सभी आइटम हटा दिए जाएंगे।' : 'No other folders available. All items will be deleted.'}
                </p>
              )}
            </div>
          )}

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className={`text-sm text-red-700 ${isHindi ? 'font-hindi' : ''}`}>
              {folder.item_count === 0 
                ? (isHindi ? 'यह क्रिया पूर्ववत नहीं की जा सकती।' : 'This action cannot be undone.')
                : selectedTargetFolder 
                  ? (isHindi ? 'फ़ोल्डर हटा दिया जाएगा और आइटम चयनित फ़ोल्डर में स्थानांतरित हो जाएंगे।' : 'The folder will be deleted and items will be moved to the selected folder.')
                  : (isHindi ? 'फ़ोल्डर और सभी आइटम स्थायी रूप से हटा दिए जाएंगे।' : 'The folder and all items will be permanently deleted.')
              }
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            disabled={isDeleting || (folder.item_count > 0 && !selectedTargetFolder && otherFolders.length > 0)}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting 
              ? (isHindi ? 'हटाया जा रहा है...' : 'Deleting...') 
              : (isHindi ? 'हटाएं' : 'Delete')
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
