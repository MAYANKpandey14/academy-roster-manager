
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { PersonDetailsProps } from "./types/attendanceTypes";

export function PersonDetails({ person, personType }: PersonDetailsProps) {
  const { isHindi } = useLanguage();

  const renderField = (label: string, value: string | undefined) => (
    <div className="flex flex-col mb-2 animate-fade-in">
      <span className={`text-sm text-gray-500 ${isHindi ? "font-hindi" : ""}`}>
        {label}
      </span>
      <span className={`text-base ${isHindi ? "font-hindi" : ""}`}>
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h3 className={`text-lg font-medium mb-4 ${isHindi ? "font-hindi" : ""}`}>
          {isHindi ? "व्यक्तिगत विवरण" : "Person Details"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
          {renderField(
            isHindi ? "पी.एन.ओ. संख्या" : "PNO Number", 
            person.pno
          )}
          
          {renderField(
            isHindi ? "नाम" : "Name", 
            person.name
          )}
          
          {personType === 'trainee' && person.chest_no && renderField(
            isHindi ? "छाती संख्या" : "Chest Number", 
            person.chest_no
          )}
          
          {personType === 'staff' && person.rank && renderField(
            isHindi ? "पद" : "Rank", 
            person.rank
          )}
          
          {renderField(
            isHindi ? "मोबाइल नंबर" : "Mobile Number", 
            person.mobile_number
          )}
        </div>
      </CardContent>
    </Card>
  );
}
