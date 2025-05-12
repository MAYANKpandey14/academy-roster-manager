
import { Trainee } from "@/types/trainee";
import { TraineeActions } from "../TraineeActions";

interface TraineeRowActionsProps {
  trainee: Trainee;
}

export function TraineeRowActions({ trainee }: TraineeRowActionsProps) {
  // Just pass through to TraineeActions component
  return <TraineeActions trainee={trainee} />;
}
