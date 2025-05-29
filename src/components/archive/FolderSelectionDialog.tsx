
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface ArchiveFolder {
  id: string;
  folder_name: string;
  created_at: string;
  item_count: number;
  description?: string;
}

interface FolderSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderId: string) => void;
  selectedCount: number;
  recordType: 'staff' | 'trainee';
}

export function FolderSelectionDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  recordType
}: FolderSelectionDialogProps) {
  const { isHindi } = useLanguage();
  const [folders, setFolders] = useState<ArchiveFolder[]>([]);
  const [selection, setSelection] = useState<'new' | 'existing'>('new');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchFolders();
      generateDefaultFolderName();
    }
  }, [isOpen]);

  const fetchFolders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No active session");
      }

      const { data, error } = await supabase.functions.invoke('manage-archive-folders', {
        body: { action: 'list' },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) throw error;
      setFolders(data.folders || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error(isHindi ? 'फोल्डर लोड करने में त्रुटि' : 'Error loading folders');
    }
  };

  const generateDefaultFolderName = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const typePrefix = recordType === 'staff' ? 'Staff' : 'Trainee';
    setNewFolderName(`${typePrefix}_Archive_${today}`);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      let folderId = selectedFolderId;

      if (selection === 'new') {
        if (!newFolderName.trim()) {
          toast.error(isHindi ? 'फोल्डर नाम आवश्यक है' : 'Folder name is required');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
          throw new Error("No active session");
        }

        const { data, error } = await supabase.functions.invoke('manage-archive-folders', {
          body: { 
            action: 'create', 
            folderName: newFolderName.trim(),
            description: `Created for ${recordType} archiving`
          },
          headers: { Authorization: `Bearer ${session.access_token}` }
        });

        if (error) throw error;
        folderId = data.folder.id;
      }

      if (!folderId) {
        toast.error(isHindi ? 'कृपया एक फोल्डर चुनें' : 'Please select a folder');
        return;
      }

      onConfirm(folderId);
    } catch (error) {
      console.error('Error creating/selecting folder:', error);
      toast.error(isHindi ? 'फोल्डर चयन में त्रुटि' : 'Error selecting folder');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredFolders = folders.filter(folder =>
    folder.folder_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'आर्काइव गंतव्य चुनें' : 'Choose Archive Destination'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className={`text-sm text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 
              `${selectedCount} ${recordType === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} रिकॉर्ड आर्काइव करने के लिए तैयार` :
              `Ready to archive ${selectedCount} ${recordType} record${selectedCount > 1 ? 's' : ''}`
            }
          </div>

          <RadioGroup value={selection} onValueChange={(value: 'new' | 'existing') => setSelection(value)}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? 'नया फोल्डर बनाएं' : 'Create New Folder'}
                </Label>
              </div>
              
              {selection === 'new' && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="folderName" className={isHindi ? 'font-hindi' : ''}>
                    {isHindi ? 'फोल्डर नाम:' : 'Folder Name:'}
                  </Label>
                  <Input
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder={isHindi ? 'फोल्डर नाम दर्ज करें' : 'Enter folder name'}
                  />
                  <div className={`text-xs text-gray-500 ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi ? 'सुझाव: ' : 'Suggestions: '}
                    <button
                      type="button"
                      className="text-blue-500 hover:underline"
                      onClick={() => setNewFolderName(`Archive_${format(new Date(), 'yyyy-MM-dd')}`)}
                    >
                      Archive_{format(new Date(), 'yyyy-MM-dd')}
                    </button>
                  </div>
                </div>
              )}

              {folders.length > 0 && (
                <>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing" />
                    <Label htmlFor="existing" className={isHindi ? 'font-hindi' : ''}>
                      {isHindi ? 'मौजूदा फोल्डर का उपयोग करें' : 'Use Existing Folder'}
                    </Label>
                  </div>
                  
                  {selection === 'existing' && (
                    <div className="ml-6 space-y-3">
                      <Input
                        placeholder={isHindi ? 'फोल्डर खोजें...' : 'Search folders...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      
                      <div className="max-h-48 overflow-y-auto border rounded-md">
                        {filteredFolders.map((folder) => (
                          <div
                            key={folder.id}
                            className={`p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                              selectedFolderId === folder.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                            onClick={() => setSelectedFolderId(folder.id)}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{folder.folder_name}</div>
                                <div className="text-sm text-gray-500">
                                  {folder.item_count} {isHindi ? 'आइटम' : 'items'} • {format(new Date(folder.created_at), 'dd/MM/yyyy')}
                                </div>
                              </div>
                              <input
                                type="radio"
                                checked={selectedFolderId === folder.id}
                                onChange={() => setSelectedFolderId(folder.id)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        ))}
                        
                        {filteredFolders.length === 0 && searchTerm && (
                          <div className={`p-3 text-center text-gray-500 ${isHindi ? 'font-hindi' : ''}`}>
                            {isHindi ? 'कोई फोल्डर नहीं मिला' : 'No folders found'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (isHindi ? 'प्रतीक्षा करें...' : 'Please wait...') : (isHindi ? 'पुष्टि करें' : 'Confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
