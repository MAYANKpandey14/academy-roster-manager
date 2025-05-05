
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "@/components/trainee/TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define trainee ranks here since they're missing from the TraineeFormSchema
const traineeRanks = [
  { value: "CONST", label: "Constable" },
  { value: "HC", label: "Head Constable" },
  { value: "ASI", label: "Assistant Sub-Inspector" },
  { value: "SI", label: "Sub-Inspector" },
  { value: "INSP", label: "Inspector" }
];

interface ServiceInfoFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function ServiceInfoFields({ form }: ServiceInfoFieldsProps) {
  const { isHindi } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-medium ${isHindi ? "font-mangal" : ""}`}>
        {isHindi ? "सेवा जानकारी" : "Service Information"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="pno"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "पी.एन.ओ." : "PNO"}*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "पी.एन.ओ. दर्ज करें" : "Enter PNO"} 
                  {...field} 
                  className={isHindi ? "font-mangal" : ""}
                  maxLength={9}
                />
              </FormControl>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chest_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "छाती नंबर" : "Chest Number"}*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "छाती नंबर दर्ज करें" : "Enter chest number"} 
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
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "रैंक" : "Rank"}*
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={isHindi ? "font-mangal" : ""}>
                    <SelectValue placeholder={isHindi ? "रैंक चुनें" : "Select rank"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {traineeRanks.map((rank) => (
                    <SelectItem key={rank.value} value={rank.value}>
                      <span className={isHindi ? "font-mangal" : ""}>
                        {rank.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="toli_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "टोली नंबर" : "Toli Number"}
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "टोली नंबर दर्ज करें" : "Enter toli number"} 
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
          name="current_posting_district"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "वर्तमान पोस्टिंग जिला" : "Current Posting District"}*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "जिला दर्ज करें" : "Enter district"} 
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
