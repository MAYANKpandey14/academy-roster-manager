import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { getArchivedStaff, getArchivedTrainees } from "@/services/archiveApi";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEnhancedArchivedStaffColumns, getEnhancedArchivedTraineeColumns } from "@/components/archive/EnhancedArchiveTableColumns";
import { ArchiveViewModal } from "@/components/archive/ArchiveViewModal";
import { ArchiveBulkActions } from "@/components/archive/ArchiveBulkActions";
import { exportStaffToExcel } from "@/utils/export";
import { exportTraineesToExcel } from "@/utils/export";
import { createStaffPrintContent } from "@/utils/staffExportUtils";
import { createPrintContent } from "@/utils/export";
import { handlePrint } from "@/utils/export";

const ArchivePage = () => {
  const [archivedStaff, setArchivedStaff] = useState<ArchivedStaff[]>([]);
  const [archivedTrainees, setArchivedTrainees] = useState<ArchivedTrainee[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [isLoadingTrainees, setIsLoadingTrainees] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ArchivedStaff | ArchivedTrainee | null>(null);
  const [selectedType, setSelectedType] = useState<'staff' | 'trainee'>('staff');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [staffRowSelection, setStaffRowSelection] = useState({});
  const [traineeRowSelection, setTraineeRowSelection] = useState({});
  const { isHindi } = useLanguage();

  const fetchArchivedStaff = async () => {
    setIsLoadingStaff(true);
    try {
      const { data, error } = await getArchivedStaff();
      if (error) throw error;
      setArchivedStaff(data || []);
    } catch (error) {
      console.error('Error fetching archived staff:', error);
      toast.error(isHindi ? 'आर्काइव किए गए स्टाफ लोड करने में त्रुटि' : 'Error loading archived staff');
    } finally {
      setIsLoadingStaff(false);
    }
  };

  const fetchArchivedTrainees = async () => {
    setIsLoadingTrainees(true);
    try {
      const { data, error } = await getArchivedTrainees();
      if (error) throw error;
      setArchivedTrainees(data || []);
    } catch (error) {
      console.error('Error fetching archived trainees:', error);
      toast.error(isHindi ? 'आर्काइव किए गए प्रशिक्षु लोड करने में त्रुटि' : 'Error loading archived trainees');
    } finally {
      setIsLoadingTrainees(false);
    }
  };

  useEffect(() => {
    fetchArchivedStaff();
    fetchArchivedTrainees();
  }, []);

  // Handle record actions
  const handleView = (record: ArchivedStaff | ArchivedTrainee, type: 'staff' | 'trainee') => {
    setSelectedRecord(record);
    setSelectedType(type);
    setIsViewModalOpen(true);
  };

  const handlePrintSingle = async (record: ArchivedStaff | ArchivedTrainee, type: 'staff' | 'trainee') => {
    try {
      if (type === 'staff') {
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

  const handleExportSingle = (record: ArchivedStaff | ArchivedTrainee, type: 'staff' | 'trainee') => {
    try {
      if (type === 'staff') {
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

  const handleUnarchive = async (record: ArchivedStaff | ArchivedTrainee, type: 'staff' | 'trainee') => {
    // Refresh the data after unarchiving
    if (type === 'staff') {
      await fetchArchivedStaff();
    } else {
      await fetchArchivedTrainees();
    }
  };

  // Get selected records
  const getSelectedStaff = () => {
    const selectedIndices = Object.keys(staffRowSelection).map(Number);
    return selectedIndices.map(index => archivedStaff[index]).filter(Boolean);
  };

  const getSelectedTrainees = () => {
    const selectedIndices = Object.keys(traineeRowSelection).map(Number);
    return selectedIndices.map(index => archivedTrainees[index]).filter(Boolean);
  };

  // Handle bulk actions
  const handlePrintSelected = async (records: (ArchivedStaff | ArchivedTrainee)[], type: 'staff' | 'trainee') => {
    try {
      if (type === 'staff') {
        const content = await createStaffPrintContent(records as ArchivedStaff[], isHindi);
        handlePrint(content);
      } else {
        const content = await createPrintContent(records as ArchivedTrainee[], isHindi);
        handlePrint(content);
      }
    } catch (error) {
      console.error('Error printing selected records:', error);
      toast.error(isHindi ? 'प्रिंट करने में त्रुटि' : 'Error printing records');
    }
  };

  const handleExportSelected = (records: (ArchivedStaff | ArchivedTrainee)[], type: 'staff' | 'trainee') => {
    try {
      if (type === 'staff') {
        exportStaffToExcel(records as ArchivedStaff[], isHindi);
      } else {
        exportTraineesToExcel(records as ArchivedTrainee[], isHindi);
      }
    } catch (error) {
      console.error('Error exporting selected records:', error);
      toast.error(isHindi ? 'एक्सपोर्ट करने में त्रुटि' : 'Error exporting records');
    }
  };

  const staffColumns = getEnhancedArchivedStaffColumns(
    isHindi,
    (record) => handleView(record, 'staff'),
    (record) => handlePrintSingle(record, 'staff'),
    (record) => handleExportSingle(record, 'staff'),
    (record) => handleUnarchive(record, 'staff')
  );

  const traineeColumns = getEnhancedArchivedTraineeColumns(
    isHindi,
    (record) => handleView(record, 'trainee'),
    (record) => handlePrintSingle(record, 'trainee'),
    (record) => handleExportSingle(record, 'trainee'),
    (record) => handleUnarchive(record, 'trainee')
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4 animate-fade-in">
        <div className="mb-6">
          <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'आर्काइव' : 'Archive'}
          </h1>
          <p className={`text-gray-600 mt-2 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'आर्काइव किए गए स्टाफ और प्रशिक्षु रिकॉर्ड देखें और प्रबंधित करें' : 'View and manage archived staff and trainee records'}
          </p>
        </div>

        <Tabs defaultValue="staff" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="staff" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'आर्काइव किए गए स्टाफ' : 'Archived Staff'} ({archivedStaff.length})
            </TabsTrigger>
            <TabsTrigger value="trainees" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'आर्काइव किए गए प्रशिक्षु' : 'Archived Trainees'} ({archivedTrainees.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="staff" className="space-y-4">
            <ArchiveBulkActions
              selectedRecords={getSelectedStaff()}
              type="staff"
              onPrintSelected={(records) => handlePrintSelected(records, 'staff')}
              onExportSelected={(records) => handleExportSelected(records, 'staff')}
              onClearSelection={() => setStaffRowSelection({})}
            />
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <DataTable
                columns={staffColumns}
                data={archivedStaff}
                filterColumn="name"
                filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
                isLoading={isLoadingStaff}
                totalLabel={isHindi ? "कुल आर्काइव किए गए स्टाफ" : "Total Archived Staff"}
                rowSelection={staffRowSelection}
                onRowSelectionChange={setStaffRowSelection}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="trainees" className="space-y-4">
            <ArchiveBulkActions
              selectedRecords={getSelectedTrainees()}
              type="trainee"
              onPrintSelected={(records) => handlePrintSelected(records, 'trainee')}
              onExportSelected={(records) => handleExportSelected(records, 'trainee')}
              onClearSelection={() => setTraineeRowSelection({})}
            />
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <DataTable
                columns={traineeColumns}
                data={archivedTrainees}
                filterColumn="name"
                filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
                isLoading={isLoadingTrainees}
                totalLabel={isHindi ? "कुल आर्काइव किए गए प्रशिक्षु" : "Total Archived Trainees"}
                rowSelection={traineeRowSelection}
                onRowSelectionChange={setTraineeRowSelection}
              />
            </div>
          </TabsContent>
        </Tabs>

        <ArchiveViewModal
          record={selectedRecord}
          type={selectedType}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default ArchivePage;
