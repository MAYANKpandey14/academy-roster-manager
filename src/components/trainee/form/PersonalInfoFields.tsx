
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bloodGroups } from "../TraineeFormSchema";
import { useTranslation } from "react-i18next";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("name", "Name")}</FormLabel>
            <FormControl>
              <Input required {...field} />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="father_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("fatherName", "Father's Name")}</FormLabel>
            <FormControl>
              <Input required {...field} />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="blood_group"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("bloodGroup", "Blood Group")}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} required>
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {bloodGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nominee"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("nominee", "Nominee")}</FormLabel>
            <FormControl>
              <Input required {...field} />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />
    </>
  );
}
