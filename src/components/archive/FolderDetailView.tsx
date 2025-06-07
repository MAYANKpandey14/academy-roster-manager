
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Users, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArchiveFolder, ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { getEnhancedArchiveTableColumns } from "./EnhancedArchiveTableColumns";
import { ArchiveViewModal } from "./ArchiveViewModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FolderDetailViewProps {
  folder: ArchiveFolder;
  recordType: 'staff' | 'trainee';
  onBack: () => void;
}

export function FolderDetailView({ folder, recordType, onBack }: FolderDetailViewProps) {
  const { isHindi } = useLanguage();
  const [records, setRecords] = useState<(ArchivedStaff | ArchivedTrainee)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchivedStaff | ArchivedTrainee | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const table = recordType === 'staff' ? 'archived_staff' : 'archived_trainees';
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('folder_id', folder.id)
        .eq('status', 'archived')
        .order('archived_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error(isHindi ? 'रिकॉर्ड लोड करने में त्रुटि' : 'Error loading records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [folder.id, recordType]);

  const handleView = (record: ArchivedStaff | ArchivedTrainee) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handlePrint = (record: ArchivedStaff | ArchivedTrainee) => {
    // Implement print functionality
    console.log('Print record:', record);
  };

  const handleExport = (record: ArchivedStaff | ArchivedTrainee) => {
    // Implement export functionality
    console.log('Export record:', record);
  };

  const handleUnarchive = (record: ArchivedStaff | ArchivedTrainee) => {
    // Refresh records after unarchive
    fetchRecords();
  };

  const columns = getEnhancedArchiveTableColumns(
    recordType,
    isHindi,
    handleView,
    handlePrint,
    handleExport,
    handleUnarchive
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'वापस' : 'Back'}
            </span>
          </Button>
          
          <div>
            <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
              {folder.folder_name}
            </h1>
            {folder.description && (
              <p className={`text-gray-600 mt-1 ${isHindi ? 'font-hindi' : ''}`}>
                {folder.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{records.length} {isHindi ? 'रिकॉर्ड' : 'records'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>
              {isHindi ? 'बनाया गया' : 'Created'}: {format(new Date(folder.created_at), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
      </div>

      {/* Folder Info Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FolderOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'फ़ोल्डर विवरण' : 'Folder Details'}
            </h3>
            <p className="text-sm text-gray-500">
              {isHindi ? `${recordType === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'} रिकॉर्ड` : `${recordType} records`}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'कुल आइटम:' : 'Total Items:'}
            </span>
            <p>{folder.item_count}</p>
          </div>
          <div>
            <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'बनाया गया:' : 'Created:'}
            </span>
            <p>{format(new Date(folder.created_at), 'dd/MM/yyyy')}</p>
          </div>
          <div>
            <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'अंतिम संशोधन:' : 'Last Modified:'}
            </span>
            <p>{format(new Date(folder.last_modified), 'dd/MM/yyyy')}</p>
          </div>
          <div>
            <span className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
              {isHindi ? 'रिकॉर्ड प्रकार:' : 'Record Type:'}
            </span>
            <p className="capitalize">{recordType}</p>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className={`font-medium ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'आर्काइव किए गए रिकॉर्ड' : 'Archived Records'}
          </h3>
        </div>
        
        <div className="p-6">
          <DataTable
            columns={columns}
            data={records}
            filterColumn="name"
            filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
            isLoading={isLoading}
            totalLabel={isHindi ? `कुल ${recordType === 'staff' ? 'स्टाफ' : 'प्रशिक्षु'}` : `Total ${recordType}`}
          />
        </div>
      </div>

      {/* View Modal */}
      <ArchiveViewModal
        record={selectedRecord}
        type={recordType}
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}
