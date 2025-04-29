import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AttendanceRecord } from "./types";
import { attendanceFormSchema, AttendanceFormValues } from "./AttendanceFormSchema";
import { useAttendance } from "@/hooks/useAttendance";
import { useQueryClient } from "@tanstack/react-query";

export function AttendanceForm({ onSuccess }: { onSuccess?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { addAttendance } = useAttendance();

  const form = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      pno: "",
      name: "",
      type: "Absent",
      rank: "",
      phone: "",
      date_from: new Date().toISOString().split('T')[0],
      date_to: new Date().toISOString().split('T')[0],
      reason: "",
      leave_type: undefined,
    },
  });

  const handleSubmit = async (values: AttendanceFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Create record with all required fields
      const record: AttendanceRecord = {
        pno: values.pno || '', // Ensure pno is always provided
        name: values.name || '',
        type: values.type as 'Absent' | 'On Leave',
        rank: values.rank,
        phone: values.phone,
        date_from: values.date_from,
        date_to: values.date_to,
        reason: values.reason,
        leave_type: values.type === 'On Leave' ? values.leave_type as 'CL' | 'EL' | 'ML' | 'Maternity Leave' : null
      };
      
      // Call the addAttendance mutation
      await addAttendance(queryClient).mutateAsync(record);

      // Reset the form and state
      form.reset();
      setIsSubmitting(false);

      // Optionally call the onSuccess callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(`अटेंडेंस रिकॉर्ड जोड़ने में त्रुटि: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>नया अटेंडेंस रिकॉर्ड जोड़ें</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="pno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पी.एन.ओ.</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>नाम</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>पद</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>फ़ोन</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>प्रकार</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Absent">अनुपस्थित</SelectItem>
                      <SelectItem value="On Leave">अवकाश पर</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("type") === "On Leave" && (
              <FormField
                control={form.control}
                name="leave_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>अवकाश प्रकार</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CL">आकस्मिक छुट्टी (CL)</SelectItem>
                        <SelectItem value="EL">अर्जित छुट्टी (EL)</SelectItem>
                        <SelectItem value="ML">चिकित्सा छुट्टी (ML)</SelectItem>
                        <SelectItem value="Maternity Leave">मातृत्व अवकाश</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="date_from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>कब से</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>कब तक</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>कारण</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "जमा कर रहा है..." : "जमा करें"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
