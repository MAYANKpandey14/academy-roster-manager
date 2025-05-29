
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
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Staff } from "@/types/staff";
import { Trainee } from "@/types/trainee";

interface ArchiveFolder {
  id: string;
  folder_name: string;
  created_at: string;
  item_count: number;
  description?: string;
}

interface ArchiveConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderId: string) => void;
  selectedRecords: (Staff | Trainee)[];
  recordType: 'staff' | 'trainee' | 'mixed';
}

type DialogStep = 'selection' | 'folder' | 'confirmation';

export function ArchiveConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedRecords,
  recordType
}: ArchiveConfirmationDialogProps) {
  const { isHindi } = useLanguage();
  const [currentStep, setCurrentStep] = useState<DialogStep>('selection');
  const [folders, setFolders] = useState<ArchiveFolder[]>([]);
  const [selection, setSelection] = useState<'new' | 'existing'>('new');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<ArchiveFolder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('selection');
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
    const typePrefix = recordType === 'staff' ? 'Staff_Archive' : 
                      recordType === 'trainee' ? 'Trainee_Archive' : 
                      'Mixed_Archive';
    setNewFolderName(`${typePrefix}_${today}`);
  };

  const getStaffCount = () => selectedRecords.filter(r => 'rank' in r).length;
  const getTraineeCount = () => selectedRecords.filter(r => 'chest_no' in r).length;

  const handleSelectionContinue = () => {
    if (folders.length === 0) {
      setSelection('new');
    }
    setCurrentStep('folder');
  };

  const handleFolderContinue = async () => {
    if (selection === 'existing' && selectedFolderId) {
      const folder = folders.find(f => f.id === selectedFolderId);
      setSelectedFolder(folder || null);
    }
    setCurrentStep('confirmation');
  };

  const handleFinalConfirm = async () => {
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
      onClose();
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

  const renderSelectionStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className={isHindi ? 'font-hindi' : ''}>
          {isHindi ? 'आर्काइव की पुष्टि करें' : 'Confirm Archive'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className={`text-sm text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? 
            `आप ${selectedRecords.length} रिकॉर्ड आर्काइव करने जा रहे हैं:` :
            `You are about to archive ${selectedRecords.length} records:`
          }
        </div>
        
        <div className="bg-gray-50 p-3 rounded-lg">
          {getStaffCount() > 0 && (
            <div className={`text-sm ${isHindi ? 'font-hindi' : ''}`}>
              • {getStaffCount()} {isHindi ? 'स्टाफ रिकॉर्ड' : 'Staff records'}
            </div>
          )}
          {getTraineeCount() > 0 && (
            <div className={`text-sm ${isHindi ? 'font-hindi' : ''}`}>
              • {getTraineeCount()} {isHindi ? 'प्रशिक्षु रिकॉर्ड' : 'Trainee records'}
            </div>
          )}
        </div>
        
        <div className={`text-xs text-gray-500 ${isHindi ? 'font-hindi' : ''}`}>
          {isHindi ? 
            'यह उन्हें सक्रिय सूची से हटा देगा।' :
            'This will remove them from the active list.'
          }
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          {isHindi ? 'रद्द करें' : 'Cancel'}
        </Button>
        <Button onClick={handleSelectionContinue}>
          {isHindi ? 'जारी रखें' : 'Continue'}
        </Button>
      </DialogFooter>
    </>
  );

  const renderFolderStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className={isHindi ? 'font-hindi' : ''}>
          {folders.length === 0 ? 
            (isHindi ? 'आर्काइव फोल्डर बनाएं' : 'Create Archive Folder') :
            (isHindi ? 'आर्काइव गंतव्य चुनें' : 'Choose Archive Destination')
          }
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {folders.length === 0 ? (
          <div className="space-y-3">
            <div className={`text-sm text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'फोल्डर नाम:' : 'Folder Name:'}
            </div>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder={isHindi ? 'फोल्डर नाम दर्ज करें' : 'Enter folder name'}
            />
            <div className={`text-xs text-gray-500 ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'सुझाव:' : 'Suggestions:'}
              <div className="mt-1 space-y-1">
                <div>• Archive_{format(new Date(), 'yyyy-MM-dd')}</div>
                <div>• Staff_Archive_{format(new Date(), 'MMM_yyyy')}</div>
                <div>• Trainee_Records_{format(new Date(), 'yyyy')}</div>
              </div>
            </div>
          </div>
        ) : (
          <RadioGroup value={selection} onValueChange={(value: 'new' | 'existing') => setSelection(value)}>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? 'नया फोल्डर बनाएं' : 'Create New Folder'}
                </Label>
              </div>
              
              {selection === 'new' && (
                <div className="ml-6">
                  <Input
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder={isHindi ? 'फोल्डर नाम दर्ज करें' : 'Enter folder name'}
                  />
                </div>
              )}

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
                              ({folder.item_count} {isHindi ? 'आइटम' : 'items'})
                            </div>
                          </div>
                          <Checkbox
                            checked={selectedFolderId === folder.id}
                            onChange={() => setSelectedFolderId(folder.id)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => setCurrentStep('selection')}>
          {isHindi ? 'वापस' : 'Back'}
        </Button>
        <Button 
          onClick={handleFolderContinue}
          disabled={selection === 'new' ? !newFolderName.trim() : !selectedFolderId}
        >
          {isHindi ? 'जारी रखें' : 'Continue'}
        </Button>
      </DialogFooter>
    </>
  );

  const renderConfirmationStep = () => {
    const currentSize = selectedFolder?.item_count || 0;
    const newSize = currentSize + selectedRecords.length;
    const folderName = selection === 'new' ? newFolderName : selectedFolder?.folder_name;

    return (
      <>
        <DialogHeader>
          <DialogTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 'आर्काइव ऑपरेशन की पुष्टि करें' : 'Confirm Archive Operation'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? `आर्काइव करने के लिए आइटम: ${selectedRecords.length} रिकॉर्ड` : 
                        `Items to Archive: ${selectedRecords.length} records`}
            </div>
            
            {getStaffCount() > 0 && (
              <div className={`text-sm ${isHindi ? 'font-hindi' : ''}`}>
                • {getStaffCount()} {isHindi ? 'स्टाफ रिकॉर्ड' : 'Staff records'}
              </div>
            )}
            {getTraineeCount() > 0 && (
              <div className={`text-sm ${isHindi ? 'font-hindi' : ''}`}>
                • {getTraineeCount()} {isHindi ? 'प्रशिक्षु रिकॉर्ड' : 'Trainee records'}
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'गंतव्य:' : 'Destination:'} "{folderName}"
            </div>
            
            {selection === 'existing' && (
              <>
                <div className={`text-sm ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? `वर्तमान फोल्डर आकार: ${currentSize} आइटम` : 
                            `Current folder size: ${currentSize} items`}
                </div>
                <div className={`text-sm ${isHindi ? 'font-hindi' : ''}`}>
                  {isHindi ? `नया फोल्डर आकार: ${newSize} आइटम` : 
                            `New folder size: ${newSize} items`}
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setCurrentStep('folder')} disabled={isLoading}>
            {isHindi ? 'वापस' : 'Back'}
          </Button>
          <Button onClick={handleFinalConfirm} disabled={isLoading}>
            {isLoading ? 
              (isHindi ? 'आर्काइव कर रहे हैं...' : 'Archiving...') : 
              (isHindi ? 'आर्काइव की पुष्टि करें' : 'Confirm Archive')
            }
          </Button>
        </DialogFooter>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {currentStep === 'selection' && renderSelectionStep()}
        {currentStep === 'folder' && renderFolderStep()}
        {currentStep === 'confirmation' && renderConfirmationStep()}
      </DialogContent>
    </Dialog>
  );
}
