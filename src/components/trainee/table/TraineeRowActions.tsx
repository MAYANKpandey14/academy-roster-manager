
import { Trainee } from "@/types/trainee";
import { TraineeActions } from "../TraineeActions";

interface TraineeRowActionsProps {
  trainee: Trainee;
  onDelete?: () => void;
}

export function TraineeRowActions({ trainee, onDelete }: TraineeRowActionsProps) {
  return <TraineeActions trainee={trainee} onDelete={onDelete} />;
}
