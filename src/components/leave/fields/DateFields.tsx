
import { useLanguage } from "@/contexts/LanguageContext";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { LeaveFormValues } from "../LeaveFormSchema";

interface DateFieldsProps {
  form: UseFormReturn<LeaveFormValues>;
}

export function DateFields({ form }: DateFieldsProps) {
  const { isHindi } = useLanguage();
  
  // Get today's date in YYYY-MM-DD format for min value
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <>
      <FormField
        control={form.control}
        name="start_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-mangal' : ''}>
              {isHindi ? "प्रारंभ तिथि" : "Start Date"}
            </FormLabel>
            <FormControl>
              <Input 
                {...field}
                type="date" 
                min={today}
              />
            </FormControl>
            <FormMessage className={isHindi ? 'font-mangal' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="end_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-mangal' : ''}>
              {isHindi ? "अंतिम तिथि" : "End Date"}
            </FormLabel>
            <FormControl>
              <Input 
                {...field}
                type="date"
                min={form.watch("start_date") || today}
              />
            </FormControl>
            <FormMessage className={isHindi ? 'font-mangal' : ''} />
          </FormItem>
        )}
      />
    </>
  );
}
