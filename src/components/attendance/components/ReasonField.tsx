
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AttendanceFormValues } from "../schema";

export function ReasonField() {
  const { i18n } = useTranslation();
  const form = useFormContext<AttendanceFormValues>();
  
  return (
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
  );
}
