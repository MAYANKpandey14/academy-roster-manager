
import React from "react";

interface StaffInfoFieldProps {
  label: string;
  value: string;
}

export function StaffInfoField({ label, value }: StaffInfoFieldProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">
        {label}
      </h3>
      <p className="mt-1 font-krutidev">
        {value}
      </p>
    </div>
  );
}
