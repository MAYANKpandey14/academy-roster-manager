
import { Trainee } from "@/types/trainee";
import { TraineeActions } from "../TraineeActions";

interface TraineeRowActionsProps {
  trainee: Trainee;
}

export function TraineeRowActions({ trainee }: TraineeRowActionsProps) {
  return <TraineeActions trainee={trainee} />;
}
