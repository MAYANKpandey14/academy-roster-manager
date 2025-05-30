
export interface PersonData {
  id: string;
  name: string;
  pno: string;
  rank?: string;
  chest_no?: string;
  current_posting_district?: string;
  photo_url?: string | null;
  mobile_number?: string;
}

export type PersonType = "staff" | "trainee";

export interface PersonSearchProps {
  onPersonSelected: (
    person: PersonData | null,
    type: PersonType
  ) => void;
}

export interface PersonDetailsProps {
  person: PersonData;
  personType: PersonType;
}

export const searchSchema = {
  type: "enum" as const,
  pno: "string" as const,
};
