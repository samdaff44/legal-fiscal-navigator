
import puppeteer, { Browser, Page } from 'puppeteer';
import { CredentialsStore } from '../../models/Database';
import { CredentialVerificationResult, DatabaseLoginConfig, DATABASE_LOGIN_CONFIGS, AuthOptions } from './types';

/**
 * Service pour la vérification des identifiants des bases de données
 */
export class CredentialVerifier {
  private browser: Browser | null = null;
  
  /**
   * Initialise le navigateur pour la vérification des identifiants
   * @param {AuthOptions} options - Options d'initialisation
   * @returns {Promise<Browser>} Instance du navigateur
   */
  async initBrowser(options: AuthOptions = {}): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }
    
    this.browser = await puppeteer.launch({
      headless: options.headless !== false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1280,800',
      ]
    });
    
    return this.browser;
  }
  
  /**
   * Ferme le navigateur
   */
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
  
  /**
   * Vérifie les identifiants d'une base de données spécifique
   * @param {keyof CredentialsStore} dbKey - Clé de la base de données
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<CredentialVerificationResult>} Résultat de la vérification
   */
  async verifyCredentials(
    dbKey: keyof CredentialsStore, 
    username: string, 
    password: string
  ): Promise<CredentialVerificationResult> {
    if (!this.browser) {
      try {
        await this.initBrowser();
      } catch (error) {
        return { 
          isValid: false, 
          error: "Impossible d'initialiser le navigateur pour la vérification" 
        };
      }
    }
    
    const page = await this.browser!.newPage();
    
    try {
      // Configuration spécifique selon la base de données
      const config = DATABASE_LOGIN_CONFIGS[dbKey];
      if (!config) {
        return { isValid: false, error: `Configuration non trouvée pour ${dbKey}` };
      }
      
      await this.configurePageForScraping(page);
      const result = await this.attemptLogin(page, config, username, password);
      
      return result;
    } catch (error) {
      console.error(`Erreur lors de la vérification des identifiants pour ${dbKey}:`, error);
      return { 
        isValid: false, 
        error: `Une erreur est survenue lors de la vérification: ${error instanceof Error ? error.message : String(error)}` 
      };
    } finally {
      await page.close();
    }
  }
  
  /**
   * Configure la page pour imiter un navigateur réel
   * @param {Page} page - Instance de la page Puppeteer
   */
  private async configurePageForScraping(page: Page): Promise<void> {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
    });
  }
  
  /**
   * Tente de se connecter à une base de données
   * @param {Page} page - Instance de la page Puppeteer
   * @param {DatabaseLoginConfig} config - Configuration de connexion
   * @param {string} username - Nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<CredentialVerificationResult>} Résultat de la tentative
   */
  private async attemptLogin(
    page: Page, 
    config: DatabaseLoginConfig,
    username: string,
    password: string
  ): Promise<CredentialVerificationResult> {
    // Accéder à la page de connexion
    await page.goto(config.loginUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Remplir le formulaire
    await page.waitForSelector(config.usernameSelector, { timeout: 5000 });
    await page.type(config.usernameSelector, username, { delay: 50 });
    
    await page.waitForSelector(config.passwordSelector, { timeout: 5000 });
    await page.type(config.passwordSelector, password, { delay: 50 });
    
    // Soumettre le formulaire
    await Promise.all([
      page.click(config.submitSelector),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {
        // Certains sites peuvent ne pas déclencher de navigation après la connexion
        console.log(`Pas de navigation après la connexion`);
      })
    ]);
    
    // Attendre un peu pour que la page se charge complètement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Vérifie la présence d'éléments qui indiquent une connexion réussie
    const isConnected = await page.evaluate((selector) => {
      return !!document.querySelector(selector);
    }, config.successSelector);
    
    // Vérifie l'absence d'éléments d'erreur
    const hasError = await page.evaluate(() => {
      const errorElements = document.querySelectorAll('.error, .login-error, .alert-danger, .form-error');
      return errorElements.length > 0;
    });
    
    return {
      isValid: isConnected && !hasError,
      error: hasError ? "Identifiants incorrects ou erreur de connexion" : undefined
    };
  }
}

// Export une instance unique (singleton) du vérificateur
export const credentialVerifier = new CredentialVerifier();
