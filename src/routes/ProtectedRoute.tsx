
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  if (!isAuthenticated()) {
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
