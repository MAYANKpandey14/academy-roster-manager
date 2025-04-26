
// This file is kept for reference purposes only
// Use either AddTraineeForm.tsx or EditTraineeForm.tsx instead

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { traineeFormSchema, TraineeFormValues } from "./TraineeFormSchema";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";
import { PersonalInfoFields } from "./form/PersonalInfoFields";
import { ServiceInfoFields } from "./form/ServiceInfoFields";
import { DateFields } from "./form/DateFields";
import { ContactFields } from "./form/ContactFields";

// This component is deprecated - please use AddTraineeForm or EditTraineeForm instead
export function TraineeForm() {
  console.warn("TraineeForm is deprecated. Use AddTraineeForm or EditTraineeForm instead.");
  return null;
}
