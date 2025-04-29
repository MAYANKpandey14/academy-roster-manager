
import { useTranslation } from "react-i18next";

interface PersonDetailsProps {
  personData: any | null;
}

export function PersonDetails({ personData }: PersonDetailsProps) {
  if (!personData) return null;

  return (
    <div className="mt-4 p-4 border rounded-md bg-accent/20">
      <h3 className="font-medium mb-2">व्यक्ति विवरण:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">नाम</p>
          <p className="font-krutidev">{personData.name}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">पद</p>
          <p className="font-krutidev">{personData.rank || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">फ़ोन नंबर</p>
          <p className="font-krutidev">{personData.mobile_number}</p>
        </div>
      </div>
    </div>
  );
}
