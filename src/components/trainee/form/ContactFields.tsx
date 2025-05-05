
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "@/components/trainee/TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";

interface ContactFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function ContactFields({ form }: ContactFieldsProps) {
  const { isHindi } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-medium ${isHindi ? "font-mangal" : ""}`}>
        {isHindi ? "संपर्क जानकारी" : "Contact Information"}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="mobile_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "मोबाइल नंबर" : "Mobile Number"}*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "मोबाइल नंबर दर्ज करें" : "Enter mobile number"} 
                  {...field} 
                  className={isHindi ? "font-mangal" : ""}
                  maxLength={10}
                />
              </FormControl>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nominee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "नामांकित" : "Nominee"}*
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder={isHindi ? "नामांकित का नाम दर्ज करें" : "Enter nominee name"} 
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
          name="home_address"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2">
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "घर का पता" : "Home Address"}*
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={isHindi ? "पता दर्ज करें" : "Enter address"} 
                  {...field} 
                  className={isHindi ? "font-mangal" : ""}
                  rows={3}
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
