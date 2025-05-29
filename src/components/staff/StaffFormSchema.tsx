
import { z } from "zod";
import { BloodGroup, StaffRank } from "@/types/staff";
import { 
  pnoSchema, 
  mobileSchema, 
  nameSchema, 
  addressSchema, 
  pastDateSchema, 
  dateSchema 
} from "@/utils/inputValidation";

// List of blood groups for selection
export const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// List of staff ranks for selection
export const staffRanks: StaffRank[] = [
  "CONST", 
  "HC", 
  "SI", 
  "Inspector", 
  "DSP", 
  "SP", 
  "DIG", 
  "IG", 
  "ADGP", 
  "DGP"
];

// Enhanced schema for staff form validation with better security
export const staffFormSchema = z.object({
  pno: pnoSchema,
  name: nameSchema,
  father_name: nameSchema.refine(val => val !== '', { message: "Father's name is required" }),
  rank: z.enum([...staffRanks] as [string, ...string[]], { 
    required_error: "Rank is required" 
  }),
  current_posting_district: z.string().min(1, { message: "Current posting district is required" })
    .max(100, { message: "District name too long" }),
  mobile_number: mobileSchema,
  education: z.string().min(1, { message: "Education is required" })
    .max(100, { message: "Education field too long" }),
  date_of_birth: pastDateSchema,
  date_of_joining: dateSchema,
  blood_group: z.enum([...bloodGroups] as [string, ...string[]], { 
    required_error: "Blood group is required" 
  }),
  nominee: nameSchema.refine(val => val !== '', { message: "Nominee is required" }),
  home_address: addressSchema,
  toli_no: z.string().max(10, { message: "Toli number too long" }).optional(),
  class_no: z.string().max(10, { message: "Class number too long" }).optional(),
  class_subject: z.string().max(200, { message: "Class subject too long" }).optional(),
  photo_url: z.string().url({ message: "Invalid URL format" }).optional().or(z.literal("")),
}).refine(data => {
  // Validate age: person should be at least 18 years old
  const birthDate = new Date(data.date_of_birth);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  return age >= 18;
}, {
  message: "Person must be at least 18 years old",
  path: ["date_of_birth"],
});

// Type for form values based on the schema
export type StaffFormValues = z.infer<typeof staffFormSchema>;
