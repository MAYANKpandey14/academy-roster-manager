
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, FolderPlus, Archive } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArchiveFolder } from "@/types/archive";
import { Staff } from "@/types/staff";
import { Trainee } from "@/types/trainee";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ArchiveConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderId: string) => Promise<void>;
  selectedRecords: Staff[] | Trainee[];
  recordType: 'staff' | 'trainee';
}

type DialogStep = 'folder-selection' | 'confirmation';

export function ArchiveConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedRecords,
  recordType
}: ArchiveConfirmationDialogProps) {
  const { isHindi } = useLanguage();
  const [step, setStep] = useState<DialogStep>('folder-selection');
  const [folders, setFolders] = useState<ArchiveFolder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [folderOption, setFolderOption] = useState<'new' | 'existing'>('new');
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Generate suggested folder names
  const getSuggestedNames = () => {
    const today = new Date().toISOString().split('T')[0];
    const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const typeLabel = recordType === 'staff' ? 'Staff' : 'Trainee';
    
    return [
      `Archive_${today}`,
      `${typeLabel}_Archive_${monthYear.replace(' ', '_')}`,
      `${typeLabel}_Records_${new Date().getFullYear()}`
    ];
  };

  // Fetch existing folders
  const fetchFolders = async () => {
    setIsLoadingFolders(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-archive-folders', {
        body: { action: 'list' }
      });
      
      if (error) throw error;
      setFolders(data.folders || []);
      
      // If folders exist, default to existing option
      if (data.folders?.length > 0) {
        setFolderOption('existing');
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error(isHindi ? 'फ़ोल्डर लोड करने में त्रुटि' : 'Error loading folders');
    } finally {
      setIsLoadingFolders(false);
    }
  };

  // Filter folders based on search
  const filteredFolders = folders.filter(folder =>
    folder.folder_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset dialog state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('folder-selection');
      setNewFolderName('');
      setSelectedFolderId('');
      setSearchTerm('');
      setFolderOption('new');
      fetchFolders();
    }
  }, [isOpen]);

  // Handle folder creation
  const createFolder = async (folderName: string): Promise<string> => {
    const { data, error } = await supabase.functions.invoke('manage-archive-folders', {
      body: { 
        action: 'create',
        folderName: folderName.trim(),
        description: `${recordType} archive folder created on ${new Date().toLocaleDateString()}`
      }
    });
    
    if (error) throw error;
    return data.folder.id;
  };

  // Handle next step
  const handleNext = async () => {
    if (folderOption === 'new') {
      if (!newFolderName.trim()) {
        toast.error(isHindi ? 'फ़ोल्डर का नाम आवश्यक है' : 'Folder name is required');
        return;
      }
      
      // Check if folder name already exists
      const nameExists = folders.some(f => f.folder_name.toLowerCase() === newFolderName.trim().toLowerCase());
      if (nameExists) {
        toast.error(isHindi ? 'यह फ़ोल्डर नाम पहले से मौजूद है' : 'This folder name already exists');
        return;
      }
    } else {
      if (!selectedFolderId) {
        toast.error(isHindi ? 'कृपया एक फ़ोल्डर चुनें' : 'Please select a folder');
        return;
      }
    }
    
    setStep('confirmation');
  };

  // Handle final confirmation
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      let folderId = selectedFolderId;
      
      if (folderOption === 'new') {
        folderId = await createFolder(newFolderName);
      }
      
      await onConfirm(folderId);
      onClose();
    } catch (error) {
      console.error('Error in archive confirmation:', error);
      toast.error(isHindi ? 'आर्काइव करने में त्रुटि' : 'Error archiving records');
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedFolder = folders.find(f => f.id === selectedFolderId);
  const folderName = folderOption === 'new' ? newFolderName : (selectedFolder?.folder_name || '');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isHindi ? 'font-hindi' : ''}`}>
            <Archive className="h-5 w-5" />
            {step === 'folder-selection' 
              ? (isHindi ? 'आर्काइव फ़ोल्डर चुनें' : 'Choose Archive Folder')
              : (isHindi ? 'आर्काइव की पुष्टि करें' : 'Confirm Archive')
            }
          </DialogTitle>
        </DialogHeader>

        {step === 'folder-selection' && (
          <div className="space-y-4">
            {folders.length === 0 && !isLoadingFolders ? (
              // First-time user flow
              <div className="space-y-4">
                <Label className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? 'फ़ोल्डर का नाम:' : 'Folder Name:'}
                </Label>
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder={isHindi ? 'फ़ोल्डर का नाम दर्ज करें' : 'Enter folder name'}
                  className="w-full"
                />
                
                <div className="space-y-2">
                  <Label className={`text-sm text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
                    {isHindi ? 'सुझाव:' : 'Suggestions:'}
                  </Label>
                  {getSuggestedNames().map((name, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start h-auto p-2 text-left"
                      onClick={() => setNewFolderName(name)}
                    >
                      • {name}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              // Returning user flow
              <div className="space-y-4">
                <RadioGroup value={folderOption} onValueChange={(value) => setFolderOption(value as 'new' | 'existing')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new" className={isHindi ? 'font-hindi' : ''}>
                      {isHindi ? 'नया फ़ोल्डर बनाएं' : 'Create New Folder'}
                    </Label>
                  </div>
                  
                  {folderOption === 'new' && (
                    <Input
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder={isHindi ? 'फ़ोल्डर का नाम' : 'Folder name'}
                      className="ml-6 w-full"
                    />
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing" />
                    <Label htmlFor="existing" className={isHindi ? 'font-hindi' : ''}>
                      {isHindi ? 'मौजूदा फ़ोल्डर का उपयोग करें' : 'Use Existing Folder'}
                    </Label>
                  </div>
                </RadioGroup>

                {folderOption === 'existing' && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={isHindi ? 'फ़ोल्डर खोजें...' : 'Search folders...'}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
                      {filteredFolders.map((folder) => (
                        <div
                          key={folder.id}
                          className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-50 ${
                            selectedFolderId === folder.id ? 'bg-blue-50 border-blue-200' : 'border border-gray-200'
                          }`}
                          onClick={() => setSelectedFolderId(folder.id)}
                        >
                          <Checkbox
                            checked={selectedFolderId === folder.id}
                            onChange={() => setSelectedFolderId(folder.id)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{folder.folder_name}</div>
                            <div className="text-sm text-gray-500">
                              {folder.item_count} {isHindi ? 'आइटम' : 'items'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 'confirmation' && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="font-medium">
                {isHindi ? 'आर्काइव करने के लिए आइटम:' : 'Items to Archive:'} {selectedRecords.length} {isHindi ? 'रिकॉर्ड' : 'records'}
              </div>
              <div className="text-sm text-gray-600">
                • {selectedRecords.length} {recordType === 'staff' ? (isHindi ? 'स्टाफ रिकॉर्ड' : 'Staff records') : (isHindi ? 'प्रशिक्षु रिकॉर्ड' : 'Trainee records')}
              </div>
              
              <div className="mt-3 pt-3 border-t">
                <div className="font-medium">
                  {isHindi ? 'गंतव्य:' : 'Destination:'} "{folderName}"
                </div>
                {selectedFolder && (
                  <>
                    <div className="text-sm text-gray-600">
                      {isHindi ? 'वर्तमान फ़ोल्डर आकार:' : 'Current folder size:'} {selectedFolder.item_count} {isHindi ? 'आइटम' : 'items'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {isHindi ? 'नया फ़ोल्डर आकार:' : 'New folder size:'} {selectedFolder.item_count + selectedRecords.length} {isHindi ? 'आइटम' : 'items'}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </Button>
          
          {step === 'folder-selection' ? (
            <Button onClick={handleNext} disabled={isLoadingFolders}>
              <FolderPlus className="mr-2 h-4 w-4" />
              {isHindi ? 'आगे' : 'Next'}
            </Button>
          ) : (
            <Button onClick={handleConfirm} disabled={isProcessing} className="bg-orange-600 hover:bg-orange-700">
              <Archive className="mr-2 h-4 w-4" />
              {isProcessing 
                ? (isHindi ? 'आर्काइव कर रहे हैं...' : 'Archiving...') 
                : (isHindi ? 'आर्काइव करें' : 'Confirm Archive')
              }
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
