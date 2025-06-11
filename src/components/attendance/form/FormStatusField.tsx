
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function FormStatusField() {
  const { isHindi } = useLanguage();
  const form = useFormContext();
  const watchStatus = useWatch({ control: form.control, name: "status" });

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? "font-mangal" : ""}>
              {isHindi ? "स्थिति" : "Status"}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="transition-all duration-200">
                  <SelectValue placeholder={isHindi ? "स्थिति चुनें" : "Select status"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="absent">{isHindi ? "अनुपस्थित" : "Absent"}</SelectItem>
                <SelectItem value="duty">{isHindi ? "ड्यूटी" : "Duty"}</SelectItem>
                <SelectItem value="training">{isHindi ? "प्रशिक्षण" : "Training"}</SelectItem>
                <SelectItem value="on_leave">{isHindi ? "छुट्टी पर" : "On Leave"}</SelectItem>
                <SelectItem value="return_to_unit">{isHindi ? "यूनिट वापसी" : "Return to Unit"}</SelectItem>
                <SelectItem value="suspension">{isHindi ? "निलंबन" : "Suspension"}</SelectItem>
                <SelectItem value="resignation">{isHindi ? "इस्तीफ़ा" : "Resignation"}</SelectItem>
                <SelectItem value="termination">{isHindi ? "बर्खास्त" : "Termination"}</SelectItem>
                <SelectItem value="other">{isHindi ? "अन्य" : "Other"}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {watchStatus === "other" && (
        <FormField
          control={form.control}
          name="customStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "कस्टम स्थिति" : "Custom Status"}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={isHindi ? "कस्टम स्थिति दर्ज करें" : "Enter custom status"}
                  {...field}
                  className="transition-all duration-200"
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
