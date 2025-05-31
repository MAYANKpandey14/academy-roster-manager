
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "@/components/trainee/TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";

interface DateFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function DateFields({ form }: DateFieldsProps) {
  const { isHindi } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="date_of_birth"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'जन्म तिथि' : 'Date of Birth'}
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date_of_joining"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'नियुक्ति की तारीख' : 'Date of Joining'}
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="arrival_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'आगमन की तारीख' : 'Arrival Date'}
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="departure_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'प्रस्थान की तारीख' : 'Departure Date'}
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />
    </>
  );
}
