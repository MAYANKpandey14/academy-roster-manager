
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
import { PersonType } from "../types/attendanceTypes";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={`text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isHindi ? "font-mangal" : ""}`}>
                  {isHindi ? "प्रकार" : "Type"}
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-2 p-1 bg-slate-100/80 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-lg w-full h-10 items-center">
                    <button
                      type="button"
                      onClick={() => field.onChange("staff")}
                      className={cn(
                        "py-1.5 px-3 text-sm font-medium rounded-md transition-all duration-150 text-center h-8 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        field.value === "staff"
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-slate-700/50 font-semibold"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      )}
                    >
                      <span className={isHindi ? "font-mangal" : ""}>
                        {isHindi ? "स्टाफ" : "Staff"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("trainee")}
                      className={cn(
                        "py-1.5 px-3 text-sm font-medium rounded-md transition-all duration-150 text-center h-8 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        field.value === "trainee"
                          ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm border border-slate-200/50 dark:border-slate-700/50 font-semibold"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                      )}
                    >
                      <span className={isHindi ? "font-mangal" : ""}>
                        {isHindi ? "प्रशिक्षु" : "Trainee"}
                      </span>
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pno"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={`text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${isHindi ? "font-mangal" : ""}`}>
                  {isHindi ? "व्यक्तिगत संख्या (पीएनओ)" : "Personal Number (PNO)"}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      placeholder={isHindi ? "पीएनओ दर्ज करें" : "Enter PNO..."}
                      className="pl-10 h-10 border-slate-200 dark:border-slate-800 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-100"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className={isHindi ? "font-mangal" : ""} />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto h-10 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-900 text-white transition-colors"
          >
            {isLoading ? (
              <span className={isHindi ? "font-mangal animate-pulse" : "animate-pulse"}>
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
        </div>
      </form>
    </Form>
  );
}
