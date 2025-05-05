
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "@/components/trainee/TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define blood groups here 
const bloodGroups = [
  "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
];

interface PersonalInfoFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  const { isHindi } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-medium ${isHindi ? "font-mangal" : ""}`}>
        {isHindi ? "व्यक्तिगत जानकारी" : "Personal Information"}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "नाम" : "Name"}*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "नाम दर्ज करें" : "Enter name"} 
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
          name="father_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "पिता का नाम" : "Father's Name"}*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "पिता का नाम दर्ज करें" : "Enter father's name"} 
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
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "शिक्षा" : "Education"}*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "शिक्षा दर्ज करें" : "Enter education"} 
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
          name="blood_group"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "रक्त समूह" : "Blood Group"}*
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className={isHindi ? "font-mangal" : ""}>
                    <SelectValue placeholder={isHindi ? "रक्त समूह चुनें" : "Select blood group"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bloodGroups.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
