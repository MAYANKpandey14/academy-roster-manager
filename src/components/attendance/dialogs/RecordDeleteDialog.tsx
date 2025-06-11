
import { useState } from "react";
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

export function RecordDeleteDialog({ 
  isOpen, 
  onClose, 
  record, 
  recordType, 
  personType 
}: RecordDeleteDialogProps) {
  const { isHindi } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      let tableName: "staff_attendance" | "trainee_attendance" | "staff_leave" | "trainee_leave";
      
      if (recordType === "attendance") {
        tableName = personType === "staff" ? "staff_attendance" : "trainee_attendance";
      } else {
        tableName = personType === "staff" ? "staff_leave" : "trainee_leave";
      }
      
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", record.id);

      if (error) throw error;

      toast.success(isHindi ? 
        `${recordType === "attendance" ? "उपस्थिति" : "छुट्टी"} रिकॉर्ड डिलीट हो गया` : 
        `${recordType === "attendance" ? "Attendance" : "Leave"} record deleted successfully`
      );

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["attendance", record.person_id, personType] });
      
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
