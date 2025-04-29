
interface TraineeInfoFieldProps {
  label: string;
  value: string;
}

export function TraineeInfoField({ label, value }: TraineeInfoFieldProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 krutidev-heading">
        {label}
      </h3>
      <p className="mt-1 krutidev-text">
        {value}
      </p>
    </div>
  );
}
