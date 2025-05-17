
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PersonType } from "../types/attendanceTypes";
import { useLanguage } from "@/contexts/LanguageContext";

// Define the schema for search form validation
const searchSchema = z.object({
  type: z.enum(["staff", "trainee"]),
  pno: z.string().min(1, "PNO is required"),
});

type SearchValues = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearch: (values: SearchValues) => Promise<void>;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const { isHindi } = useLanguage();

  const form = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      type: "staff",
      pno: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSearch)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "प्रकार" : "Type"}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="staff" />
                    </FormControl>
                    <FormLabel className={`font-normal ${isHindi ? "font-mangal" : ""}`}>
                      {isHindi ? "स्टाफ" : "Staff"}
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="trainee" />
                    </FormControl>
                    <FormLabel className={`font-normal ${isHindi ? "font-mangal" : ""}`}>
                      {isHindi ? "प्रशिक्षु" : "Trainee"}
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pno"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "पीएनओ" : "PNO"}
              </FormLabel>
              <FormControl>
                <Input placeholder="PNO" {...field} />
              </FormControl>
              <FormMessage className={isHindi ? "font-mangal" : ""} />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className={isHindi ? "font-mangal" : ""}>
              {isHindi ? "खोज रहा है..." : "Searching..."}
            </span>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              <span className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "खोजें" : "Search"}
              </span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
