
import { Staff } from "./staff";
import { Trainee } from "./trainee";

export interface ArchivedStaff extends Staff {
  archived_at: string;
  archived_by?: string;
  folder_id?: string;
  status?: string;
}

export interface ArchivedTrainee extends Trainee {
  archived_at: string;
  archived_by?: string;
  folder_id?: string;
  status?: string;
}

export interface ArchiveFolder {
  id: string;
  folder_name: string;
  created_at: string;
  created_by?: string;
  item_count: number;
  last_modified: string;
  description?: string;
}
