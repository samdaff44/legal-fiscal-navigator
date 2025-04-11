
import { ReactNode, useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { handleError, ErrorType } from '@/utils/errorHandling';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Composant qui protège les routes nécessitant une authentification
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hasShownError = useRef(false);
  
  useEffect(() => {
    console.log("ProtectedRoute - État d'authentification:", isAuthenticated);
    return () => {
      hasShownError.current = false;
    };
  }, [location.pathname, isAuthenticated]);
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page d'accueil avec un paramètre indiquant qu'il faut afficher le formulaire
  if (!isAuthenticated) {
    console.log("Non authentifié, redirection vers la page d'accueil");
    
    // Utilisation du système de gestion d'erreurs unifié (une seule fois par session)
    if (location.pathname !== '/' && !hasShownError.current) {
      hasShownError.current = true;
      
      setTimeout(() => {
        handleError(
          new Error("Vous devez configurer vos identifiants pour accéder à cette page"),
          {
            type: ErrorType.AUTHENTICATION,
            showToast: true,
            logToConsole: true
          }
        );
      }, 100);
    }
    
    // Rediriger vers la page d'accueil avec un paramètre pour afficher le formulaire d'identifiants
    return <Navigate to="/?showCredentials=true" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
