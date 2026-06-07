
import { useState, useEffect } from "react";
import { ArchiveFolder } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
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
      const { data, error } = await supabase.functions.invoke('manage-archives/folders', {
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
             <main className="container mx-auto py-6 px-4 animate-fade-in">
        <div className="mb-6">
          <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'संग्रह (आर्काइव)' : 'Archives'}
          </h1>
        </div>

        {/* Archive Record Type Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
          <button
            onClick={() => setSelectedTab('staff')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-[2px] transition-all ${
              selectedTab === 'staff'
                ? "border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'स्टाफ आर्काइव' : 'Staff Archive'}
            </span>
            {!isFilteringFolders && (
              <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500 font-normal">
                ({staffFolders.length})
              </span>
            )}
          </button>
          <button
            onClick={() => setSelectedTab('trainee')}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-[2px] transition-all ${
              selectedTab === 'trainee'
                ? "border-slate-900 text-slate-900 dark:border-slate-100 dark:text-slate-100"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'प्रशिक्षु आर्काइव' : 'Trainee Archive'}
            </span>
            {!isFilteringFolders && (
              <span className="ml-1.5 text-xs text-gray-400 dark:text-gray-500 font-normal">
                ({traineeFolders.length})
              </span>
            )}
          </button>
        </div>

        {selectedTab === 'staff' ? (
          <FolderGrid
            folders={staffFolders}
            isLoading={isLoadingFolders || isFilteringFolders}
            recordType="staff"
            onFolderClick={handleFolderClick}
            onFolderDeleted={handleFolderDeleted}
          />
        ) : (
          <FolderGrid
            folders={traineeFolders}
            isLoading={isLoadingFolders || isFilteringFolders}
            recordType="trainee"
            onFolderClick={handleFolderClick}
            onFolderDeleted={handleFolderDeleted}
          />
        )}
      </main>
    </div>
  );
};

export default ArchivePage;
