
import React from "react";

interface StaffInfoFieldProps {
  label: string;
  value: string;
  isDbValue?: boolean;
}

export function StaffInfoField({ label, value, isDbValue = false }: StaffInfoFieldProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">
        {label}
      </h3>
      <p className={`mt-1 ${isDbValue ? 'font-krutidev' : ''}`}>
        {value}
      </p>
    </div>
  );
}
