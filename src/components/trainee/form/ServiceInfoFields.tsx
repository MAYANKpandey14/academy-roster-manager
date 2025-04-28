
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";
import { useTranslation } from "react-i18next";

interface ServiceInfoFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function ServiceInfoFields({ form }: ServiceInfoFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="pno"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("pno", "PNO")}</FormLabel>
            <FormControl>
              <Input maxLength={9} placeholder={t("enterPNO", "Enter PNO")} {...field} />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chest_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("chestNo", "Chest No")}</FormLabel>
            <FormControl>
              <Input placeholder={t("enterChestNo", "Enter Chest No")} {...field} />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="current_posting_district"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("currentPostingDistrict", "Current Posting District")}</FormLabel>
            <FormControl>
              <Input placeholder={t("enterDistrict", "Enter district")} {...field} />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("education", "Education")}</FormLabel>
            <FormControl>
              <Input placeholder={t("enterEducationDetails", "Enter education details")} {...field} />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />
    </>
  );
}
