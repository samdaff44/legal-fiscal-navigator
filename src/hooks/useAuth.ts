
import { useContext } from 'react';
import { AuthContext, AuthProvider as ContextAuthProvider } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/contexts/AuthContextType';

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};

// Re-export du provider pour faciliter l'utilisation
export const AuthProvider = ContextAuthProvider;
