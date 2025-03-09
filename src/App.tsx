
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { authController } from "./controllers/authController";
import { useEffect, useState } from "react";
import "./App.css";

// Configuration du client pour React Query avec gestion optimisée du cache et des erreurs
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

/**
 * Composant principal de l'application
 */
const App = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    // Vérifie l'état d'authentification au chargement
    setTimeout(() => {
      setIsCheckingAuth(false);
    }, 300); // Délai minimal pour éviter le flash
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-primary">Chargement...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                authController.isAuthenticated() ? <Dashboard /> : <Navigate to="/" replace />
              } 
            />
            <Route 
              path="/results" 
              element={
                authController.isAuthenticated() ? <Results /> : <Navigate to="/" replace />
              } 
            />
            <Route 
              path="/settings" 
              element={
                authController.isAuthenticated() ? <Settings /> : <Navigate to="/" replace />
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
