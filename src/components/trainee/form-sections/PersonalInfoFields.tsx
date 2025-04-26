
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function PersonalInfoFields({ form }: PersonalInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="father_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Father's Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter father's name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Education</FormLabel>
            <FormControl>
              <Input placeholder="Enter education details" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
