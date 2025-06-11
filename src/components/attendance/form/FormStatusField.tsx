
import { useFormContext, useWatch } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function FormStatusField() {
  const { isHindi } = useLanguage();
  const form = useFormContext();
  const watchStatus = useWatch({ control: form.control, name: "status" });
  
  return (
    <>
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? "font-mangal" : ""}>
              {isHindi ? "स्थिति" : "Status"}
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="transition-all duration-200">
                  <SelectValue placeholder={isHindi ? "स्थिति चुनें" : "Select status"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="absent">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "अनुपस्थित" : "Absent"}
                  </span>
                </SelectItem>
                <SelectItem value="duty">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "ड्यूटी" : "Duty"}
                  </span>
                </SelectItem>
                <SelectItem value="training">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "प्रशिक्षण" : "Training"}
                  </span>
                </SelectItem>
                <SelectItem value="on_leave">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "अवकाश पर" : "On Leave"} *
                  </span>
                </SelectItem>
                <SelectItem value="return_to_unit">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "यूनिट वापसी" : "Return to Unit"}
                  </span>
                </SelectItem>
                <SelectItem value="suspension">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "निलंबन" : "Suspension"}
                  </span>
                </SelectItem>
                <SelectItem value="resignation">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "इस्तीफ़ा" : "Resignation"} *
                  </span>
                </SelectItem>
                <SelectItem value="termination">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "बर्खास्त" : "Termination"}
                  </span>
                </SelectItem>
                <SelectItem value="other">
                  <span className={isHindi ? "font-mangal" : ""}>
                    {isHindi ? "अन्य" : "Other"}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription className="text-xs">
              {isHindi 
                ? "* अनुमोदन की आवश्यकता है" 
                : "* Requires approval"}
            </FormDescription>
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
                  placeholder={isHindi ? "कस्टम स्थिति दर्ज करें..." : "Enter custom status..."} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
