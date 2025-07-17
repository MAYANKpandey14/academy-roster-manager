
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
  selectedImage?: File | null;
  onImageSelect?: (file: File) => void;
}

export const StaffForm = ({ initialData, onSubmit, isSubmitting = false, selectedImage, onImageSelect }: StaffFormProps) => {
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
              <div className="space-y-2">
                <label className="text-sm font-medium dynamic-text">
                  {isHindi ? 'स्टाफ फोटो (वैकल्पिक)' : 'Staff Photo (Optional)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onImageSelect) {
                      onImageSelect(file);
                    }
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedImage && (
                  <p className="text-sm text-green-600 dynamic-text">
                    {isHindi ? 'फ़ाइल चुनी गई:' : 'File selected:'} {selectedImage.name}
                  </p>
                )}
              </div>
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
