
import { CredentialsStore } from '../../models/Database';
import { CredentialVerificationResult, DatabaseLoginConfig, DATABASE_LOGIN_CONFIGS, AuthOptions } from './types';

// Mock implementation for client-side
class ClientSideVerifier {
  async verifyCredentials(
    dbKey: keyof CredentialsStore, 
    username: string, 
    password: string
  ): Promise<CredentialVerificationResult> {
    console.log(`Client-side credential verification for ${dbKey}`);
    
    // In a real application, we would call an API endpoint here
    // For now, we'll simulate a successful verification if credentials are not empty
    if (!username || !password) {
      return { 
        isValid: false, 
        error: "Les identifiants ne peuvent pas être vides" 
      };
    }
    
    // Simple validation logic for demo purposes
    return { 
      isValid: true,
      error: undefined
    };
  }
  
  async initBrowser(): Promise<any> {
    return null;
  }
  
  async closeBrowser(): Promise<void> {
    // No-op for client
  }
}

// This class will only be instantiated on the server
class ServerSideVerifier {
  private browser: any = null;
  
  async initBrowser(options: AuthOptions = {}): Promise<any> {
    if (this.browser) {
      return this.browser;
    }
    
    try {
      // Dynamic import to avoid bundling Puppeteer in client code
      const puppeteer = await import('puppeteer');
      
      this.browser = await puppeteer.default.launch({
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
    } catch (error) {
      console.error('Failed to initialize browser:', error);
      throw error;
    }
  }
  
  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
  
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
    
    // Since we're using dynamic import, we need to import puppeteer again
    const puppeteer = await import('puppeteer');
    const page = await this.browser.newPage();
    
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
  
  private async configurePageForScraping(page: any): Promise<void> {
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
    });
  }
  
  private async attemptLogin(
    page: any, 
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
    const isConnected = await page.evaluate((selector: string) => {
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

// Determine which implementation to use based on environment
let credentialVerifier: ClientSideVerifier | ServerSideVerifier;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Use the appropriate implementation
credentialVerifier = isBrowser 
  ? new ClientSideVerifier() 
  : new ServerSideVerifier();

export { credentialVerifier, ClientSideVerifier, ServerSideVerifier };
