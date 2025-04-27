
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const leaveFormSchema = z.object({
  pno: z.string().min(1, "PNO is required"),
  reason: z.string().min(1, "Reason is required"),
  start_date: z.date({
    required_error: "Start date is required",
  }),
  end_date: z.date({
    required_error: "End date is required",
  }),
}).refine((data) => data.end_date >= data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

interface LeaveFormProps {
  type: 'trainee' | 'staff';
  onSuccess: () => void;
}

export function LeaveForm({ type, onSuccess }: LeaveFormProps) {
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      pno: "",
      reason: "",
    },
  });

  const onSubmit = async (data: LeaveFormValues) => {
    try {
      // First, find the trainee/staff
      const { data: person, error: findError } = await supabase
        .from(type === 'trainee' ? 'trainees' : 'staff')
        .select('id')
        .eq('pno', data.pno)
        .single();

      if (findError || !person) {
        toast.error(`${type === 'trainee' ? 'Trainee' : 'Staff member'} not found`);
        return;
      }

      // Insert leave record
      const { error: leaveError } = await supabase
        .from(`${type}_leave`)
        .insert({
          [`${type}_id`]: person.id,
          start_date: data.start_date.toISOString().split('T')[0],
          end_date: data.end_date.toISOString().split('T')[0],
          reason: data.reason,
        });

      if (leaveError) throw leaveError;

      // Create attendance records for each day of leave
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      const leaveDates = [];

      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        leaveDates.push({
          [`${type}_id`]: person.id,
          date: new Date(date).toISOString().split('T')[0],
          status: 'on_leave'
        });
      }

      const { error: attendanceError } = await supabase
        .from(`${type}_attendance`)
        .upsert(leaveDates);

      if (attendanceError) throw attendanceError;

      toast.success("Leave request submitted successfully");
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error submitting leave:', error);
      toast.error("Failed to submit leave request");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="pno"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PNO Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter PNO" maxLength={9} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>End Date</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < form.getValues("start_date") || date < new Date()}
                className="rounded-md border"
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for Leave</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter reason for leave" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Leave Request</Button>
      </form>
    </Form>
  );
}
