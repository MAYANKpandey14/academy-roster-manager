
import { useFormContext } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { staffRanks } from "../StaffFormSchema";

type ServiceInfoFieldsProps = {
  isHindi: boolean;
};

export function ServiceInfoFields({ isHindi }: ServiceInfoFieldsProps) {
  const form = useFormContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="pno"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required="true" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "पीएनओ/यूनिक आईडी" : "PNO/Unique ID"}
            </FormLabel>
            <FormControl>
              <Input maxLength={12} {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rank"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required="true" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "रैंक" : "Rank"}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isHindi ? "रैंक चुनें" : "Select rank"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {staffRanks.map((rank) => (
                  <SelectItem key={rank} value={rank}>
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="current_posting_district"
        render={({ field }) => (
          <FormItem>
            <FormLabel aria-required="true" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}
            </FormLabel>
            <FormControl>
              <Input {...field} />
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
            <FormLabel aria-required="true" className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "भर्ती तिथि" : "Date of Joining"}
            </FormLabel>
            <FormControl>
              <Input {...field} type="date" />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="toli_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "टोली नंबर (वैकल्पिक)" : "Toli No (Optional)"}
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="class_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "क्लास नंबर (वैकल्पिक)" : "Class No (Optional)"}
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="class_subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "क्लास विषय (वैकल्पिक)" : "Class Subject (Optional)"}
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />
    </div>
  );
}
