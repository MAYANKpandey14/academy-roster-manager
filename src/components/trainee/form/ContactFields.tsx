
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";
import { useTranslation } from "react-i18next";

interface ContactFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function ContactFields({ form }: ContactFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="mobile_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("mobileNumber", "Mobile Number")}</FormLabel>
            <FormControl>
              <Input maxLength={10} placeholder={t("enterMobileNumber", "Enter mobile number")} type="tel" {...field} />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="home_address"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel className="dynamic-text">{t("homeAddress", "Home Address")}</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={t("enterFullHomeAddress", "Enter full home address")} 
                className="min-h-[80px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />
    </>
  );
}
