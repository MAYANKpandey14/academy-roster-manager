import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

interface AttendanceFormProps {
  personType: 'trainee' | 'staff';
  personId: string;
  pno: string;
  onSuccess: () => void;
}

// Updated form schema with new status options
const formSchema = z.object({
  status: z.enum(["absent", "on_leave", "suspension", "resignation", "termination"]),
  leaveType: z.string().optional(),
  startDate: z.string({
    required_error: "Start date is required",
  }),
  endDate: z.string().optional(),
  reason: z.string().min(3, {
    message: "Reason must be at least 3 characters",
  }),
});

export function AttendanceForm({ personType, personId, pno, onSuccess }: AttendanceFormProps) {
  const { isHindi } = useLanguage();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Setup form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "absent",
      leaveType: undefined,
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: undefined,
      reason: "",
    },
  });
  
  const watchStatus = form.watch("status");
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (values.status === "absent") {
        // Record absence in the attendance table with reason
        if (personType === "trainee") {
          const attendanceData = {
            trainee_id: personId,
            date: values.startDate,
            status: "absent",  // Using the status field correctly
            reason: values.reason // Store reason explicitly
          };
          
          const { error } = await supabase
            .from("trainee_attendance")
            .insert(attendanceData);
            
          if (error) throw error;
        } else {
          const attendanceData = {
            staff_id: personId,
            date: values.startDate,
            status: "absent",
            reason: values.reason // Store reason explicitly
          };
          
          const { error } = await supabase
            .from("staff_attendance")
            .insert(attendanceData);
            
          if (error) throw error;
        }
        
      } else if (values.status === "on_leave") {
        // Record leave in the leave table
        const endDate = values.endDate || values.startDate;
        
        if (personType === "trainee") {
          const leaveData = {
            trainee_id: personId,
            start_date: values.startDate,
            end_date: endDate,
            reason: values.reason,
            leave_type: values.leaveType || null,
            status: "approved" 
          };
          
          const { error } = await supabase
            .from("trainee_leave")
            .insert(leaveData);
            
          if (error) throw error;
        } else {
          const leaveData = {
            staff_id: personId,
            start_date: values.startDate,
            end_date: endDate,
            reason: values.reason,
            leave_type: values.leaveType || null,
            status: "approved" 
          };
          
          const { error } = await supabase
            .from("staff_leave")
            .insert(leaveData);
            
          if (error) throw error;
        }
      } else {
        // Handle other status types (suspension, resignation, termination)
        if (personType === "trainee") {
          const statusData = {
            trainee_id: personId,
            date: values.startDate,
            status: values.status,
            reason: values.reason // Store reason explicitly
          };
          
          const { error } = await supabase
            .from("trainee_attendance")
            .insert(statusData);
            
          if (error) throw error;
        } else {
          const statusData = {
            staff_id: personId,
            date: values.startDate,
            status: values.status,
            reason: values.reason // Store reason explicitly
          };
          
          const { error } = await supabase
            .from("staff_attendance")
            .insert(statusData);
            
          if (error) throw error;
        }
      }
      
      toast.success(isHindi 
        ? "रिकॉर्ड सफलतापूर्वक जोड़ा गया" 
        : "Record added successfully");
        
      // Reset form and invalidate queries to refresh data
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      onSuccess();
      
    } catch (error) {
      console.error("Error submitting record:", error);
      toast.error(isHindi 
        ? "रिकॉर्ड जोड़ने में त्रुटि" 
        : "Error adding record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "स्थिति" : "Status"}
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="transition-all duration-200">
                      <SelectValue placeholder={isHindi ? "स्थिति चुनें" : "Select status"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="absent">
                      <span className={isHindi ? "font-mangal" : ""}>
                        {isHindi ? "अनुपस्थित" : "Absent"}
                      </span>
                    </SelectItem>
                    <SelectItem value="on_leave">
                      <span className={isHindi ? "font-mangal" : ""}>
                        {isHindi ? "अवकाश पर" : "On Leave"}
                      </span>
                    </SelectItem>
                    <SelectItem value="suspension">
                      <span className={isHindi ? "font-mangal" : ""}>
                        {isHindi ? "निलंबन" : "Suspension"}
                      </span>
                    </SelectItem>
                    <SelectItem value="resignation">
                      <span className={isHindi ? "font-mangal" : ""}>
                        {isHindi ? "इस्तीफ़ा" : "Resignation"}
                      </span>
                    </SelectItem>
                    <SelectItem value="termination">
                      <span className={isHindi ? "font-mangal" : ""}>
                        {isHindi ? "बर्खास्त" : "Termination"}
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {watchStatus === "on_leave" && (
            <FormField
              control={form.control}
              name="leaveType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "छुट्टी का प्रकार" : "Leave Type"}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="transition-all duration-200">
                        <SelectValue placeholder={isHindi ? "छुट्टी का प्रकार चुनें" : "Select leave type"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CL">
                        <span>
                          {isHindi ? "आकस्मिक अवकाश (CL)" : "Casual Leave (CL)"}
                        </span>
                      </SelectItem>
                      <SelectItem value="EL">
                        <span>
                          {isHindi ? "अर्जित अवकाश (EL)" : "Earned Leave (EL)"}
                        </span>
                      </SelectItem>
                      <SelectItem value="ML">
                        <span>
                          {isHindi ? "चिकित्सा अवकाश (ML)" : "Medical Leave (ML)"}
                        </span>
                      </SelectItem>
                      <SelectItem value="MAT">
                        <span>
                          {isHindi ? "मातृत्व अवकाश" : "Maternity Leave"}
                        </span>
                      </SelectItem>
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
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "दिनांक से" : "Date From"}
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="transition-all duration-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {watchStatus === "on_leave" && (
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "दिनांक तक" : "Date To"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className="transition-all duration-200"
                      min={form.getValues("startDate")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "कारण" : "Reason"}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={isHindi ? "कारण दर्ज करें" : "Enter reason"}
                  className={isHindi ? "font-mangal transition-all duration-200" : "transition-all duration-200"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full md:w-auto transition-all duration-200 hover:scale-105 active:scale-95 animate-fade-in"
        >
          {isSubmitting ? (
            <span className={isHindi ? "font-mangal" : ""}>
              {isHindi ? "प्रस्तुत किया जा रहा है..." : "Submitting..."}
            </span>
          ) : (
            <span className={isHindi ? "font-mangal" : ""}>
              {isHindi ? "जमा करें" : "Submit"}
            </span>
          )}
        </Button>
      </form>
    </Form>
  );
}
