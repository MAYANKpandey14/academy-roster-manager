
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Navigation } from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Add font-mangal class to the body
  useEffect(() => {
    document.body.classList.add('font-mangal');
    
    return () => {
      document.body.classList.remove('font-mangal');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background font-mangal">
      <Header />
      <Navigation />
      <main className="flex-1">{children}</main>
    </div>
  );
}
