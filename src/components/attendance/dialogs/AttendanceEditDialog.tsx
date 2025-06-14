
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { AttendanceRecord } from "../hooks/useFetchAttendance";
import { PersonType } from "../types/attendanceTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface AttendanceEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: AttendanceRecord;
  personType: PersonType;
}

export function AttendanceEditDialog({ isOpen, onClose, record, personType }: AttendanceEditDialogProps) {
  const { isHindi } = useLanguage();
  const [status, setStatus] = useState(record.status);
  const [date, setDate] = useState(record.date);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const tableName = personType === "staff" ? "staff_attendance" : "trainee_attendance";
      
      const { error } = await supabase
        .from(tableName)
        .update({ 
          status: status,
          date: date,
          approval_status: "pending" // Reset approval status when edited
        })
        .eq("id", record.id);

      if (error) throw error;

      toast.success(isHindi ? 
        'उपस्थिति रिकॉर्ड अपडेट हो गया' : 
        'Attendance record updated successfully'
      );

      // Invalidate queries to refresh data
      const personId = record.trainee_id || record.staff_id || "";
      queryClient.invalidateQueries({ queryKey: ["attendance", personId, personType] });
      
      onClose();
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast.error(isHindi ? 
        'उपस्थिति रिकॉर्ड अपडेट करने में विफल' : 
        'Failed to update attendance record'
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
            {isHindi ? 'उपस्थिति रिकॉर्ड संपादित करें' : 'Edit Attendance Record'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'दिनांक' : 'Date'}
            </Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'स्थिति' : 'Status'}
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="absent">{isHindi ? "अनुपस्थित" : "Absent"}</SelectItem>
                <SelectItem value="duty">{isHindi ? "ड्यूटी" : "Duty"}</SelectItem>
                <SelectItem value="training">{isHindi ? "प्रशिक्षण" : "Training"}</SelectItem>
                <SelectItem value="suspension">{isHindi ? "निलंबन" : "Suspension"}</SelectItem>
                <SelectItem value="resignation">{isHindi ? "इस्तीफ़ा" : "Resignation"}</SelectItem>
                <SelectItem value="termination">{isHindi ? "बर्खास्त" : "Termination"}</SelectItem>
                <SelectItem value="return_to_unit">{isHindi ? "यूनिट वापसी" : "Return to Unit"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              {isHindi ? 'रद्द करें' : 'Cancel'}
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (isHindi ? 'सेव हो रहा है...' : 'Saving...') : (isHindi ? 'सेव करें' : 'Save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
