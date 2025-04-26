
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";

interface DateFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function DateFields({ form }: DateFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="date_of_birth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="YYYY-MM-DD"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date_of_joining"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Joining</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="YYYY-MM-DD"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="arrival_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Arrival</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="YYYY-MM-DD"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="departure_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date of Departure</FormLabel>
            <FormControl>
              <Input 
                type="date" 
                placeholder="YYYY-MM-DD"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
