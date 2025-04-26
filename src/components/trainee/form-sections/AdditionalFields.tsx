
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues, bloodGroups } from "../TraineeFormSchema";

interface AdditionalFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function AdditionalFields({ form }: AdditionalFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="blood_group"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Blood Group</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nominee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nominee</FormLabel>
            <FormControl>
              <Input placeholder="Enter nominee name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
