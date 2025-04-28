
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface AttendanceFormProps {
  type: 'trainee' | 'staff';
  onSuccess: () => void;
}

export function AttendanceForm({ type, onSuccess }: AttendanceFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [pno, setPno] = useState("");
  const [status, setStatus] = useState<'absent' | 'on_leave'>('absent');
  const { t, i18n } = useTranslation();

  // Update input language when the app language changes
  useEffect(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      if (input instanceof HTMLElement) {
        input.lang = i18n.language;
        
        // Apply or remove KrutiDev font class based on language
        if (i18n.language === 'hi') {
          input.classList.add('krutidev-font');
        } else {
          input.classList.remove('krutidev-font');
        }
      }
    });
  }, [i18n.language]);

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

      // Create the appropriate data object based on type
      const formattedDate = date.toISOString().split('T')[0];
      
      if (type === 'trainee') {
        const { error: insertError } = await supabase
          .from('trainee_attendance')
          .upsert({
            trainee_id: person.id,
            date: formattedDate,
            status: status
          });

        if (insertError) throw insertError;
      } else {
        const { error: insertError } = await supabase
          .from('staff_attendance')
          .upsert({
            staff_id: person.id,
            date: formattedDate,
            status: status
          });

        if (insertError) throw insertError;
      }

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
          <Label htmlFor="pno" className="dynamic-text">{t("pnoNumber")}</Label>
          <Input
            id="pno"
            value={pno}
            onChange={(e) => setPno(e.target.value)}
            placeholder={t("enterPNO")}
            maxLength={9}
            required
            lang={i18n.language}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status" className="dynamic-text">{t("status")}</Label>
          <Select 
            value={status} 
            onValueChange={(value: 'absent' | 'on_leave') => setStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("status")} className="dynamic-text" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="absent" className="dynamic-text">{t("absent")}</SelectItem>
              <SelectItem value="on_leave" className="dynamic-text">{t("onLeave")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="dynamic-text">{t("date")}</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border"
        />
      </div>

      <Button type="submit">
        <span className="dynamic-text">{t("markAttendance")}</span>
      </Button>
    </form>
  );
}
