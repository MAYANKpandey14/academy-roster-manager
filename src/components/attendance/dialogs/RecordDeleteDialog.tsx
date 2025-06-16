
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

  // handles delete operation
const handleDelete = async () => {
  try {
    console.log("Starting delete operation...");
    console.log("Record:", record);
    console.log("Record Type:", recordType);
    console.log("Person Type:", personType);

    if (!record?.id) {
      throw new Error("Record ID is missing.");
    }

    // Determine table based on type and person
    const tableMap: Record<string, string> = {
      "staff_attendance": "staff_attendance",
      "staff_leave": "staff_leave",
      "trainee_attendance": "trainee_attendance",
      "trainee_leave": "trainee_leave",
    };

    const key = `${personType}_${recordType}`; // e.g. "staff_attendance"
    const tableName = tableMap[key];

    if (!tableName) {
      throw new Error(`Unsupported record type: ${key}`);
    }

    const { error: deleteError } = await supabase
      .from(tableName)
      .delete()
      .eq("id", record.id);

    if (deleteError) throw deleteError;

    toast.success("Record deleted successfully");
    onClose();

    if (typeof onDeleted === "function") {
      onDeleted(); // Refresh the list or trigger state update
    }

  } catch (error: any) {
    console.error("Delete error:", error);
    toast.error(error.message || "Failed to delete record");
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
