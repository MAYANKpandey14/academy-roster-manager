
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { PersonData } from "./PersonSearch";

interface PersonDetailsProps {
  person: PersonData;
  personType: 'trainee' | 'staff';
}

export function PersonDetails({ person, personType }: PersonDetailsProps) {
  const { isHindi } = useLanguage();

  const renderField = (label: string, value: string | undefined) => (
    <div className="flex flex-col mb-2">
      <span className={`text-sm text-gray-500 ${isHindi ? "font-mangal" : ""}`}>
        {label}
      </span>
      <span className={`text-base ${isHindi ? "font-mangal" : ""}`}>
        {value || "-"}
      </span>
    </div>
  );

  return (
    <Card className="animate-fade-in">
      <CardContent className="pt-6">
        <h3 className={`text-lg font-medium mb-4 ${isHindi ? "font-mangal" : ""}`}>
          {isHindi ? "व्यक्तिगत विवरण" : "Person Details"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          {renderField(
            isHindi ? "पी.एन.ओ. संख्या" : "PNO Number", 
            person.pno
          )}
          
          {renderField(
            isHindi ? "नाम" : "Name", 
            person.name
          )}
          
          {personType === 'staff' && renderField(
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
