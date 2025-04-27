
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceFormProps {
  type: 'trainee' | 'staff';
  onSuccess: () => void;
}

export function AttendanceForm({ type, onSuccess }: AttendanceFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [pno, setPno] = useState("");
  const [status, setStatus] = useState<'absent' | 'on_leave'>('absent');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pno || !date) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // First, find the trainee/staff
      const { data: person, error: findError } = await supabase
        .from(type === 'trainee' ? 'trainees' : 'staff')
        .select('id')
        .eq('pno', pno)
        .single();

      if (findError || !person) {
        toast.error(`${type === 'trainee' ? 'Trainee' : 'Staff member'} not found`);
        return;
      }

      const attendanceData = {
        [`${type}_id`]: person.id,
        date: date.toISOString().split('T')[0],
        status: status
      };

      // Then, insert the attendance record
      const { error: insertError } = await supabase
        .from(`${type}_attendance`)
        .upsert(attendanceData);

      if (insertError) throw insertError;

      toast.success("Attendance marked successfully");
      setPno("");
      setStatus('absent');
      onSuccess();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast.error("Failed to mark attendance");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pno">PNO Number</Label>
          <Input
            id="pno"
            value={pno}
            onChange={(e) => setPno(e.target.value)}
            placeholder="Enter PNO"
            maxLength={9}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={status} 
            onValueChange={(value: 'absent' | 'on_leave') => setStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border"
        />
      </div>

      <Button type="submit">Mark Attendance</Button>
    </form>
  );
}
