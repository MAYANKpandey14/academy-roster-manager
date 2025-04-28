
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
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  
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

      const startDate = data.start_date.toISOString().split('T')[0];
      const endDate = data.end_date.toISOString().split('T')[0];

      // Insert leave record based on type
      if (type === 'trainee') {
        const { error: leaveError } = await supabase
          .from('trainee_leave')
          .insert({
            trainee_id: person.id,
            start_date: startDate,
            end_date: endDate,
            reason: data.reason,
            status: 'pending'
          });

        if (leaveError) throw leaveError;
      } else {
        const { error: leaveError } = await supabase
          .from('staff_leave')
          .insert({
            staff_id: person.id,
            start_date: startDate,
            end_date: endDate,
            reason: data.reason,
            status: 'pending'
          });

        if (leaveError) throw leaveError;
      }

      // Create attendance records for each day of leave
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const formattedDate = date.toISOString().split('T')[0];
        
        if (type === 'trainee') {
          await supabase
            .from('trainee_attendance')
            .upsert({
              trainee_id: person.id,
              date: formattedDate,
              status: 'on_leave'
            });
        } else {
          await supabase
            .from('staff_attendance')
            .upsert({
              staff_id: person.id,
              date: formattedDate,
              status: 'on_leave'
            });
        }
      }

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
              <FormLabel className="dynamic-text">{t("pnoNumber")}</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder={t("enterPNO")} 
                  maxLength={9}
                  lang={i18n.language}
                />
              </FormControl>
              <FormMessage className="dynamic-text" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="dynamic-text">{t("startDate")}</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
              <FormMessage className="dynamic-text" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="dynamic-text">{t("endDate")}</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < form.getValues("start_date") || date < new Date()}
                className="rounded-md border"
              />
              <FormMessage className="dynamic-text" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="dynamic-text">{t("reasonForLeave")}</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder={t("enterReason")} 
                  lang={i18n.language}
                />
              </FormControl>
              <FormMessage className="dynamic-text" />
            </FormItem>
          )}
        />

        <Button type="submit">
          <span className="dynamic-text">{t("submitLeaveRequest")}</span>
        </Button>
      </form>
    </Form>
  );
}
