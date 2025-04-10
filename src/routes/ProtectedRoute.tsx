
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { handleError, ErrorType } from '@/utils/errorHandling';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Composant qui protège les routes nécessitant une authentification
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page d'accueil
  if (!isAuthenticated) {
    // Utilisation du système de gestion d'erreurs unifié
    handleError(
      new Error("Veuillez d'abord configurer vos identifiants"),
      {
        type: ErrorType.AUTHENTICATION,
        showToast: false,
        logToConsole: false
      }
    );
    
    // Afficher un message à l'utilisateur
    toast({
      title: "Identifiants manquants",
      description: "Veuillez d'abord configurer vos identifiants",
      variant: "destructive",
      duration: 5000,
    });
    
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
