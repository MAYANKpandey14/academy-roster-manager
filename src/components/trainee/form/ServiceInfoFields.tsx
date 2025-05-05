
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues, ranks } from "@/components/trainee/TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ServiceInfoFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function ServiceInfoFields({ form }: ServiceInfoFieldsProps) {
  const { isHindi } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-medium ${isHindi ? 'font-hindi' : ''}`}>
        {isHindi ? "सेवा विवरण" : "Service Information"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pno"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "पीएनओ" : "PNO"}
              </FormLabel>
              <FormControl>
                <Input {...field} maxLength={9} />
              </FormControl>
              <FormMessage className={isHindi ? 'font-hindi' : ''} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chest_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "चेस्ट नंबर" : "Chest Number"}
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
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "रैंक" : "Rank"}
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isHindi ? "रैंक चुनें" : "Select rank"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ranks.map((rank) => (
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
              <FormLabel className={isHindi ? 'font-hindi' : ''}>
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
          name="toli_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? 'font-hindi' : ''}>
                {isHindi ? "टोली नंबर (वैकल्पिक)" : "Toli Number (Optional)"}
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
