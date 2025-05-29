
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ArchiveFolder } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderGrid } from "@/components/archive/FolderGrid";
import { FolderDetailView } from "@/components/archive/FolderDetailView";
import { supabase } from "@/integrations/supabase/client";

const ArchivePage = () => {
  const [folders, setFolders] = useState<ArchiveFolder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<ArchiveFolder | null>(null);
  const [selectedTab, setSelectedTab] = useState<'staff' | 'trainee'>('staff');
  const { isHindi } = useLanguage();

  const fetchFolders = async () => {
    setIsLoadingFolders(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-archive-folders', {
        body: { action: 'list' }
      });
      
      if (error) throw error;
      setFolders(data.folders || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error(isHindi ? 'फ़ोल्डर लोड करने में त्रुटि' : 'Error loading folders');
    } finally {
      setIsLoadingFolders(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleFolderClick = (folder: ArchiveFolder) => {
    setSelectedFolder(folder);
  };

  const handleBackToFolders = () => {
    setSelectedFolder(null);
    // Refresh folders to get updated item counts
    fetchFolders();
  };

  const handleFolderDeleted = () => {
    // Refresh folders after deletion
    fetchFolders();
  };

  // Filter folders based on the selected tab by checking which table has records
  const getFilteredFolders = async (recordType: 'staff' | 'trainee') => {
    if (folders.length === 0) return [];
    
    // Get folder IDs that contain records of the specified type
    const table = recordType === 'staff' ? 'archived_staff' : 'archived_trainees';
    
    try {
      const { data, error } = await supabase
        .from(table)
        .select('folder_id')
        .not('folder_id', 'is', null);
      
      if (error) {
        console.error(`Error fetching ${recordType} folder IDs:`, error);
        return folders; // Return all folders if error
      }
      
      const folderIds = [...new Set(data?.map(record => record.folder_id).filter(Boolean))];
      return folders.filter(folder => folderIds.includes(folder.id));
    } catch (error) {
      console.error(`Error filtering ${recordType} folders:`, error);
      return folders; // Return all folders if error
    }
  };

  // State for filtered folders
  const [staffFolders, setStaffFolders] = useState<ArchiveFolder[]>([]);
  const [traineeFolders, setTraineeFolders] = useState<ArchiveFolder[]>([]);
  const [isFilteringFolders, setIsFilteringFolders] = useState(false);

  // Filter folders when folders list changes
  useEffect(() => {
    const filterFolders = async () => {
      if (folders.length === 0) return;
      
      setIsFilteringFolders(true);
      try {
        const [staffFiltered, traineeFiltered] = await Promise.all([
          getFilteredFolders('staff'),
          getFilteredFolders('trainee')
        ]);
        
        setStaffFolders(staffFiltered);
        setTraineeFolders(traineeFiltered);
      } catch (error) {
        console.error('Error filtering folders:', error);
        // Fallback to showing all folders
        setStaffFolders(folders);
        setTraineeFolders(folders);
      } finally {
        setIsFilteringFolders(false);
      }
    };

    filterFolders();
  }, [folders]);

  const getCurrentFolders = () => {
    return selectedTab === 'staff' ? staffFolders : traineeFolders;
  };

  if (selectedFolder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto py-6 px-4 animate-fade-in">
          <FolderDetailView
            folder={selectedFolder}
            recordType={selectedTab}
            onBack={handleBackToFolders}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4 animate-fade-in">
        <div className="mb-6">
          <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'आर्काइव फ़ोल्डर' : 'Archive Folders'}
          </h1>
          <p className={`text-gray-600 mt-2 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'आर्काइव किए गए रिकॉर्ड फ़ोल्डर के अनुसार व्यवस्थित हैं' : 'Archived records organized by folders'}
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as 'staff' | 'trainee')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="staff" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'स्टाफ आर्काइव' : 'Staff Archive'} 
              {!isFilteringFolders && (
                <span className="ml-2 text-sm text-gray-500">
                  ({staffFolders.length})
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="trainee" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'प्रशिक्षु आर्काइव' : 'Trainee Archive'} 
              {!isFilteringFolders && (
                <span className="ml-2 text-sm text-gray-500">
                  ({traineeFolders.length})
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="mt-6">
            <FolderGrid
              folders={staffFolders}
              isLoading={isLoadingFolders || isFilteringFolders}
              recordType="staff"
              onFolderClick={handleFolderClick}
              onFolderDeleted={handleFolderDeleted}
            />
          </TabsContent>
          
          <TabsContent value="trainee" className="mt-6">
            <FolderGrid
              folders={traineeFolders}
              isLoading={isLoadingFolders || isFilteringFolders}
              recordType="trainee"
              onFolderClick={handleFolderClick}
              onFolderDeleted={handleFolderDeleted}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ArchivePage;
