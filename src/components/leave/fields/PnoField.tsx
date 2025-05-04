
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

interface PnoFieldProps {
  form: UseFormReturn<LeaveFormValues>;
}

export function PnoField({ form }: PnoFieldProps) {
  const { isHindi } = useLanguage();
  
  return (
    <FormField
      control={form.control}
      name="pno"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={isHindi ? 'font-mangal' : ''}>
            {isHindi ? "पीएनओ नंबर" : "PNO Number"}
          </FormLabel>
          <FormControl>
            <Input 
              {...field} 
              placeholder={isHindi ? "पीएनओ दर्ज करें" : "Enter PNO"} 
              maxLength={9}
              lang={isHindi ? 'hi' : 'en'}
            />
          </FormControl>
          <FormMessage className={isHindi ? 'font-mangal' : ''} />
        </FormItem>
      )}
    />
  );
}
