
import { useFormContext } from "react-hook-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function FormStatusField() {
  const { isHindi } = useLanguage();
  const form = useFormContext();
  
  return (
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
              <SelectItem value="on_leave">
                <span className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "अवकाश पर" : "On Leave"}
                </span>
              </SelectItem>
              <SelectItem value="suspension">
                <span className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "निलंबन" : "Suspension"}
                </span>
              </SelectItem>
              <SelectItem value="resignation">
                <span className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "इस्तीफ़ा" : "Resignation"}
                </span>
              </SelectItem>
              <SelectItem value="termination">
                <span className={isHindi ? "font-mangal" : ""}>
                  {isHindi ? "बर्खास्त" : "Termination"}
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
