
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AttendanceFormValues } from "../schema";

export function StatusField() {
  const form = useFormContext<AttendanceFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>स्थिति</FormLabel>
          <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="स्थिति चुनें" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="absent">अनुपस्थित</SelectItem>
              <SelectItem value="on_leave">छुट्टी पर</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function LeaveTypeField() {
  const form = useFormContext<AttendanceFormValues>();
  
  return (
    <FormField
      control={form.control}
      name="leave_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>लेव टाइप</FormLabel>
          <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="अवकाश प्रकार चुनें" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="CL">CL</SelectItem>
              <SelectItem value="EL">EL</SelectItem>
              <SelectItem value="ML">ML</SelectItem>
              <SelectItem value="maternity">मातृत्व अवकाश</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
