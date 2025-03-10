
import { CredentialsStore, saveCredentials, getStoredCredentials } from '../../models/Database';
import { credentialVerifier } from './credentialVerifier';
import { LoginResult, AuthOptions } from './types';

/**
 * Contrôleur pour la gestion de l'authentification
 */
class AuthController {
  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean} True si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    const credentials = getStoredCredentials();
    if (!credentials) return false;
    
    // Vérifie si au moins une base de données a des identifiants
    return Object.values(credentials).some((db: any) => 
      db.username && db.password
    );
  }

  /**
   * Vérifie si l'utilisateur est connecté à une base de données spécifique
   * @param {keyof CredentialsStore} dbKey - Clé de la base de données
   * @returns {boolean} True si l'utilisateur est connecté à cette base de données
   */
  isAuthenticatedFor(dbKey: keyof CredentialsStore): boolean {
    const credentials = getStoredCredentials();
    if (!credentials) return false;
    
    return !!(credentials[dbKey] && credentials[dbKey].username && credentials[dbKey].password);
  }

  /**
   * Connecte l'utilisateur en vérifiant et stockant ses identifiants
   * @param {CredentialsStore} credentials - Identifiants des bases de données
   * @param {AuthOptions} options - Options d'authentification
   * @returns {Promise<string[]>} Liste des bases de données connectées
   * @throws {Error} Si aucune base de données n'a d'identifiants
   */
  async login(credentials: CredentialsStore, options: AuthOptions = {}): Promise<string[]> {
    // Vérifie que au moins une base de données a des identifiants
    const databasesWithCredentials = Object.keys(credentials).filter(db => {
      const dbKey = db as keyof CredentialsStore;
      return credentials[dbKey].username.trim() !== "" && credentials[dbKey].password.trim() !== "";
    });
    
    if (databasesWithCredentials.length === 0) {
      throw new Error("Veuillez saisir les identifiants pour au moins une base de données");
    }
    
    try {
      // Initialisation du navigateur pour la vérification
      await credentialVerifier.initBrowser(options);
      
      // Vérification des identifiants pour chaque base de données
      const connectedDatabases: string[] = [];
      
      for (const db of databasesWithCredentials) {
        const dbKey = db as keyof CredentialsStore;
        const dbCredentials = credentials[dbKey];
        
        try {
          // Vérifie les identifiants selon la base de données
          const result = await credentialVerifier.verifyCredentials(
            dbKey, 
            dbCredentials.username, 
            dbCredentials.password
          );
          
          if (result.isValid) {
            connectedDatabases.push(db);
          }
        } catch (error) {
          console.error(`Erreur lors de la vérification des identifiants pour ${db}:`, error);
          // Continue avec les autres bases de données même si une échoue
        }
      }
      
      if (connectedDatabases.length === 0) {
        throw new Error("Impossible de se connecter à une base de données avec les identifiants fournis");
      }
      
      // Sauvegarde les identifiants
      saveCredentials(credentials);
      
      return connectedDatabases;
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      throw new Error("Une erreur est survenue lors de la connexion aux bases de données");
    } finally {
      // Fermeture du navigateur
      await credentialVerifier.closeBrowser();
    }
  }

  /**
   * Déconnecte l'utilisateur en supprimant ses identifiants
   */
  logout(): void {
    try {
      localStorage.removeItem('databaseCredentials');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  }

  /**
   * Déconnecte l'utilisateur d'une base de données spécifique
   * @param {keyof CredentialsStore} dbKey - Clé de la base de données
   * @returns {boolean} True si la déconnexion a réussi
   */
  logoutFrom(dbKey: keyof CredentialsStore): boolean {
    try {
      const credentials = getStoredCredentials();
      if (!credentials) return false;
      
      if (credentials[dbKey]) {
        credentials[dbKey] = { username: "", password: "", url: credentials[dbKey].url };
        
        // Vérifie s'il reste des bases de données connectées
        const remainingDatabases = Object.keys(credentials).filter(db => {
          const dbK = db as keyof CredentialsStore;
          return credentials[dbK].username && credentials[dbK].password;
        });
        
        if (remainingDatabases.length === 0) {
          // Si aucune base de données n'est connectée, déconnexion complète
          localStorage.removeItem('databaseCredentials');
        } else {
          // Sinon, sauvegarde les identifiants mis à jour
          saveCredentials(credentials);
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Erreur lors de la déconnexion de ${dbKey}:`, error);
      return false;
    }
  }
}

// Export une instance unique (singleton) du contrôleur
export const authController = new AuthController();
