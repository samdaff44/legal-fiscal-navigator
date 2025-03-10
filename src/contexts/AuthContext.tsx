
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { CredentialsStore, getStoredCredentials } from '@/models/Database';
import { authController } from '@/controllers/auth/authController';
import { startSession, isSessionActive, endSession, updateSessionTimeout } from '@/utils/sessionManager';

// Interface pour le contexte d'authentification
export interface AuthContextType {
  isAuthenticated: boolean;
  authenticatedDatabases: string[];
  login: (credentials: CredentialsStore) => Promise<string[]>;
  logout: () => void;
  logoutFrom: (dbKey: keyof CredentialsStore) => boolean;
  updateSessionTime: (minutes: number) => void;
}

// Création du contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props pour le provider d'authentification
interface AuthProviderProps {
  children: ReactNode;
}

// Composant Provider pour le contexte d'authentification
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authenticatedDatabases, setAuthenticatedDatabases] = useState<string[]>([]);

  // Vérifie l'état d'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      // Vérifie si une session active est présente
      if (!isSessionActive()) {
        setIsAuthenticated(false);
        setAuthenticatedDatabases([]);
        return;
      }
      
      // Vérifie les identifiants stockés
      const isAuth = authController.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const credentials = getStoredCredentials();
        const databases: string[] = [];
        
        if (credentials) {
          if (authController.isAuthenticatedFor('database1')) databases.push('database1');
          if (authController.isAuthenticatedFor('database2')) databases.push('database2');
          if (authController.isAuthenticatedFor('database3')) databases.push('database3');
        }
        
        setAuthenticatedDatabases(databases);
      }
    };
    
    checkAuth();
    
    // Écouteur pour l'expiration de session
    const handleSessionExpired = () => {
      toast({
        title: "Session expirée",
        description: "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      
      setIsAuthenticated(false);
      setAuthenticatedDatabases([]);
      navigate('/');
    };
    
    window.addEventListener('sessionExpired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [navigate, toast]);

  // Fonction de connexion
  const login = async (credentials: CredentialsStore): Promise<string[]> => {
    try {
      const connectedDatabases = await authController.login(credentials);
      
      if (connectedDatabases.length > 0) {
        setIsAuthenticated(true);
        setAuthenticatedDatabases(connectedDatabases);
        
        // Démarrage de la session avec expiration après 30 minutes
        startSession({ timeout: 30 });
      }
      
      return connectedDatabases;
    } catch (error) {
      setIsAuthenticated(false);
      setAuthenticatedDatabases([]);
      throw error;
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    authController.logout();
    endSession();
    setIsAuthenticated(false);
    setAuthenticatedDatabases([]);
  };

  // Déconnexion d'une base de données spécifique
  const logoutFrom = (dbKey: keyof CredentialsStore): boolean => {
    const success = authController.logoutFrom(dbKey);
    
    if (success) {
      // Mise à jour de la liste des bases de données authentifiées
      const updatedDatabases = authenticatedDatabases.filter(db => db !== dbKey);
      setAuthenticatedDatabases(updatedDatabases);
      
      // Si plus aucune base de données n'est connectée, déconnexion complète
      if (updatedDatabases.length === 0) {
        setIsAuthenticated(false);
        endSession();
      }
    }
    
    return success;
  };

  // Mise à jour du délai d'expiration de session
  const updateSessionTime = (minutes: number) => {
    updateSessionTimeout(minutes);
  };

  // Valeur du contexte
  const value = {
    isAuthenticated,
    authenticatedDatabases,
    login,
    logout,
    logoutFrom,
    updateSessionTime
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
