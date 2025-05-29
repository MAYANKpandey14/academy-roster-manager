import { useState } from "react";
import { ArchiveFolder } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Folder, 
  Search, 
  Calendar, 
  FileText,
  SortAsc,
  SortDesc,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { FolderDeleteDialog } from "./FolderDeleteDialog";

interface FolderGridProps {
  folders: ArchiveFolder[];
  isLoading: boolean;
  recordType?: 'staff' | 'trainee';
  onFolderClick: (folder: ArchiveFolder) => void;
  onFolderDeleted?: () => void;
}

type SortOption = 'name' | 'date' | 'count';
type SortDirection = 'asc' | 'desc';

export function FolderGrid({ folders, isLoading, recordType = 'staff', onFolderClick, onFolderDeleted }: FolderGridProps) {
  const { isHindi } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteDialogFolder, setDeleteDialogFolder] = useState<ArchiveFolder | null>(null);

  // Filter folders based on search
  const filteredFolders = folders.filter(folder =>
    folder.folder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    folder.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort folders
  const sortedFolders = [...filteredFolders].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.folder_name.localeCompare(b.folder_name);
        break;
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'count':
        comparison = a.item_count - b.item_count;
        break;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (option: SortOption) => {
    if (sortBy !== option) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />;
  };

  const handleDeleteClick = (e: React.MouseEvent, folder: ArchiveFolder) => {
    e.stopPropagation(); // Prevent folder click
    setDeleteDialogFolder(folder);
  };

  const handleFolderDeleted = () => {
    setDeleteDialogFolder(null);
    onFolderDeleted?.();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isHindi ? 'फ़ोल्डर खोजें...' : 'Search folders...'}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('name')}
            className="flex items-center gap-1"
          >
            {isHindi ? 'नाम' : 'Name'}
            {getSortIcon('name')}
          </Button>
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('date')}
            className="flex items-center gap-1"
          >
            {isHindi ? 'दिनांक' : 'Date'}
            {getSortIcon('date')}
          </Button>
          <Button
            variant={sortBy === 'count' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('count')}
            className="flex items-center gap-1"
          >
            {isHindi ? 'आइटम' : 'Items'}
            {getSortIcon('count')}
          </Button>
        </div>
      </div>

      {/* Folders Grid */}
      {sortedFolders.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className={`text-lg font-medium text-gray-900 mb-2 ${isHindi ? 'font-hindi' : ''}`}>
            {searchTerm 
              ? (isHindi ? 'कोई फ़ोल्डर नहीं मिला' : 'No folders found')
              : (isHindi ? 'कोई आर्काइव फ़ोल्डर नहीं' : 'No archive folders')
            }
          </h3>
          <p className={`text-gray-500 ${isHindi ? 'font-hindi' : ''}`}>
            {searchTerm 
              ? (isHindi ? 'अपनी खोज को समायोजित करने का प्रयास करें' : 'Try adjusting your search')
              : (isHindi ? 'जब आप रिकॉर्ड आर्काइव करेंगे तो फ़ोल्डर यहाँ दिखाई देंगे' : 'Folders will appear here when you archive records')
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFolders.map((folder) => (
            <Card 
              key={folder.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer group relative"
              onClick={() => onFolderClick(folder)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base group-hover:text-blue-600 transition-colors">
                  <Folder className="h-5 w-5 text-orange-500" />
                  <span className="truncate">{folder.folder_name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {folder.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {folder.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {folder.item_count} {isHindi ? 'आइटम' : 'items'}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(folder.created_at), 'MMM d, yyyy')}
                  </div>
                </div>
                
                {folder.last_modified !== folder.created_at && (
                  <div className="text-xs text-gray-400">
                    {isHindi ? 'अंतिम संशोधन:' : 'Last modified:'} {format(new Date(folder.last_modified), 'MMM d, yyyy')}
                  </div>
                )}
              </CardContent>

              {/* Delete Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-3 left-3 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                onClick={(e) => handleDeleteClick(e, folder)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Dialog */}
      <FolderDeleteDialog
        folder={deleteDialogFolder}
        allFolders={folders}
        recordType={recordType}
        isOpen={!!deleteDialogFolder}
        onClose={() => setDeleteDialogFolder(null)}
        onDeleted={handleFolderDeleted}
      />
    </div>
  );
}
