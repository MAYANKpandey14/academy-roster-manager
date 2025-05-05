
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
    <div className="space-y-4">
      <h3 className={`text-lg font-medium ${isHindi ? "font-mangal" : ""}`}>
        {isHindi ? "महत्वपूर्ण तिथियां" : "Important Dates"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "जन्म तिथि" : "Date of Birth"}*
              </FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  className={isHindi ? "font-mangal" : ""}
                />
              </FormControl>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_of_joining"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "शामिल होने की तिथि" : "Date of Joining"}*
              </FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  className={isHindi ? "font-mangal" : ""}
                />
              </FormControl>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="arrival_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "प्रशिक्षण के लिए आगमन तिथि" : "Date of Arrival for Training"}*
              </FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  className={isHindi ? "font-mangal" : ""}
                />
              </FormControl>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="departure_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "प्रशिक्षण के बाद प्रस्थान तिथि" : "Date of Departure after Training"}*
              </FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  className={isHindi ? "font-mangal" : ""}
                />
              </FormControl>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
