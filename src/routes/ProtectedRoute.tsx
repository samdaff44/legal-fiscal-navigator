
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Composant qui protège les routes nécessitant une authentification
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page d'accueil avec un paramètre indiquant qu'il faut afficher le formulaire
  if (!isAuthenticated) {    
    // Rediriger vers la page d'accueil avec un paramètre pour afficher le formulaire d'identifiants
    return <Navigate to="/?showCredentials=true" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
