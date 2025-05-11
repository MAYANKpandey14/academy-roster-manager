
import { useFormContext } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export function FormReasonField() {
  const { isHindi } = useLanguage();
  const form = useFormContext();
  
  return (
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
  );
}
