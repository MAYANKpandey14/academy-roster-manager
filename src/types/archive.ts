
import { Staff } from "./staff";
import { Trainee } from "./trainee";

export interface ArchivedStaff extends Staff {
  archived_at: string;
  archived_by?: string;
}

export interface ArchivedTrainee extends Trainee {
  archived_at: string;
  archived_by?: string;
}
