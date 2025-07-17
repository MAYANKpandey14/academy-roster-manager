
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import { Staff } from "@/types/staff";
import { staffFormSchema, StaffFormValues } from "./StaffFormSchema";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { useLanguage } from "@/contexts/LanguageContext";
import { ImageUpload } from "@/components/common/ImageUpload";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { ServiceInfoFields } from "./form/ServiceInfoFields";
import { ContactInfoFields } from "./form/ContactInfoFields";

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
      arrival_date: "",
      departure_date: "",
      blood_group: undefined,
      nominee: "",
      home_address: "",
      toli_no: "",
      class_no: "",
      class_subject: "",
      photo_url: "",
      category_caste: "",
    },
  });

  const handleFormSubmit = (data: StaffFormValues) => {
    onSubmit(data);
  };

  const handleImageUpload = (url: string | null) => {
    form.setValue("photo_url", url || '');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonalInfoFields form={form} />
          <ServiceInfoFields form={form} />
          <ContactInfoFields form={form} />
          
          <div className="col-span-1 md:col-span-2">
            {initialData?.id ? (
              <ImageUpload 
                bucketName="staff_photos"
                entityId={initialData.id}
                initialImageUrl={initialData.photo_url}
                onImageUpload={handleImageUpload}
                label={isHindi ? 'स्टाफ फोटो (वैकल्पिक)' : 'Staff Photo (Optional)'}
              />
            ) : (
              <ImageUpload 
                bucketName="staff_photos"
                onImageUpload={handleImageUpload}
                label={isHindi ? 'स्टाफ फोटो (वैकल्पिक)' : 'Staff Photo (Optional)'}
              />
            )}
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
