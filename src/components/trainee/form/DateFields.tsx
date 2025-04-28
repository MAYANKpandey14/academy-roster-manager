
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";
import { useTranslation } from "react-i18next";

interface DateFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function DateFields({ form }: DateFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="date_of_birth"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("dateOfBirth", "Date of Birth")}</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="YYYY-MM-DD"
                {...field}
              />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date_of_joining"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("dateOfJoining", "Date of Joining")}</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="YYYY-MM-DD"
                {...field}
              />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="arrival_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("dateOfArrival", "Date of Arrival")}</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="YYYY-MM-DD"
                {...field}
              />
            </FormControl>
            <FormMessage className="dynamic-text" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="departure_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="dynamic-text">{t("dateOfDeparture", "Date of Departure")}</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="YYYY-MM-DD"
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
