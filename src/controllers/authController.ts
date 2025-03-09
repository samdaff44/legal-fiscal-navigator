
import { CredentialsStore, saveCredentials } from '../models/Database';
import puppeteer, { Browser } from 'puppeteer';

/**
 * Contrôleur pour la gestion de l'authentification
 */
class AuthController {
  private browser: Browser | null = null;
  
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
    
    try {
      // Lancement du navigateur pour vérification des identifiants
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1280,800',
        ]
      });
      
      // Vérification des identifiants pour chaque base de données
      const connectedDatabases: string[] = [];
      
      for (const db of databasesWithCredentials) {
        const dbKey = db as keyof CredentialsStore;
        const dbCredentials = credentials[dbKey];
        
        try {
          // Vérifie les identifiants selon la base de données
          const isValid = await this.verifyCredentials(dbKey, dbCredentials.username, dbCredentials.password);
          
          if (isValid) {
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
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
    }
  }

  /**
   * Vérifie les identifiants d'une base de données spécifique
   * @param {keyof CredentialsStore} dbKey - Clé de la base de données
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<boolean>} True si les identifiants sont valides
   */
  private async verifyCredentials(dbKey: keyof CredentialsStore, username: string, password: string): Promise<boolean> {
    if (!this.browser) {
      throw new Error("Le navigateur n'est pas initialisé");
    }
    
    const page = await this.browser.newPage();
    
    try {
      // Configuration pour imiter un vrai navigateur
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36');
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
      });
      
      // Configuration spécifique selon la base de données
      let loginUrl = '';
      let usernameSelector = '';
      let passwordSelector = '';
      let submitSelector = '';
      let successSelector = '';
      
      if (dbKey === 'database1') { // Lexis Nexis
        loginUrl = 'https://www.lexisnexis.fr/connexion';
        usernameSelector = '#username';
        passwordSelector = '#password';
        submitSelector = 'button[type="submit"]';
        successSelector = '.user-profile, .user-account';
      } else if (dbKey === 'database2') { // Dalloz
        loginUrl = 'https://www.dalloz.fr/connexion';
        usernameSelector = '#user_login';
        passwordSelector = '#user_pass';
        submitSelector = '#wp-submit';
        successSelector = '.logged-in, .user-menu';
      } else if (dbKey === 'database3') { // EFL Francis Lefebvre
        loginUrl = 'https://www.efl.fr/connexion';
        usernameSelector = '#username';
        passwordSelector = '#password';
        submitSelector = 'button.btn-login';
        successSelector = '.logged-in-user, .user-profile';
      } else {
        return false;
      }
      
      // Accéder à la page de connexion
      await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Remplir le formulaire
      await page.waitForSelector(usernameSelector, { timeout: 5000 });
      await page.type(usernameSelector, username, { delay: 50 });
      
      await page.waitForSelector(passwordSelector, { timeout: 5000 });
      await page.type(passwordSelector, password, { delay: 50 });
      
      // Soumettre le formulaire
      await Promise.all([
        page.click(submitSelector),
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {
          // Certains sites peuvent ne pas déclencher de navigation après la connexion
          console.log(`Pas de navigation après la connexion pour ${dbKey}`);
        })
      ]);
      
      // Vérifier si la connexion a réussi
      await page.waitForTimeout(1000); // Attente courte pour que la page se stabilise
      
      // Vérifie la présence d'éléments qui indiquent une connexion réussie
      const isConnected = await page.evaluate((selector) => {
        return !!document.querySelector(selector);
      }, successSelector);
      
      // Vérifie l'absence d'éléments d'erreur
      const hasError = await page.evaluate(() => {
        const errorElements = document.querySelectorAll('.error, .login-error, .alert-danger, .form-error');
        return errorElements.length > 0;
      });
      
      return isConnected && !hasError;
    } catch (error) {
      console.error(`Erreur lors de la vérification des identifiants pour ${dbKey}:`, error);
      return false;
    } finally {
      await page.close();
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
}

// Export une instance unique (singleton) du contrôleur
export const authController = new AuthController();
