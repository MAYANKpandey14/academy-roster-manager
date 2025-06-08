
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { StaffFormValues, staffRanks } from "@/components/staff/StaffFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

interface ServiceInfoFieldsProps {
  form: UseFormReturn<StaffFormValues>;
}

export function ServiceInfoFields({ form }: ServiceInfoFieldsProps) {
  const { isHindi } = useLanguage();
  const [selectedRank, setSelectedRank] = useState<string>("");
  const [customRankInput, setCustomRankInput] = useState<string>("");

  const handleRankChange = (value: string) => {
    setSelectedRank(value);
    if (value !== "Other") {
      form.setValue("rank", value);
      setCustomRankInput("");
    }
  };

  const handleCustomRankChange = (value: string) => {
    setCustomRankInput(value);
    if (selectedRank === "Other" && value.trim()) {
      form.setValue("rank", value.trim());
    }
  };

  return (
    <>
      <FormField
        control={form.control}
        name="pno"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'पीएनओ/ यूनिक आईडी' : 'PNO/ Unique ID'}
            </FormLabel>
            <FormControl>
              <Input maxLength={12} {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rank"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "रैंक" : "Rank"}
            </FormLabel>
            <Select onValueChange={handleRankChange} defaultValue={selectedRank}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isHindi ? "रैंक चुनें" : "Select rank"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {staffRanks.map((rank) => (
                  <SelectItem key={rank} value={rank}>
                    {rank === "Other" ? (isHindi ? "अन्य" : "Other") : rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      {selectedRank === "Other" && (
        <div className="col-span-1 md:col-span-2">
          <FormLabel className={isHindi ? 'font-hindi' : ''}>
            {isHindi ? "कस्टम रैंक" : "Custom Rank"}
          </FormLabel>
          <Input 
            placeholder={isHindi ? "अन्य रैंक यहाँ लिखें" : "Write Other rank here"} 
            value={customRankInput}
            onChange={(e) => handleCustomRankChange(e.target.value)}
            className="mt-2"
          />
        </div>
      )}

      <FormField
        control={form.control}
        name="toli_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "टोली नंबर" : "Toli No"}
            </FormLabel>
            <FormControl>
              <Input maxLength={4} {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="current_posting_district"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'वर्तमान पोस्टिंग जिला' : 'Current Posting District'}
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="education"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'शिक्षा' : 'Education'}
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category_caste"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'श्रेणी/जाति' : 'Category/Caste'}
            </FormLabel>
            <FormControl>
              <Input {...field} />
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
              {isHindi ? 'नियुक्ति की तारीख' : 'Date of Joining'}
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
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
              {isHindi ? 'आगमन की तारीख RTC' : 'Arrival Date RTC'}
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
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
              {isHindi ? 'प्रस्थान की तारीख' : 'Departure Date'}
            </FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage className={isHindi ? 'font-hindi' : ''} />
          </FormItem>
        )}
      />
    </>
  );
}
