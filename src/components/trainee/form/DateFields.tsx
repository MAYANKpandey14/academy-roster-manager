
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

interface DateFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

// Helper function to format date to dd/mm/yyyy
const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
};

// Helper function to parse dd/mm/yyyy to yyyy-mm-dd for form submission
const parseDDMMYYYYToYYYYMMDD = (dateString: string): string => {
  if (!dateString) return '';
  
  const parts = dateString.split('/');
  if (parts.length !== 3) return '';
  
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];
  
  // Return in YYYY-MM-DD format for the input type="date"
  return `${year}-${month}-${day}`;
};

export function DateFields({ form }: DateFieldsProps) {
  const { isHindi } = useLanguage();
  
  // State for the formatted display values
  const [dobDisplay, setDobDisplay] = useState("");
  const [dojDisplay, setDojDisplay] = useState("");
  const [arrivalDisplay, setArrivalDisplay] = useState("");
  const [departureDisplay, setDepartureDisplay] = useState("");

  // Initialize display values from form
  useEffect(() => {
    setDobDisplay(formatDateToDDMMYYYY(form.getValues('date_of_birth')));
    setDojDisplay(formatDateToDDMMYYYY(form.getValues('date_of_joining')));
    setArrivalDisplay(formatDateToDDMMYYYY(form.getValues('arrival_date')));
    setDepartureDisplay(formatDateToDDMMYYYY(form.getValues('departure_date')));
  }, [form]);

  // Handle date input changes
  const handleDateChange = (field: keyof TraineeFormValues, displaySetter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    displaySetter(value);
    
    // Convert display format to YYYY-MM-DD for internal storage
    const parts = value.split('/');
    if (parts.length === 3) {
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      
      // Check if the date is valid
      if (day.length === 2 && month.length === 2 && year.length === 4) {
        const dateValue = `${year}-${month}-${day}`;
        form.setValue(field, dateValue);
      }
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="date_of_birth"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'जन्म तिथि' : 'Date of Birth'}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="DD/MM/YYYY"
                value={dobDisplay}
                onChange={(e) => handleDateChange('date_of_birth', setDobDisplay, e.target.value)}
                maxLength={10}
              />
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
              {isHindi ? 'भर्ती तिथि' : 'Date of Joining'}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="DD/MM/YYYY"
                value={dojDisplay}
                onChange={(e) => handleDateChange('date_of_joining', setDojDisplay, e.target.value)}
                maxLength={10}
              />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="arrival_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'आगमन तिथि' : 'Date of Arrival'}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="DD/MM/YYYY"
                value={arrivalDisplay}
                onChange={(e) => handleDateChange('arrival_date', setArrivalDisplay, e.target.value)}
                maxLength={10}
              />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="departure_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'प्रस्थान तिथि' : 'Date of Departure'}
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="DD/MM/YYYY"
                value={departureDisplay}
                onChange={(e) => handleDateChange('departure_date', setDepartureDisplay, e.target.value)}
                maxLength={10}
              />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />
    </>
  );
}
