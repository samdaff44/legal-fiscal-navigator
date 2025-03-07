
import { CredentialsStore, saveCredentials } from '../models/Database';
import { useToast } from "@/components/ui/use-toast";

/**
 * Contrôleur pour la gestion de l'authentification
 */
class AuthController {
  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean} True si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    const credentialsString = localStorage.getItem('databaseCredentials');
    if (!credentialsString) return false;
    
    try {
      const credentials = JSON.parse(credentialsString);
      
      // Vérifie si au moins une base de données a des identifiants
      return Object.values(credentials).some((db: any) => 
        db.username && db.password
      );
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      return false;
    }
  }

  /**
   * Connecte l'utilisateur en vérifiant et stockant ses identifiants
   * @param {CredentialsStore} credentials - Identifiants des bases de données
   * @returns {Promise<string[]>} Liste des bases de données connectées
   * @throws {Error} Si aucune base de données n'a d'identifiants
   */
  async login(credentials: CredentialsStore): Promise<string[]> {
    // Vérifie que au moins une base de données a des identifiants
    const databasesWithCredentials = Object.keys(credentials).filter(db => {
      const dbKey = db as keyof CredentialsStore;
      return credentials[dbKey].username.trim() !== "" && credentials[dbKey].password.trim() !== "";
    });
    
    if (databasesWithCredentials.length === 0) {
      throw new Error("Veuillez saisir les identifiants pour au moins une base de données");
    }
    
    // Simulation de connexions aux bases de données
    const connectedDatabases: string[] = [];
    
    for (const db of databasesWithCredentials) {
      const dbKey = db as keyof CredentialsStore;
      // Ici, on simulerait une vérification d'identifiants auprès des services réels
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulation d'attente
      
      // Dans une implémentation réelle, on vérifierait la réponse du service
      connectedDatabases.push(db);
    }
    
    // Sauvegarde les identifiants
    saveCredentials(credentials);
    
    return connectedDatabases;
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
}

// Export une instance unique (singleton) du contrôleur
export const authController = new AuthController();
