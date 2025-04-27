
import { useEffect, useState } from "react";

export function Header() {
  const [today, setToday] = useState<string>("");

  useEffect(() => {
    const date = new Date();
    setToday(date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }));
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-white p-1.5 rounded">
            <img src="/images.svg" alt="logo" className="w-[96px] h-[96px]"/>
          </div>
          <h1 className="text-2xl font-bold">RTC TRAINEE MANAGER</h1>
        </div>
        <div className="text-sm text-gray-500">{today}</div>
      </div>
    </header>
  );
}
