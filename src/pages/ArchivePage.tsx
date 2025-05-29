
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { DataTable } from "@/components/ui/data-table";
import { getArchivedStaff, getArchivedTrainees } from "@/services/archiveApi";
import { ArchivedStaff, ArchivedTrainee } from "@/types/archive";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getArchivedStaffColumns, getArchivedTraineeColumns } from "@/components/archive/ArchiveTableColumns";

const ArchivePage = () => {
  const [archivedStaff, setArchivedStaff] = useState<ArchivedStaff[]>([]);
  const [archivedTrainees, setArchivedTrainees] = useState<ArchivedTrainee[]>([]);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);
  const [isLoadingTrainees, setIsLoadingTrainees] = useState(false);
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

  const staffColumns = getArchivedStaffColumns(isHindi);
  const traineeColumns = getArchivedTraineeColumns(isHindi);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4 animate-fade-in">
        <div className="mb-6">
          <h1 className={`text-2xl font-semibold ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'आर्काइव' : 'Archive'}
          </h1>
          <p className={`text-gray-600 mt-2 ${isHindi ? 'font-hindi' : ''}`}>
            {isHindi ? 'आर्काइव किए गए स्टाफ और प्रशिक्षु रिकॉर्ड देखें' : 'View archived staff and trainee records'}
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
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <DataTable
                columns={staffColumns}
                data={archivedStaff}
                filterColumn="name"
                filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
                isLoading={isLoadingStaff}
                totalLabel={isHindi ? "कुल आर्काइव किए गए स्टाफ" : "Total Archived Staff"}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="trainees" className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <DataTable
                columns={traineeColumns}
                data={archivedTrainees}
                filterColumn="name"
                filterPlaceholder={isHindi ? "नाम से खोजें..." : "Search by name..."}
                isLoading={isLoadingTrainees}
                totalLabel={isHindi ? "कुल आर्काइव किए गए प्रशिक्षु" : "Total Archived Trainees"}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ArchivePage;
