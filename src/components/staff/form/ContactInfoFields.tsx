
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type ContactInfoFieldsProps = {
  isHindi: boolean;
};

export function ContactInfoFields({ isHindi }: ContactInfoFieldsProps) {
  const form = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="mobile_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required="true" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "मोबाइल नंबर" : "Mobile Number"}
            </FormLabel>
            <FormControl>
              <Input maxLength={11} {...field} type="tel" />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <div className="md:col-span-2">
        <FormField
          control={form.control}
          name="home_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel aria-required="true" className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "घर का पता" : "Home Address"}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className={isHindi ? 'font-hindi' : ''} />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
