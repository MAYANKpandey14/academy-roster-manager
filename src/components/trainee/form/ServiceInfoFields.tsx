
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { TraineeFormValues, traineeRanks } from "@/components/trainee/TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface ServiceInfoFieldsProps {
  form: UseFormReturn<TraineeFormValues>;
}

export function ServiceInfoFields({ form }: ServiceInfoFieldsProps) {
  const { isHindi } = useLanguage();
  const [selectedRank, setSelectedRank] = useState<string>("");
  const [customRankInput, setCustomRankInput] = useState<string>("");

  // Initialize selected rank from form value
  useEffect(() => {
    const currentRank = form.getValues("rank");
    if (currentRank) {
      if (traineeRanks.includes(currentRank as any)) {
        setSelectedRank(currentRank);
      } else {
        setSelectedRank("Other");
        setCustomRankInput(currentRank);
      }
    }
  }, [form]);

  const handleRankChange = (value: string) => {
    setSelectedRank(value);
    if (value !== "Other") {
      form.setValue("rank", value);
      setCustomRankInput("");
    } else {
      // Clear the rank value when Other is selected until custom input is provided
      form.setValue("rank", "");
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
        name="chest_no"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? 'चेस्ट नंबर' : 'Chest No'}
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
        name="rank"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "रैंक" : "Rank"}
            </FormLabel>
            <Select onValueChange={handleRankChange} value={selectedRank}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isHindi ? "रैंक चुनें" : "Select rank"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {traineeRanks.map((rank) => (
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
    </>
  );
}
