import { useState, useEffect } from "react";
import { ArchiveFolder, ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { 
  ArrowLeft, 
  Folder,
  Calendar,
  FileText,
  User,
  Users
} from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getEnhancedArchivedStaffColumns, getEnhancedArchivedTraineeColumns } from "@/components/archive/EnhancedArchiveTableColumns";
import { exportStaffToExcel, exportTraineesToExcel } from "@/utils/export";
import { createStaffPrintContent, createPrintContent, handlePrint } from "@/utils/export";
import { StaffRank } from "@/types/staff";
import { TraineeRank } from "@/types/trainee";

interface FolderDetailViewProps {
  folder: ArchiveFolder;
  recordType: 'staff' | 'trainee';
  onBack: () => void;
}

export function FolderDetailView({ folder, recordType, onBack }: FolderDetailViewProps) {
  const { isHindi } = useLanguage();
  const [records, setRecords] = useState<(ArchivedStaff | ArchivedTrainee)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  // Fetch records for this folder
  const fetchFolderRecords = async () => {
    setIsLoading(true);
    try {
      const table = recordType === 'staff' ? 'archived_staff' : 'archived_trainees';
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('folder_id', folder.id)
        .order('archived_at', { ascending: false });

      if (error) throw error;
      
      // Type cast the records to ensure proper typing
      const typedRecords = (data || []).map(record => ({
        ...record,
        rank: record.rank as StaffRank | TraineeRank
      })) as (ArchivedStaff | ArchivedTrainee)[];
      
      setRecords(typedRecords);
    } catch (error) {
      console.error('Error fetching folder records:', error);
      toast.error(isHindi ? 'रिकॉर्ड लोड करने में त्रुटि' : 'Error loading records');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolderRecords();
  }, [folder.id, recordType]);

  // Handle record actions
  const handleView = (record: ArchivedStaff | ArchivedTrainee) => {
    // Could open a modal or navigate to detail view
    console.log('View record:', record);
  };

  const handlePrintRecord = async (record: ArchivedStaff | ArchivedTrainee) => {
    try {
      if (recordType === 'staff') {
        const content = await createStaffPrintContent([record as ArchivedStaff], isHindi);
        handlePrint(content);
      } else {
        const content = await createPrintContent([record as ArchivedTrainee], isHindi);
        handlePrint(content);
      }
      toast.success(isHindi ? 'प्रिंट तैयार है' : 'Print ready');
    } catch (error) {
      console.error('Error printing record:', error);
      toast.error(isHindi ? 'प्रिंट करने में त्रुटि' : 'Error printing record');
    }
  };

  const handleExport = (record: ArchivedStaff | ArchivedTrainee) => {
    try {
      if (recordType === 'staff') {
        exportStaffToExcel([record as ArchivedStaff], isHindi);
      } else {
        exportTraineesToExcel([record as ArchivedTrainee], isHindi);
      }
      toast.success(isHindi ? 'एक्सेल फ़ाइल डाउनलोड हो गई' : 'Excel file downloaded');
    } catch (error) {
      console.error('Error exporting record:', error);
      toast.error(isHindi ? 'एक्सपोर्ट करने में त्रुटि' : 'Error exporting record');
    }
  };

  const handleUnarchive = async (record: ArchivedStaff | ArchivedTrainee) => {
    // Refresh records after unarchiving
    await fetchFolderRecords();
  };

  // Get table columns
  const columns = recordType === 'staff'
    ? getEnhancedArchivedStaffColumns(
        isHindi,
        handleView,
        handlePrintRecord,
        handleExport,
        handleUnarchive
      )
    : getEnhancedArchivedTraineeColumns(
        isHindi,
        handleView,
        handlePrintRecord,
        handleExport,
        handleUnarchive
      );

  const getSelectedRecords = () => {
    const selectedIndices = Object.keys(rowSelection).map(Number);
    return selectedIndices.map(index => records[index]).filter(Boolean);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          {isHindi ? 'वापस' : 'Back'}
        </Button>
        
        <div className="flex items-center gap-3">
          <Folder className="h-6 w-6 text-orange-500" />
          <div>
            <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
              {folder.folder_name}
            </h1>
            {folder.description && (
              <p className={`text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
                {folder.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Folder Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{folder.item_count}</div>
              <div className={`text-sm text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'कुल आइटम' : 'Total Items'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-lg font-medium">
                {format(new Date(folder.created_at), 'MMM d, yyyy')}
              </div>
              <div className={`text-sm text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'बनाया गया' : 'Created'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            {recordType === 'staff' ? <User className="h-5 w-5 text-purple-500" /> : <Users className="h-5 w-5 text-indigo-500" />}
            <div>
              <div className="text-lg font-medium capitalize">{recordType}</div>
              <div className={`text-sm text-gray-600 ${isHindi ? 'font-hindi' : ''}`}>
                {isHindi ? 'रिकॉर्ड प्रकार' : 'Record Type'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <DataTable
          columns={columns}
          data={records}
          filterColumn="name"
          filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
          isLoading={isLoading}
          totalLabel={`${isHindi ? 'कुल' : 'Total'} ${recordType === 'staff' ? (isHindi ? 'स्टाफ' : 'Staff') : (isHindi ? 'प्रशिक्षु' : 'Trainees')}`}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </div>
    </div>
  );
}
