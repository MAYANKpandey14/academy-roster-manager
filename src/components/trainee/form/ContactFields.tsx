import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { ValidationWarnings } from "@/components/common/ValidationWarnings";
import { ValidationWarning } from "@/hooks/useIntelligentValidation";

interface ContactFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
  warnings?: ValidationWarning[];
}

export function ContactFields({ form, warnings = [] }: ContactFieldsProps) {
  const { isHindi } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="mobile_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'मोबाइल नंबर' : 'Mobile Number'}
            </FormLabel>
            <FormControl>
              <Input maxLength={10} type="tel" pattern="[0-9]{10}" {...field} />
            </FormControl>
            <ValidationWarnings warnings={warnings} fieldName="mobile_number" />
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="home_address"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'घर का पता' : 'Home Address'}
            </FormLabel>
            <FormControl>
              <Textarea 
                className="min-h-[80px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />
    </>
  );
}
