
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { bloodGroups, traineeFormSchema, TraineeFormValues } from "./TraineeFormSchema";
import { Trainee } from "@/types/trainee";
import { toast } from "sonner";

interface TraineeFormProps {
  trainee?: Trainee;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TraineeForm({ trainee, onSuccess, onCancel }: TraineeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!trainee;

  const defaultValues: Partial<TraineeFormValues> = trainee
    ? {
        ...trainee,
        arrival_date: trainee.arrival_date ? trainee.arrival_date.split('T')[0] : '',
        departure_date: trainee.departure_date ? trainee.departure_date.split('T')[0] : '',
        date_of_birth: trainee.date_of_birth ? trainee.date_of_birth.split('T')[0] : '',
        date_of_joining: trainee.date_of_joining ? trainee.date_of_joining.split('T')[0] : '',
      }
    : {
        // Set default empty values
      };

  const form = useForm<TraineeFormValues>({
    resolver: zodResolver(traineeFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TraineeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Transform dates to ISO strings for API
      const formData = {
        ...data,
        arrival_date: new Date(data.arrival_date).toISOString(),
        departure_date: new Date(data.departure_date).toISOString(),
        date_of_birth: new Date(data.date_of_birth).toISOString(),
        date_of_joining: new Date(data.date_of_joining).toISOString(),
      };

      console.log("Form data to be sent:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(isEditMode ? "Trainee updated successfully" : "Trainee added successfully");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save trainee data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditMode ? "Edit Trainee" : "Add New Trainee"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PNO */}
            <FormField
              control={form.control}
              name="pno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PNO</FormLabel>
                  <FormControl>
                    <Input maxLength={9} placeholder="Enter PNO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Chest No */}
            <FormField
              control={form.control}
              name="chest_no"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chest No</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Chest No" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Name */}
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

            {/* Father's Name */}
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

            {/* Date of Arrival */}
            <FormField
              control={form.control}
              name="arrival_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Arrival</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      placeholder="YYYY-MM-DD"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Departure */}
            <FormField
              control={form.control}
              name="departure_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Departure</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      placeholder="YYYY-MM-DD"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Posting District */}
            <FormField
              control={form.control}
              name="current_posting_district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Posting District</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter district" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mobile Number */}
            <FormField
              control={form.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input maxLength={10} placeholder="Enter mobile number" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Education */}
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

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      placeholder="YYYY-MM-DD"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Joining */}
            <FormField
              control={form.control}
              name="date_of_joining"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Joining</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      placeholder="YYYY-MM-DD"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Blood Group */}
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

            {/* Nominee */}
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
          </div>

          {/* Home Address - Full width */}
          <FormField
            control={form.control}
            name="home_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Home Address</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter full home address" 
                    className="min-h-[80px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isEditMode ? "Update Trainee" : "Add Trainee"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
