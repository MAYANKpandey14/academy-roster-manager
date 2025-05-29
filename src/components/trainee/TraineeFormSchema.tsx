
import { z } from "zod";
import { BloodGroup, TraineeRank } from "@/types/trainee";
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

// List of ranks for selection
export const traineeRanks: TraineeRank[] = [
  "R/CONST", 
  "CONST", 
  "CONST/PTI", 
  "HC/CP", 
  "HC/AP", 
  "HC-ITI", 
  "HC-PTI", 
  "SI/AP", 
  "SI/CP", 
  "RI", 
  "RSI", 
  "Inspector"
];

// Enhanced schema for form validation with better security
export const traineeFormSchema = z.object({
  pno: pnoSchema,
  chest_no: z.string().min(1, { message: "Chest number is required" })
    .max(20, { message: "Chest number too long" }),
  name: nameSchema,
  father_name: nameSchema.refine(val => val !== '', { message: "Father's name is required" }),
  rank: z.enum([...traineeRanks] as [string, ...string[]]).optional(),
  toli_no: z.string().max(10, { message: "Toli number too long" }).optional(),
  arrival_date: dateSchema,
  departure_date: dateSchema,
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
  photo_url: z.string().url({ message: "Invalid URL format" }).optional().or(z.literal("")),
}).refine(data => {
  // Validate date range: departure should be after arrival
  const arrival = new Date(data.arrival_date);
  const departure = new Date(data.departure_date);
  return departure > arrival;
}, {
  message: "Departure date must be after arrival date",
  path: ["departure_date"],
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
export type TraineeFormValues = z.infer<typeof traineeFormSchema>;
