
import { CredentialsStore } from '@/models/Database';

// Interface pour le contexte d'authentification
export interface AuthContextType {
  isAuthenticated: boolean;
  authenticatedDatabases: string[];
  login: (credentials: CredentialsStore) => Promise<string[]>;
  logout: () => void;
  logoutFrom: (dbKey: keyof CredentialsStore) => boolean;
  updateSessionTime: (minutes: number) => void;
}
