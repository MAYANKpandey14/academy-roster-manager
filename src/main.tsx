
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // Import i18n configuration
import { LanguageProvider } from "./contexts/LanguageContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
