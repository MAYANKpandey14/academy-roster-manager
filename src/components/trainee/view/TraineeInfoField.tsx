
interface TraineeInfoFieldProps {
  label: string;
  value: string;
  isDbValue?: boolean;
}

export function TraineeInfoField({ label, value, isDbValue = false }: TraineeInfoFieldProps) {
  return (
    <div className="group bg-white rounded-md p-3 border border-transparent hover:border-gray-200 transition-all">
      <h3 className="text-sm font-medium text-gray-500">
        {label}
      </h3>
      <p className={`mt-1.5 text-base font-medium ${isDbValue ? 'font-krutidev' : ''}`}>
        {value || "-"}
      </p>
    </div>
  );
}
