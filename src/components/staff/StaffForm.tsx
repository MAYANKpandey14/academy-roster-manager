
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
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";

interface StaffFormProps {
  initialData?: Staff;
  onSubmit: (data: StaffFormValues) => void;
  isSubmitting?: boolean;
}

export const StaffForm = ({ initialData, onSubmit, isSubmitting = false }: StaffFormProps) => {
  const { t } = useTranslation();
  
  // Apply language inputs hook
  useLanguageInputs();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: initialData || {
      pno: "",
      name: "",
      father_name: "",
      rank: "Instructor",
      current_posting_district: "",
      mobile_number: "",
      education: "",
      date_of_birth: "",
      date_of_joining: "",
      blood_group: "A+",
      nominee: "",
      home_address: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="pno"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("pno", "PNO")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("name", "Name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="father_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("fatherName", "Father's Name")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rank"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("rank", "Rank")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectRank", "Select rank")} />
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
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_posting_district"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("currentPostingDistrict", "Current Posting District")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("mobileNumber", "Mobile Number")}</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("education", "Education")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("dateOfBirth", "Date of Birth")}</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_joining"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("dateOfJoining", "Date of Joining")}</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blood_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("bloodGroup", "Blood Group")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBloodGroup", "Select blood group")} />
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
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nominee"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("nominee", "Nominee")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="home_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("homeAddress", "Home Address")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="toli_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("toliNo", "Toli No (Optional)")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("classNo", "Class No (Optional)")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="class_subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dynamic-text">{t("classSubject", "Class Subject (Optional)")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="dynamic-text" />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          <span className="dynamic-text">
            {isSubmitting 
              ? t("saving", "Saving...") 
              : initialData 
                ? t("updateStaff", "Update Staff") 
                : t("addStaff", "Add Staff")
            }
          </span>
        </Button>
      </form>
    </Form>
  );
};
