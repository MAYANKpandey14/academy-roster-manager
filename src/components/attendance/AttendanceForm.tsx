
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";

interface AttendanceFormProps {
  personType: 'trainee' | 'staff';
  personId: string;
  pno: string;
  onSuccess: () => void;
}

// Form schema with validation
const formSchema = z.object({
  status: z.enum(["absent", "on_leave"]),
  leaveType: z.string().optional(),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date().optional(),
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
      startDate: new Date(),
      endDate: undefined,
      reason: "",
    },
  });
  
  const watchStatus = form.watch("status");
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      if (values.status === "absent") {
        // Record absence in the attendance table
        const tableName = personType === "trainee" ? "trainee_attendance" : "staff_attendance";
        const idField = personType === "trainee" ? "trainee_id" : "staff_id";
        
        const { error } = await supabase
          .from(tableName)
          .insert({
            [idField]: personId,
            date: format(values.startDate, "yyyy-MM-dd"),
            status: "absent",
            reason: values.reason,
          });
          
        if (error) throw error;
        
      } else if (values.status === "on_leave") {
        // Record leave in the leave table
        const tableName = personType === "trainee" ? "trainee_leave" : "staff_leave";
        const idField = personType === "trainee" ? "trainee_id" : "staff_id";
        
        const endDate = values.endDate || values.startDate;
        
        const { error } = await supabase
          .from(tableName)
          .insert({
            [idField]: personId,
            start_date: format(values.startDate, "yyyy-MM-dd"),
            end_date: format(endDate, "yyyy-MM-dd"),
            reason: values.reason,
            leave_type: values.leaveType || null,
            status: "approved",
          });
          
        if (error) throw error;
      }
      
      toast.success(isHindi 
        ? "रिकॉर्ड सफलतापूर्वक जोड़ा गया" 
        : "Record added successfully");
        
      // Reset form and invalidate queries to refresh data
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                    <SelectTrigger>
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
                        {isHindi ? "छुट्टी पर" : "On Leave"}
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
                      <SelectTrigger>
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
                          format(field.value, "PPP")
                        ) : (
                          <span>{isHindi ? "दिनांक चुनें" : "Pick a date"}</span>
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
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
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
                            format(field.value, "PPP")
                          ) : (
                            <span>{isHindi ? "दिनांक चुनें" : "Pick a date"}</span>
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
                        disabled={(date) => date < form.getValues("startDate")}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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
                  className={isHindi ? "font-mangal" : ""}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
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
