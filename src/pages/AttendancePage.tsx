
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";
import { AttendanceManagement } from "@/components/attendance/AttendanceManagement";

export default function AttendancePage() {
  const { t } = useTranslation();
  
  // Use the language inputs hook
  useLanguageInputs();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-2xl font-semibold mb-6 dynamic-text">{t('attendanceManagement')}</h1>
        
        <AttendanceManagement />
      </main>
    </div>
  );
}
