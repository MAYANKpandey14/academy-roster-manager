
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues } from "@/components/staff/StaffFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { ValidationWarnings } from "@/components/common/ValidationWarnings";
import { ValidationWarning } from "@/hooks/useIntelligentValidation";

interface ContactInfoFieldsProps {
  form: UseFormReturn<StaffFormValues>;
  warnings?: ValidationWarning[];
}

export function ContactInfoFields({ form, warnings = [] }: ContactInfoFieldsProps) {
  const { isHindi } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="mobile_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "मोबाइल नंबर" : "Mobile Number"}
            </FormLabel>
            <FormControl>
              <Input maxLength={11} {...field} type="tel" />
            </FormControl>
            <ValidationWarnings warnings={warnings} fieldName="mobile_number" />
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="class_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "क्लास नंबर (वैकल्पिक)" : "Class No (Optional)"}
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="class_subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "क्लास विषय (वैकल्पिक)" : "Class Subject (Optional)"}
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />
    </>
  );
}
