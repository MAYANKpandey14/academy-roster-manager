
import { useForm, useFormContext } from "react-hook-form";
import { TraineeFormValues } from "../TraineeFormSchema";
import { bloodGroups, ranks } from "../TraineeFormSchema";
import { useLanguage } from "@/contexts/LanguageContext";
import {
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export const PersonalInfoFields = () => {
  const form = useFormContext<TraineeFormValues>();
  const { isHindi } = useLanguage();
  const [identifierType, setIdentifierType] = useState<"pno" | "chest_no">("pno");

  return (
    <div className="space-y-4">
      <h3 className={`text-lg font-semibold ${isHindi ? "font-hindi" : ""}`}>
        {isHindi ? "व्यक्तिगत जानकारी" : "Personal Information"}
      </h3>

      {/* Add tabs for identifier types */}
      <Tabs value={identifierType} onValueChange={(value: "pno" | "chest_no") => setIdentifierType(value)}>
        <TabsList className="mb-4">
          <TabsTrigger value="pno">
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "पीएनओ" : "PNO"}
            </span>
          </TabsTrigger>
          <TabsTrigger value="chest_no">
            <span className={isHindi ? 'font-hindi' : ''}>
              {isHindi ? "रोल नंबर / चेस्ट नंबर" : "Roll No / Chest No"}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pno">
          <FormField
            control={form.control}
            name="pno"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "पीएनओ नंबर" : "PNO Number"}
                </FormLabel>
                <FormControl>
                  <Input {...field} maxLength={9} />
                </FormControl>
                <FormMessage className={isHindi ? "font-hindi" : ""} />
              </FormItem>
            )}
          />
        </TabsContent>

        <TabsContent value="chest_no">
          <FormField
            control={form.control}
            name="chest_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isHindi ? "font-hindi" : ""}>
                  {isHindi ? "रोल नंबर / चेस्ट नंबर" : "Roll No / Chest No"}
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className={isHindi ? "font-hindi" : ""} />
              </FormItem>
            )}
          />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "नाम" : "Name"}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className={isHindi ? "font-hindi" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="father_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "पिता का नाम" : "Father's Name"}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className={isHindi ? "font-hindi" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="education"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "शिक्षा" : "Education"}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage className={isHindi ? "font-hindi" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rank"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "रैंक" : "Rank"}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={isHindi ? "रैंक चुनें" : "Select rank"}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ranks.map((rank) => (
                    <SelectItem key={rank} value={rank}>
                      {rank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className={isHindi ? "font-hindi" : ""} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="blood_group"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isHindi ? "font-hindi" : ""}>
                {isHindi ? "रक्त समूह" : "Blood Group"}
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isHindi ? "रक्त समूह चुनें" : "Select blood group"
                      }
                    />
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
              <FormMessage className={isHindi ? "font-hindi" : ""} />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
