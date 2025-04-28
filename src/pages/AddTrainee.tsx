
import { Header } from "@/components/layout/Header";
import { AddTraineeForm } from "@/components/trainee/AddTraineeForm";
import { useLanguageInputs } from "@/hooks/useLanguageInputs";

const AddTraineePage = () => {
  // Apply language inputs hook
  useLanguageInputs();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-6 px-4">
        <AddTraineeForm />
      </main>
    </div>
  );
};

export default AddTraineePage;
