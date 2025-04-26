
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";

interface ServiceInfoFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function ServiceInfoFields({ form }: ServiceInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="pno"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PNO</FormLabel>
            <FormControl>
              <Input maxLength={9} placeholder="Enter PNO" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="chest_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chest No</FormLabel>
            <FormControl>
              <Input placeholder="Enter Chest No" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="current_posting_district"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Posting District</FormLabel>
            <FormControl>
              <Input placeholder="Enter district" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education</FormLabel>
            <FormControl>
              <Input placeholder="Enter education details" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
