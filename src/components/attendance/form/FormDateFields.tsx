
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function FormDateFields() {
  const { isHindi } = useLanguage();
  const form = useFormContext();
  const watchStatus = useWatch({ control: form.control, name: "status" });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel className={isHindi ? "font-mangal" : ""}>
              {isHindi ? "दिनांक से" : "Date From"}
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                className="transition-all duration-200"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {watchStatus === "on_leave" && (
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "दिनांक तक" : "Date To"}
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="transition-all duration-200"
                  min={form.getValues("startDate")}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
