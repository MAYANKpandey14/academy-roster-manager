
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "../LeaveFormSchema";

interface ReasonFieldProps {
  form: UseFormReturn<LeaveFormValues>;
}

export function ReasonField({ form }: ReasonFieldProps) {
  const { isHindi } = useLanguage();
  
  return (
    <FormField
      control={form.control}
      name="reason"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "अवकाश का कारण" : "Reason for Leave"}
          </FormLabel>
          <FormControl>
            <Textarea 
              {...field} 
              placeholder={isHindi ? "कारण दर्ज करें" : "Enter reason"} 
              lang={isHindi ? 'hi' : 'en'}
            />
          </FormControl>
          <FormMessage className={isHindi ? 'font-mangal' : ''} />
        </FormItem>
      )}
    />
  );
}
