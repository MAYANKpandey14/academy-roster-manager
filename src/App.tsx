import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import AppRoutes from "@/routes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
