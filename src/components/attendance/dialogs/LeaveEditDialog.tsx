
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { LeaveRecord } from "../hooks/useFetchAttendance";
import { PersonType } from "../types/attendanceTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface LeaveEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  record: LeaveRecord;
  personType: PersonType;
}

export function LeaveEditDialog({ isOpen, onClose, record, personType }: LeaveEditDialogProps) {
  const { isHindi } = useLanguage();
  const [startDate, setStartDate] = useState(record.start_date);
  const [endDate, setEndDate] = useState(record.end_date);
  const [reason, setReason] = useState(record.reason);
  const [leaveType, setLeaveType] = useState(record.leave_type || "");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const table = personType === "staff" ? "staff_leave" : "trainee_leave";
      
      const { error } = await supabase
        .from(table)
        .update({ 
          start_date: startDate,
          end_date: endDate,
          reason: reason,
          leave_type: leaveType,
          status: "pending" // Reset status when edited
        })
        .eq("id", record.id);

      if (error) throw error;

      toast.success(isHindi ? 
        'छुट्टी रिकॉर्ड अपडेट हो गया' : 
        'Leave record updated successfully'
      );

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["attendance", record.person_id, personType] });
      
      onClose();
    } catch (error) {
      console.error("Error updating leave:", error);
      toast.error(isHindi ? 
        'छुट्टी रिकॉर्ड अपडेट करने में विफल' : 
        'Failed to update leave record'
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
            {isHindi ? 'छुट्टी रिकॉर्ड संपादित करें' : 'Edit Leave Record'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'प्रारंभ दिनांक' : 'Start Date'}
              </Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? 'समाप्ति दिनांक' : 'End Date'}
              </Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'छुट्टी का प्रकार' : 'Leave Type'}
            </Label>
            <Input
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              placeholder={isHindi ? "छुट्टी का प्रकार दर्ज करें..." : "Enter leave type..."}
            />
          </div>

          <div>
            <Label className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'कारण' : 'Reason'}
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={isHindi ? "कारण दर्ज करें..." : "Enter reason..."}
            />
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
