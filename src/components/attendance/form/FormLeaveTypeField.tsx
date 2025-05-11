
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

export function FormLeaveTypeField() {
  const { isHindi } = useLanguage();
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="leaveType"
      render={({ field }) => (
        <FormItem>
          <FormLabel className={isHindi ? "font-mangal" : ""}>
            {isHindi ? "छुट्टी का प्रकार" : "Leave Type"}
          </FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="transition-all duration-200">
                <SelectValue placeholder={isHindi ? "छुट्टी का प्रकार चुनें" : "Select leave type"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="CL">
                <span>
                  {isHindi ? "आकस्मिक अवकाश (CL)" : "Casual Leave (CL)"}
                </span>
              </SelectItem>
              <SelectItem value="EL">
                <span>
                  {isHindi ? "अर्जित अवकाश (EL)" : "Earned Leave (EL)"}
                </span>
              </SelectItem>
              <SelectItem value="ML">
                <span>
                  {isHindi ? "चिकित्सा अवकाश (ML)" : "Medical Leave (ML)"}
                </span>
              </SelectItem>
              <SelectItem value="MAT">
                <span>
                  {isHindi ? "मातृत्व अवकाश" : "Maternity Leave"}
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
