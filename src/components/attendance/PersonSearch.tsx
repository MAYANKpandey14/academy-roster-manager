
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import { Check, Search, XCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Staff } from "@/types/staff";
import { Trainee } from "@/types/trainee";

const searchSchema = z.object({
  type: z.enum(["staff", "trainee"]),
  pno: z.string().min(1, "PNO is required"),
});

type SearchValues = z.infer<typeof searchSchema>;

interface PersonSearchProps {
  onPersonSelected: (
    person: Staff | Trainee | null,
    type: "staff" | "trainee"
  ) => void;
}

export function PersonSearch({ onPersonSelected }: PersonSearchProps) {
  const { isHindi } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchSuccess, setSearchSuccess] = useState<boolean>(false);

  const form = useForm<SearchValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      type: "staff",
      pno: "",
    },
  });

  const handleSearch = async (values: SearchValues) => {
    setIsLoading(true);
    setSearchError(null);
    setSearchSuccess(false);

    try {
      if (values.type === "staff") {
        const { data, error } = await supabase
          .from("staff")
          .select("*")
          .eq("pno", values.pno)
          .single();

        if (error) throw new Error(error.message);

        if (data) {
          // TypeScript check for data non-null
          onPersonSelected({
            id: data.id ?? "",
            name: data.name ?? "",
            pno: data.pno ?? "",
            rank: data.rank ?? "",
            current_posting_district: data.current_posting_district ?? "",
            photo_url: data.photo_url ?? null,
          } as Staff, "staff");
          setSearchSuccess(true);
        } else {
          throw new Error("Staff member not found");
        }
      } else {
        const { data, error } = await supabase
          .from("trainees")
          .select("*")
          .eq("pno", values.pno)
          .single();

        if (error) throw new Error(error.message);

        if (data) {
          // TypeScript check for data non-null
          onPersonSelected({
            id: data.id ?? "",
            name: data.name ?? "",
            pno: data.pno ?? "",
            chest_no: data.chest_no ?? "",
            current_posting_district: data.current_posting_district ?? "",
            photo_url: data.photo_url ?? null,
          } as Trainee, "trainee");
          setSearchSuccess(true);
        } else {
          throw new Error("Trainee not found");
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(
        isHindi
          ? "व्यक्ति नहीं मिला। कृपया PNO की जाँच करें।"
          : "Person not found. Please check the PNO."
      );
      onPersonSelected(null, values.type);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className={isHindi ? "font-mangal" : ""}>
          {isHindi ? "व्यक्ति खोजें" : "Search Person"}
        </CardTitle>
        <CardDescription className={isHindi ? "font-mangal" : ""}>
          {isHindi
            ? "पीएनओ द्वारा स्टाफ या प्रशिक्षु खोजें"
            : "Find staff or trainee by PNO"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSearch)}
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
      </CardContent>
      {(searchError || searchSuccess) && (
        <CardFooter className="flex justify-center">
          {searchError ? (
            <div className="flex items-center text-red-500 text-sm">
              <XCircle className="mr-1 h-4 w-4" />
              <span className={isHindi ? "font-mangal" : ""}>{searchError}</span>
            </div>
          ) : (
            <div className="flex items-center text-green-500 text-sm">
              <Check className="mr-1 h-4 w-4" />
              <span className={isHindi ? "font-mangal" : ""}>
                {isHindi ? "व्यक्ति मिल गया!" : "Person found!"}
              </span>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
