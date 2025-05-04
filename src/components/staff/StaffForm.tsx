import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Staff } from "@/types/staff";
import { staffFormSchema, StaffFormValues, bloodGroups, staffRanks } from "./StaffFormSchema";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageUpload } from "@/components/common/ImageUpload";

interface StaffFormProps {
  initialData?: Staff;
  onSubmit: (data: StaffFormValues) => void;
  isSubmitting?: boolean;
}

export const StaffForm = ({ initialData, onSubmit, isSubmitting = false }: StaffFormProps) => {
  const { isHindi } = useLanguage();
  
  // Apply language inputs hook
  useLanguageInputs();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: initialData || {
      pno: "",
      name: "",
      father_name: "",
      rank: undefined,
      current_posting_district: "",
      mobile_number: "",
      education: "",
      date_of_birth: "",
      date_of_joining: "",
      blood_group: undefined,
      nominee: "",
      home_address: "",
      toli_no: "",
      class_no: "",
      class_subject: "",
      photo_url: "",
    },
  });

  const handleFormSubmit = (data: StaffFormValues) => {
    onSubmit(data);
  };

  const handleImageUpload = (url: string) => {
    form.setValue("photo_url", url);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pno"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "पीएनओ" : "PNO"}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "नाम" : "Name"}
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
            name="father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "पिता का नाम" : "Father's Name"}
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
            name="mobile_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "मोबाइल नंबर" : "Mobile Number"}
                </FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage className={isHindi ? 'font-hindi' : ''} />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "शिक्षा" : "Education"}
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
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "जन्म तिथि" : "Date of Birth"}
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
            name="date_of_joining"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
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
            name="blood_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "रक्त समूह" : "Blood Group"}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={isHindi ? "रक्त समूह चुनें" : "Select blood group"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group} >
                        {group}
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
            name="nominee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "नॉमिनी" : "Nominee"}
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
            name="home_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? 'font-hindi' : ''}>
                  {isHindi ? "घर का पता" : "Home Address"}
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
          
          <div className="col-span-1 md:col-span-2">
            <ImageUpload 
              bucketName="staff_photos"
              entityId={initialData?.id}
              initialImageUrl={initialData?.photo_url}
              onImageUpload={handleImageUpload}
              label={isHindi ? 'स्टाफ फोटो' : 'Staff Photo'}
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          <span className={isHindi ? 'font-hindi' : ''}>
            {isSubmitting 
              ? (isHindi ? "सेव हो रहा है..." : "Saving...") 
              : initialData 
                ? (isHindi ? "स्टाफ अपडेट करें" : "Update Staff") 
                : (isHindi ? "स्टाफ जोड़ें" : "Add Staff")
            }
          </span>
        </Button>
      </form>
    </Form>
  );
};
