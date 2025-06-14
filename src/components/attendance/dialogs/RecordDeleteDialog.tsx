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

// Helper type-guards
// function isLeaveRecord(record: any): record is LeaveRecord {
//   return "start_date" in record && "end_date" in record;
// }
// function isAttendanceRecord(record: any): record is AttendanceRecord {
//   return "date" in record && "status" in record;
// }

export function RecordDeleteDialog({ 
  isOpen, 
  onClose, 
  record, 
  recordType, 
  personType 
}: RecordDeleteDialogProps) {
  const { isHindi } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [personDetails, setPersonDetails] = useState<{ name: string; pno: string } | null>(null);
  const [loadingPersonDetails, setLoadingPersonDetails] = useState(false);
  const queryClient = useQueryClient();

  // Fetch person details when dialog opens
  useEffect(() => {
    if (isOpen && (record.staff_id || record.trainee_id)) {
      const fetchPersonDetails = async () => {
        setLoadingPersonDetails(true);
        try {
          const table =
            personType === "staff" ? "staff" : "trainees";
          const idCol = "id"; // Both tables use "id" PK
          const targetId =
            personType === "staff"
              ? record.staff_id
              : record.trainee_id;

          const { data, error } = await supabase
            .from(table)
            .select("name, pno")
            .eq(idCol, targetId)
            .single();

          if (error) {
            console.error("Error fetching person details:", error);
            return;
          }

          if (data) {
            setPersonDetails({
              name: data.name,
              pno: data.pno,
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
  }, [isOpen, record.staff_id, record.trainee_id, personType]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (!record.id) throw new Error("Missing record ID for delete operation.");

      let tableName: TableName;
      let keyColumn: string;
      if (recordType === "attendance") {
        tableName =
          personType === "staff"
            ? "staff_attendance"
            : "trainee_attendance";
        keyColumn = "id"; // always delete by row id!
      } else if (recordType === "leave") {
        tableName =
          personType === "staff" ? "staff_leave" : "trainee_leave";
        keyColumn = "id";
      } else {
        throw new Error("Invalid record type for delete.");
      }

      console.log("[DELETE ACTION] Table:", tableName, "| RecordType:", recordType, "| PersonType:", personType, "| Record ID:", record.id);

      // Additional debug log of the row
      console.log(
        "Attempting delete: table=",
        tableName,
        ", keyColumn=",
        keyColumn,
        ", value=",
        record.id
      );

      const { error, data } = await supabase
        .from(tableName)
        .delete()
        .eq(keyColumn, record.id)
        .select();

      console.log("[DELETE RESULT]", { error, data });

      if (error) {
        console.error("Delete error:", error);
        throw error;
      }

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("Delete succeeded but returned no deleted records.", data);
      }

      toast.success(
        isHindi
          ? `${
              recordType === "attendance"
                ? "उपस्थिति"
                : "छुट्टी"
            } रिकॉर्ड डिलीट हो गया`
          : `${
              recordType === "attendance"
                ? "Attendance"
                : "Leave"
            } record deleted successfully`
      );

      await new Promise((resolve) => setTimeout(resolve, 180));

      // Invalidate and refetch queries to refresh data
      await queryClient.invalidateQueries({
        queryKey: ["attendance", record.staff_id || record.trainee_id, personType],
      });
      queryClient.refetchQueries({
        queryKey: ["attendance", record.staff_id || record.trainee_id, personType],
      });

      onClose();
    } catch (error) {
      console.error(`Error deleting ${recordType}:`, error);
      toast.error(
        isHindi
          ? `${
              recordType === "attendance"
                ? "उपस्थिति"
                : "छुट्टी"
            } रिकॉर्ड डिलीट करने में विफल`
          : `Failed to delete ${recordType} record`
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
                  <strong>Person ID:</strong> {record.trainee_id || record.staff_id}
                </p>
              </>
            )}
            {"date" in record && (
              <p className="text-sm">
                <strong>{isHindi ? 'दिनांक:' : 'Date:'}</strong> {record.date}
              </p>
            )}
            {"start_date" in record && (
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
