
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Form } from "@/components/ui/form";
import { PnoField } from "./fields/PnoField";
import { DateFields } from "./fields/DateFields";
import { ReasonField } from "./fields/ReasonField";
import { leaveFormSchema, LeaveFormValues } from "./LeaveFormSchema";
import { useLeaveSubmit } from "./useLeaveSubmit";

interface LeaveFormProps {
  type: 'trainee' | 'staff';
  onSuccess: () => void;
}

export function LeaveForm({ type, onSuccess }: LeaveFormProps) {
  const { isHindi } = useLanguage();
  
  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      pno: "",
      reason: "",
      start_date: "",
      end_date: "",
    },
  });

  const { handleSubmit } = useLeaveSubmit({ type, onSuccess });

  const onSubmit = async (data: LeaveFormValues) => {
    const success = await handleSubmit(data);
    if (success) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PnoField form={form} />
        <DateFields form={form} />
        <ReasonField form={form} />

        <Button type="submit">
          <span className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "अवकाश अनुरोध जमा करें" : "Submit Leave Request"}
          </span>
        </Button>
      </form>
    </Form>
  );
}
