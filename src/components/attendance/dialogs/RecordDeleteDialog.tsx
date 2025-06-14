
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { AttendanceRecord, LeaveRecord } from "../hooks/useFetchAttendance";
import { PersonType } from "../types/attendanceTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface RecordDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord | LeaveRecord;
  recordType: "attendance" | "leave";
  personType: PersonType;
}

interface PersonDetails {
  name: string;
  pno: string;
}

type TableName = "staff_attendance" | "trainee_attendance" | "staff_leave" | "trainee_leave";

export function RecordDeleteDialog({ 
  isOpen, 
  onClose, 
  record, 
  recordType, 
  personType 
}: RecordDeleteDialogProps) {
  const { isHindi } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [personDetails, setPersonDetails] = useState<PersonDetails | null>(null);
  const [loadingPersonDetails, setLoadingPersonDetails] = useState(false);
  const queryClient = useQueryClient();

  // Get person ID from record
  const personId = record.trainee_id || record.staff_id || "";

  // Fetch person details when dialog opens
  useEffect(() => {
    if (isOpen && personId) {
      const fetchPersonDetails = async () => {
        setLoadingPersonDetails(true);
        try {
          const table = personType === "staff" ? "staff" : "trainees";
          const { data, error } = await supabase
            .from(table)
            .select("name, pno")
            .eq("id", personId)
            .single();

          if (error) {
            console.error("Error fetching person details:", error);
            return;
          }

          if (data) {
            setPersonDetails({
              name: data.name,
              pno: data.pno
            });
          }
        } catch (error) {
          console.error("Error fetching person details:", error);
        } finally {
          setLoadingPersonDetails(false);
        }
      };

      fetchPersonDetails();
    }
  }, [isOpen, personId, personType]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      console.log("Deleting record:", { record, recordType, personType });
      console.log("Record person_id:", personId);
      
      let tableName: TableName;
      
      if (recordType === "attendance") {
        tableName = personType === "staff" ? "staff_attendance" : "trainee_attendance";
      } else {
        tableName = personType === "staff" ? "staff_leave" : "trainee_leave";
      }
      
      console.log("Using table:", tableName, "for record ID:", record.id);
      
      const { error, data } = await supabase
        .from(tableName)
        .delete()
        .eq("id", record.id)
        .select();

      console.log("Delete operation result:", { error, data });

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      console.log("Delete successful, deleted records:", data);
      
      toast.success(isHindi ? 
        `${recordType === "attendance" ? "उपस्थिति" : "छुट्टी"} रिकॉर्ड डिलीट हो गया` : 
        `${recordType === "attendance" ? "Attendance" : "Leave"} record deleted successfully`
      );

      // Add a small delay to ensure database operation completes
      await new Promise(resolve => setTimeout(resolve, 200));

      // Invalidate and refetch queries to refresh data
      console.log("Invalidating queries for person_id:", personId);
      await queryClient.invalidateQueries({ 
        queryKey: ["attendance", personId, personType] 
      });
      
      // Force refetch
      await queryClient.refetchQueries({ 
        queryKey: ["attendance", personId, personType] 
      });
      
      console.log("Queries invalidated and refetched");
      
      onClose();
    } catch (error) {
      console.error(`Error deleting ${recordType}:`, error);
      toast.error(isHindi ? 
        `${recordType === "attendance" ? "उपस्थिति" : "छुट्टी"} रिकॉर्ड डिलीट करने में विफल` : 
        `Failed to delete ${recordType} record`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 
              `${recordType === "attendance" ? "उपस्थिति" : "छुट्टी"} रिकॉर्ड डिलीट करें` : 
              `Delete ${recordType === "attendance" ? "Attendance" : "Leave"} Record`
            }
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? 
              'क्या आप वाकई इस रिकॉर्ड को डिलीट करना चाहते हैं? यह कार्रवाई वापस नहीं की जा सकती।' : 
              'Are you sure you want to delete this record? This action cannot be undone.'
            }
          </p>

          <div className="bg-gray-50 p-3 rounded">
            {loadingPersonDetails ? (
              <p className="text-sm">Loading person details...</p>
            ) : personDetails ? (
              <>
                <p className="text-sm">
                  <strong>{isHindi ? 'नाम:' : 'Name:'}</strong> {personDetails.name}
                </p>
                <p className="text-sm">
                  <strong>{isHindi ? 'पी.नं.:' : 'P.No:'}</strong> {personDetails.pno}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">
                  <strong>Record ID:</strong> {record.id}
                </p>
                <p className="text-sm">
                  <strong>Person ID:</strong> {personId}
                </p>
              </>
            )}
            {'date' in record && (
              <p className="text-sm">
                <strong>{isHindi ? 'दिनांक:' : 'Date:'}</strong> {record.date}
              </p>
            )}
            {'start_date' in record && (
              <p className="text-sm">
                <strong>{isHindi ? 'प्रारंभ दिनांक:' : 'Start Date:'}</strong> {record.start_date}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isLoading}
            >
              {isLoading ? (isHindi ? 'डिलीट हो रहा है...' : 'Deleting...') : (isHindi ? 'डिलीट करें' : 'Delete')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
