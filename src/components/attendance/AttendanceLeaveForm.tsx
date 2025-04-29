import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { addDays, format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

// Type definitions for database tables
type StaffLeave = {
  staff_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string | null;
};

type TraineeLeave = {
  trainee_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  leave_type?: string | null;
};

type StaffAttendance = {
  staff_id: string;
  date: string;
  status: string;
};

type TraineeAttendance = {
  trainee_id: string;
  date: string;
  status: string;
};

const attendanceFormSchema = z.object({
  status: z.string().min(1, "स्थिति आवश्यक है"),
  leave_type: z.string().optional(),
  start_date: z.date({
    required_error: "शुरू की तिथि आवश्यक है",
  }),
  end_date: z.date({
    required_error: "अंत की तिथि आवश्यक है",
  }),
  reason: z.string().optional(),
}).refine((data) => {
  // If status is 'on_leave', leave_type is required
  if (data.status === 'on_leave' && !data.leave_type) {
    return false;
  }
  return true;
}, {
  message: "अवकाश प्रकार आवश्यक है",
  path: ["leave_type"],
}).refine((data) => {
  // Ensure end_date is not before start_date
  return data.end_date >= data.start_date;
}, {
  message: "अंत की तिथि शुरू की तिथि के बाद होनी चाहिए",
  path: ["end_date"],
});

interface AttendanceLeaveFormProps {
  type: 'trainee' | 'staff';
  personId?: string;
  onSuccess?: () => void;
}

export function AttendanceLeaveForm({ type, personId, onSuccess }: AttendanceLeaveFormProps) {
  const { i18n } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof attendanceFormSchema>>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      status: 'absent',
      start_date: new Date(),
      end_date: new Date(),
      reason: '',
    },
  });
  
  const watchStatus = form.watch('status');
  
  const handleSubmit = async (values: z.infer<typeof attendanceFormSchema>) => {
    if (!personId) {
      toast.error("कृपया पहले पीएनओ खोजें");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const startDate = format(values.start_date, 'yyyy-MM-dd');
      const endDate = format(values.end_date, 'yyyy-MM-dd');
      
      // If status is 'on_leave', create a leave record
      if (values.status === 'on_leave') {
        // Create properly typed leave record
        if (type === 'trainee') {
          const leaveData: TraineeLeave = {
            trainee_id: personId,
            start_date: startDate,
            end_date: endDate,
            reason: values.reason || 'कोई कारण नहीं दिया गया',
            status: 'approved', // By default setting as approved
            leave_type: values.leave_type,
          };
          
          const { error: leaveError } = await supabase
            .from(`${type}_leave`)
            .insert(leaveData);
          
          if (leaveError) throw leaveError;
        } else {
          const leaveData: StaffLeave = {
            staff_id: personId,
            start_date: startDate,
            end_date: endDate,
            reason: values.reason || 'कोई कारण नहीं दिया गया',
            status: 'approved', // By default setting as approved
            leave_type: values.leave_type,
          };
          
          const { error: leaveError } = await supabase
            .from(`${type}_leave`)
            .insert(leaveData);
          
          if (leaveError) throw leaveError;
        }
      }
      
      // Create attendance records for each day in the range
      let currentDate = new Date(values.start_date);
      const lastDate = new Date(values.end_date);
      
      while (currentDate <= lastDate) {
        const formattedDate = format(currentDate, 'yyyy-MM-dd');
        
        // Create properly typed attendance record
        if (type === 'trainee') {
          const attendanceData: TraineeAttendance = {
            trainee_id: personId,
            date: formattedDate,
            status: values.status,
          };
          
          const { error: attendanceError } = await supabase
            .from(`${type}_attendance`)
            .upsert(attendanceData);
          
          if (attendanceError) throw attendanceError;
        } else {
          const attendanceData: StaffAttendance = {
            staff_id: personId,
            date: formattedDate,
            status: values.status,
          };
          
          const { error: attendanceError } = await supabase
            .from(`${type}_attendance`)
            .upsert(attendanceData);
          
          if (attendanceError) throw attendanceError;
        }
        
        // Move to next day
        currentDate = addDays(currentDate, 1);
      }
      
      toast.success("अनुपस्थिति/अवकाश सफलतापूर्वक दर्ज किया गया");
      form.reset();
      if (onSuccess) onSuccess();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("फॉर्म जमा करने में त्रुटि हुई");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If no person selected yet, show a message
  if (!personId) {
    return (
      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-muted-foreground">कृपया अनुपस्थिति या अवकाश दर्ज करने के लिए पहले किसी व्यक्ति को खोजें।</p>
      </div>
    );
  }

  return (
    <Card className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">अनुपस्थिति / अवकाश दर्ज करें</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>स्थिति</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="स्थिति चुनें" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="absent">अनुपस्थित</SelectItem>
                      <SelectItem value="on_leave">छुट्टी पर</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchStatus === 'on_leave' && (
              <FormField
                control={form.control}
                name="leave_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>लेव टाइप</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="अवकाश प्रकार चुनें" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CL">CL</SelectItem>
                        <SelectItem value="EL">EL</SelectItem>
                        <SelectItem value="ML">ML</SelectItem>
                        <SelectItem value="maternity">मातृत्व अवकाश</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>तिथि से</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>तिथि चुनें</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>तिथि तक</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PP")
                          ) : (
                            <span>तिथि चुनें</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < form.getValues("start_date")}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>कारण</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="अनुपस्थिति या छुट्टी का कारण लिखें"
                    lang={i18n.language}
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full md:w-auto"
          >
            {isSubmitting ? 'जमा हो रहा है...' : 'जमा करें'}
          </Button>
        </form>
      </Form>
    </Card>
  );
}
