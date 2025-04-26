
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";

interface ContactFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function ContactFields({ form }: ContactFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="mobile_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl>
              <Input maxLength={10} placeholder="Enter mobile number" type="tel" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="home_address"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Home Address</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter full home address" 
                className="min-h-[80px]" 
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
