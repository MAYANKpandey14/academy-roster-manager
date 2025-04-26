
import { Header } from "@/components/layout/Header";
import { AddTraineeForm } from "@/components/trainee/AddTraineeForm";

const AddTraineePage = () => {
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
