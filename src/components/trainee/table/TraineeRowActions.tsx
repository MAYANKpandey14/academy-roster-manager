
import { Trainee } from "@/types/trainee";
import { TraineeActions } from "../TraineeActions";

interface TraineeRowActionsProps {
  trainee: Trainee;
  onRefresh?: () => void;
}

export function TraineeRowActions({ trainee, onRefresh }: TraineeRowActionsProps) {
  return <TraineeActions trainee={trainee} onRefresh={onRefresh} />;
}
