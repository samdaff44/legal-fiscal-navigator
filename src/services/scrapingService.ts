
import puppeteer, { Browser, Page } from 'puppeteer';
import { SearchResult } from '@/models/SearchResult';
import { getAccessibleDatabases, getStoredCredentials } from '@/models/Database';

/**
 * Configuration pour le scraping de chaque site
 */
interface SiteConfig {
  url: string;
  searchPath: string;
  resultSelector: string;
  titleSelector: string;
  excerptSelector: string;
  dateSelector: string;
  authorSelector?: string;
  juridictionSelector?: string;
  courtSelector?: string;
  categorySelector?: string;
  typeSelector?: string;
  loginUrl?: string;
  usernameSelector?: string;
  passwordSelector?: string;
  submitSelector?: string;
  isLoggedInSelector?: string;
  extractData: (page: Page, query: string) => Promise<SearchResult[]>;
}

/**
 * Configurations pour les sites juridiques supportés
 */
const siteConfigs: Record<string, SiteConfig> = {
  'Lexis Nexis': {
    url: 'https://www.lexisnexis.fr',
    searchPath: '/search',
    resultSelector: '.search-result-item',
    titleSelector: '.result-title a',
    excerptSelector: '.result-excerpt',
    dateSelector: '.result-date',
    authorSelector: '.result-author',
    juridictionSelector: '.result-juridiction',
    courtSelector: '.result-court',
    categorySelector: '.result-category',
    typeSelector: '.result-type',
    loginUrl: 'https://www.lexisnexis.fr/connexion',
    usernameSelector: '#username',
    passwordSelector: '#password',
    submitSelector: 'button[type="submit"]',
    isLoggedInSelector: '.user-account-info',
    async extractData(page, query): Promise<SearchResult[]> {
      try {
        // Navigation vers la page de recherche
        const searchUrl = `${this.url}${this.searchPath}?q=${encodeURIComponent(query)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Attendre que les résultats apparaissent
        await page.waitForSelector(this.resultSelector, { timeout: 10000 })
          .catch(() => console.log('Délai d\'attente dépassé pour les sélecteurs de résultats'));
        
        // Extraire les données
        return await page.evaluate((selectors) => {
          const elements = document.querySelectorAll(selectors.resultSelector);
          const results = [];
          
          elements.forEach((element, index) => {
            const titleEl = element.querySelector(selectors.titleSelector);
            const excerptEl = element.querySelector(selectors.excerptSelector);
            const dateEl = element.querySelector(selectors.dateSelector);
            const authorEl = element.querySelector(selectors.authorSelector);
            const juridictionEl = element.querySelector(selectors.juridictionSelector);
            const courtEl = element.querySelector(selectors.courtSelector);
            const categoryEl = element.querySelector(selectors.categorySelector);
            const typeEl = element.querySelector(selectors.typeSelector);
            
            const title = titleEl ? titleEl.textContent?.trim() : '';
            const url = titleEl ? titleEl.getAttribute('href') : '';
            const excerpt = excerptEl ? excerptEl.textContent?.trim() : '';
            const dateText = dateEl ? dateEl.textContent?.trim() : '';
            const author = authorEl ? authorEl.textContent?.trim() : '';
            const juridiction = juridictionEl ? juridictionEl.textContent?.trim() : '';
            const court = courtEl ? courtEl.textContent?.trim() : '';
            const category = categoryEl ? categoryEl.textContent?.trim() : '';
            const type = typeEl ? typeEl.textContent?.trim() : 'jurisprudence';
            
            // Extraire l'année de publication à partir de la date
            let publicationYear = new Date().getFullYear();
            if (dateText) {
              const yearMatch = dateText.match(/\b(19|20)\d{2}\b/);
              if (yearMatch) {
                publicationYear = parseInt(yearMatch[0]);
              }
            }
            
            // Déterminer le type de document
            let docType: 'jurisprudence' | 'doctrine' | 'legislation' | 'article' = 'jurisprudence';
            if (type) {
              if (type.toLowerCase().includes('doctr')) docType = 'doctrine';
              else if (type.toLowerCase().includes('legi')) docType = 'legislation';
              else if (type.toLowerCase().includes('arti')) docType = 'article';
            }
            
            results.push({
              id: `lexis-${index + 1}`,
              title: title || `Résultat pour ${query}`,
              excerpt: excerpt || 'Aucun extrait disponible',
              source: 'Lexis Nexis',
              type: docType,
              date: dateText || new Date().toISOString().split('T')[0],
              url: url ? (url.startsWith('http') ? url : `${selectors.url}${url}`) : '',
              relevance: 95 - index * 2,
              jurisdiction: juridiction || 'Non spécifié',
              court: court || 'Non spécifié',
              author: author || 'Non spécifié',
              publicationYear,
              category: category || 'Non catégorisé',
              language: 'Français',
              country: 'France',
              citations: Math.floor(Math.random() * 20) // Estimation aléatoire, à remplacer par une vraie valeur si disponible
            });
          });
          
          return results;
        }, this);
      } catch (error) {
        console.error('Erreur lors du scraping de Lexis Nexis:', error);
        return [];
      }
    }
  },
  'Dalloz': {
    url: 'https://www.dalloz.fr',
    searchPath: '/recherche',
    resultSelector: '.result-item',
    titleSelector: '.result-item-title a',
    excerptSelector: '.result-item-excerpt',
    dateSelector: '.result-item-date',
    authorSelector: '.result-item-author',
    juridictionSelector: '.result-item-juridiction',
    courtSelector: '.result-item-court',
    categorySelector: '.result-item-category',
    typeSelector: '.result-item-type',
    loginUrl: 'https://www.dalloz.fr/connexion',
    usernameSelector: '#user_login',
    passwordSelector: '#user_pass',
    submitSelector: '#wp-submit',
    isLoggedInSelector: '.logged-in',
    async extractData(page, query): Promise<SearchResult[]> {
      try {
        // Navigation vers la page de recherche
        const searchUrl = `${this.url}${this.searchPath}?q=${encodeURIComponent(query)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Attendre que les résultats apparaissent
        await page.waitForSelector(this.resultSelector, { timeout: 10000 })
          .catch(() => console.log('Délai d\'attente dépassé pour les sélecteurs de résultats'));
        
        // Extraire les données
        return await page.evaluate((selectors) => {
          const elements = document.querySelectorAll(selectors.resultSelector);
          const results = [];
          
          elements.forEach((element, index) => {
            const titleEl = element.querySelector(selectors.titleSelector);
            const excerptEl = element.querySelector(selectors.excerptSelector);
            const dateEl = element.querySelector(selectors.dateSelector);
            const authorEl = element.querySelector(selectors.authorSelector);
            const juridictionEl = element.querySelector(selectors.juridictionSelector);
            const courtEl = element.querySelector(selectors.courtSelector);
            const categoryEl = element.querySelector(selectors.categorySelector);
            const typeEl = element.querySelector(selectors.typeSelector);
            
            const title = titleEl ? titleEl.textContent?.trim() : '';
            const url = titleEl ? titleEl.getAttribute('href') : '';
            const excerpt = excerptEl ? excerptEl.textContent?.trim() : '';
            const dateText = dateEl ? dateEl.textContent?.trim() : '';
            const author = authorEl ? authorEl.textContent?.trim() : '';
            const juridiction = juridictionEl ? juridictionEl.textContent?.trim() : '';
            const court = courtEl ? courtEl.textContent?.trim() : '';
            const category = categoryEl ? categoryEl.textContent?.trim() : '';
            const type = typeEl ? typeEl.textContent?.trim() : 'doctrine';
            
            // Extraire l'année de publication à partir de la date
            let publicationYear = new Date().getFullYear();
            if (dateText) {
              const yearMatch = dateText.match(/\b(19|20)\d{2}\b/);
              if (yearMatch) {
                publicationYear = parseInt(yearMatch[0]);
              }
            }
            
            // Déterminer le type de document
            let docType: 'jurisprudence' | 'doctrine' | 'legislation' | 'article' = 'doctrine';
            if (type) {
              if (type.toLowerCase().includes('juris')) docType = 'jurisprudence';
              else if (type.toLowerCase().includes('legi')) docType = 'legislation';
              else if (type.toLowerCase().includes('arti')) docType = 'article';
            }
            
            results.push({
              id: `dalloz-${index + 1}`,
              title: title || `Résultat pour ${query}`,
              excerpt: excerpt || 'Aucun extrait disponible',
              source: 'Dalloz',
              type: docType,
              date: dateText || new Date().toISOString().split('T')[0],
              url: url ? (url.startsWith('http') ? url : `${selectors.url}${url}`) : '',
              relevance: 90 - index * 3,
              jurisdiction: juridiction || 'Non spécifié',
              court: court || 'Non spécifié',
              author: author || 'Non spécifié',
              publicationYear,
              category: category || 'Non catégorisé',
              language: 'Français',
              country: 'France',
              citations: Math.floor(Math.random() * 15) // Estimation aléatoire, à remplacer par une vraie valeur si disponible
            });
          });
          
          return results;
        }, this);
      } catch (error) {
        console.error('Erreur lors du scraping de Dalloz:', error);
        return [];
      }
    }
  },
  'EFL Francis Lefebvre': {
    url: 'https://www.efl.fr',
    searchPath: '/recherche',
    resultSelector: '.search-result',
    titleSelector: '.result-heading a',
    excerptSelector: '.result-description',
    dateSelector: '.publication-date',
    authorSelector: '.author',
    juridictionSelector: '.juridiction',
    courtSelector: '.court',
    categorySelector: '.category',
    typeSelector: '.type',
    loginUrl: 'https://www.efl.fr/connexion',
    usernameSelector: '#username',
    passwordSelector: '#password',
    submitSelector: 'button.btn-login',
    isLoggedInSelector: '.logged-in-user',
    async extractData(page, query): Promise<SearchResult[]> {
      try {
        // Navigation vers la page de recherche
        const searchUrl = `${this.url}${this.searchPath}?q=${encodeURIComponent(query)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
        
        // Attendre que les résultats apparaissent
        await page.waitForSelector(this.resultSelector, { timeout: 10000 })
          .catch(() => console.log('Délai d\'attente dépassé pour les sélecteurs de résultats'));
        
        // Extraire les données
        return await page.evaluate((selectors) => {
          const elements = document.querySelectorAll(selectors.resultSelector);
          const results = [];
          
          elements.forEach((element, index) => {
            const titleEl = element.querySelector(selectors.titleSelector);
            const excerptEl = element.querySelector(selectors.excerptSelector);
            const dateEl = element.querySelector(selectors.dateSelector);
            const authorEl = element.querySelector(selectors.authorSelector);
            const juridictionEl = element.querySelector(selectors.juridictionSelector);
            const courtEl = element.querySelector(selectors.courtSelector);
            const categoryEl = element.querySelector(selectors.categorySelector);
            const typeEl = element.querySelector(selectors.typeSelector);
            
            const title = titleEl ? titleEl.textContent?.trim() : '';
            const url = titleEl ? titleEl.getAttribute('href') : '';
            const excerpt = excerptEl ? excerptEl.textContent?.trim() : '';
            const dateText = dateEl ? dateEl.textContent?.trim() : '';
            const author = authorEl ? authorEl.textContent?.trim() : '';
            const juridiction = juridictionEl ? juridictionEl.textContent?.trim() : '';
            const court = courtEl ? courtEl.textContent?.trim() : '';
            const category = categoryEl ? categoryEl.textContent?.trim() : '';
            const type = typeEl ? typeEl.textContent?.trim() : 'article';
            
            // Extraire l'année de publication à partir de la date
            let publicationYear = new Date().getFullYear();
            if (dateText) {
              const yearMatch = dateText.match(/\b(19|20)\d{2}\b/);
              if (yearMatch) {
                publicationYear = parseInt(yearMatch[0]);
              }
            }
            
            // Déterminer le type de document
            let docType: 'jurisprudence' | 'doctrine' | 'legislation' | 'article' = 'article';
            if (type) {
              if (type.toLowerCase().includes('juris')) docType = 'jurisprudence';
              else if (type.toLowerCase().includes('doctr')) docType = 'doctrine';
              else if (type.toLowerCase().includes('legi')) docType = 'legislation';
            }
            
            results.push({
              id: `efl-${index + 1}`,
              title: title || `Résultat pour ${query}`,
              excerpt: excerpt || 'Aucun extrait disponible',
              source: 'EFL Francis Lefebvre',
              type: docType,
              date: dateText || new Date().toISOString().split('T')[0],
              url: url ? (url.startsWith('http') ? url : `${selectors.url}${url}`) : '',
              relevance: 88 - index * 2,
              jurisdiction: juridiction || 'Non spécifié',
              court: court || 'Non spécifié',
              author: author || 'Non spécifié',
              publicationYear,
              category: category || 'Non catégorisé',
              language: 'Français',
              country: 'France',
              citations: Math.floor(Math.random() * 10) // Estimation aléatoire, à remplacer par une vraie valeur si disponible
            });
          });
          
          return results;
        }, this);
      } catch (error) {
        console.error('Erreur lors du scraping de EFL Francis Lefebvre:', error);
        return [];
      }
    }
  }
};

/**
 * Lance un navigateur Puppeteer avec des options optimisées
 * @returns {Promise<Browser>} Instance de navigateur
 */
async function launchBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: true, // Utilise le mode headless standard
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
    defaultViewport: { width: 1280, height: 800 }
  });
}

/**
 * Authentifie l'utilisateur sur un site
 * @param {Page} page - Page Puppeteer
 * @param {string} siteName - Nom du site
 * @param {string} username - Nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<boolean>} Succès de l'authentification
 */
async function authenticateOnSite(page: Page, siteName: string, username: string, password: string): Promise<boolean> {
  const config = siteConfigs[siteName];
  if (!config || !config.loginUrl || !config.usernameSelector || !config.passwordSelector || !config.submitSelector) {
    console.error(`Configuration d'authentification manquante pour ${siteName}`);
    return false;
  }

  try {
    console.log(`Tentative d'authentification sur ${siteName}...`);
    
    // Accéder à la page de connexion
    await page.goto(config.loginUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Vérifier si déjà connecté
    if (config.isLoggedInSelector) {
      const alreadyLoggedIn = await page.evaluate((selector) => {
        return !!document.querySelector(selector);
      }, config.isLoggedInSelector);
      
      if (alreadyLoggedIn) {
        console.log(`Déjà connecté sur ${siteName}`);
        return true;
      }
    }
    
    // Attendre que les sélecteurs de formulaire soient disponibles
    await page.waitForSelector(config.usernameSelector, { timeout: 10000 })
      .catch(() => console.log(`Délai d'attente dépassé pour le sélecteur de nom d'utilisateur sur ${siteName}`));
    
    await page.waitForSelector(config.passwordSelector, { timeout: 5000 })
      .catch(() => console.log(`Délai d'attente dépassé pour le sélecteur de mot de passe sur ${siteName}`));
    
    await page.waitForSelector(config.submitSelector, { timeout: 5000 })
      .catch(() => console.log(`Délai d'attente dépassé pour le sélecteur de soumission sur ${siteName}`));
    
    // Remplir le formulaire d'authentification avec un délai entre les saisies pour simuler un comportement humain
    await page.type(config.usernameSelector, username, { delay: 50 });
    
    // Petite pause aléatoire entre les saisies
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200)));
    
    await page.type(config.passwordSelector, password, { delay: 50 });
    
    // Petite pause avant de cliquer sur le bouton de soumission
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 300)));
    
    // Soumettre le formulaire
    await Promise.all([
      page.click(config.submitSelector),
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 })
        .catch(() => console.log(`Délai d'attente de navigation dépassé après soumission sur ${siteName}`))
    ]);
    
    // Vérifier si l'authentification a réussi
    const isLoggedIn = await page.evaluate((config) => {
      // Vérification par présence d'un élément qui indique que l'utilisateur est connecté
      if (config.isLoggedInSelector && document.querySelector(config.isLoggedInSelector)) {
        return true;
      }
      
      // Vérification par absence d'éléments d'erreur
      return !document.querySelector('.login-error') && 
             !document.querySelector('.error-message') &&
             !document.querySelector('.auth-error');
    }, config);
    
    if (isLoggedIn) {
      console.log(`Authentification réussie sur ${siteName}`);
    } else {
      console.error(`Échec de l'authentification sur ${siteName}`);
    }
    
    return isLoggedIn;
  } catch (error) {
    console.error(`Erreur lors de l'authentification sur ${siteName}:`, error);
    return false;
  }
}

/**
 * Effectue le scraping d'un site spécifique avec authentification
 * @param {Browser} browser - Instance de navigateur Puppeteer
 * @param {string} site - Nom du site à scraper
 * @param {string} query - Requête de recherche
 * @returns {Promise<SearchResult[]>} Résultats de recherche
 */
async function scrapeSite(browser: Browser, site: string, query: string): Promise<SearchResult[]> {
  const config = siteConfigs[site];
  if (!config) {
    console.error(`Pas de configuration de scraping disponible pour ${site}`);
    return [];
  }
  
  const page = await browser.newPage();
  
  try {
    // Configuration pour éviter la détection de bot
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Cache-Control': 'max-age=0',
      'Connection': 'keep-alive',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1'
    });
    
    // Désactiver certaines fonctionnalités pour accélérer le chargement mais pas toutes pour éviter la détection
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['image', 'font', 'media'].includes(resourceType)) {
        request.abort();
      } else if (resourceType === 'stylesheet') {
        // Permettre les CSS principaux mais bloquer les moins importants
        const url = request.url();
        if (url.includes('analytics') || url.includes('tracking') || url.includes('ads')) {
          request.abort();
        } else {
          request.continue();
        }
      } else {
        request.continue();
      }
    });
    
    // Configuration des cookies et du stockage
    await page.setCookie({
      name: 'cookieConsent',
      value: 'accepted',
      domain: new URL(config.url).hostname,
      path: '/',
      expires: Math.floor(Date.now() / 1000) + 86400 * 30,
    });
    
    // Récupérer les identifiants stockés
    const credentials = getStoredCredentials();
    if (credentials) {
      // Trouver le bon ensemble d'identifiants pour ce site
      let dbKey: keyof typeof credentials | null = null;
      if (site === 'Lexis Nexis') dbKey = 'database1';
      else if (site === 'Dalloz') dbKey = 'database2';
      else if (site === 'EFL Francis Lefebvre') dbKey = 'database3';
      
      // Authentification si les identifiants sont disponibles
      if (dbKey && credentials[dbKey].username && credentials[dbKey].password) {
        const isAuthenticated = await authenticateOnSite(
          page, 
          site, 
          credentials[dbKey].username, 
          credentials[dbKey].password
        );
        
        if (!isAuthenticated) {
          console.warn(`Impossible de s'authentifier sur ${site}, tentative de scraping sans authentification`);
        }
      }
    }
    
    // Extraction des données
    console.log(`Lancement du scraping sur ${site} pour la requête: "${query}"`);
    try {
      const startTime = Date.now();
      const results = await config.extractData(page, query);
      console.log(`Scraping de ${site} terminé en ${((Date.now() - startTime) / 1000).toFixed(2)}s avec ${results.length} résultats`);
      return results;
    } catch (error) {
      console.error(`Erreur lors de l'extraction des données sur ${site}:`, error);
      return [];
    }
  } catch (error) {
    console.error(`Erreur lors du scraping de ${site}:`, error);
    return [];
  } finally {
    await page.close();
  }
}

/**
 * Effectue une recherche sur plusieurs sites via scraping
 * @param {string} query - Requête de recherche
 * @returns {Promise<SearchResult[]>} Résultats combinés
 */
export async function searchAllSites(query: string): Promise<SearchResult[]> {
  // Obtenir la liste des bases de données accessibles
  const accessibleDatabases = getAccessibleDatabases();
  
  if (accessibleDatabases.length === 0) {
    throw new Error("Aucune base de données accessible. Veuillez fournir au moins un identifiant.");
  }
  
  const browser = await launchBrowser();
  
  try {
    console.log(`Lancement de la recherche sur ${accessibleDatabases.length} base(s) de données: ${accessibleDatabases.join(', ')}`);
    
    // Créer un ensemble de promesses pour les opérations de scraping avec délais échelonnés
    const scrapingPromises = accessibleDatabases.map((db, index) => {
      // Ajouter un délai aléatoire entre les requêtes pour éviter une surcharge et être détecté
      const delay = index * 3000 + Math.floor(Math.random() * 2000);
      return new Promise<SearchResult[]>(resolve => {
        setTimeout(async () => {
          console.log(`Démarrage du scraping pour ${db} après ${delay}ms de délai`);
          const results = await scrapeSite(browser, db, query);
          resolve(results);
        }, delay);
      });
    });
    
    const scrapingResults = await Promise.allSettled(scrapingPromises);
    
    // Traiter les résultats, en prenant en compte les promesses rejetées
    const allResults = scrapingResults
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          console.error(`Échec du scraping pour ${accessibleDatabases[index]}:`, result.reason);
          return [];
        }
      })
      .flat();
    
    console.log(`Recherche terminée. Total de ${allResults.length} résultats récupérés.`);
    return allResults;
  } finally {
    await browser.close();
  }
}

/**
 * Implémente une recherche avec limitation de taux
 */
class ScrapingRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private timeWindow: number;
  
  /**
   * Crée un limiteur de taux pour le scraping
   * @param {number} maxRequests - Nombre maximum de requêtes autorisées
   * @param {number} timeWindow - Fenêtre de temps en millisecondes
   */
  constructor(maxRequests: number = 5, timeWindow: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }
  
  /**
   * Vérifie si une action est autorisée
   * @param {string} key - Clé d'identification (ex: site + requête)
   * @returns {boolean} True si l'action est autorisée
   */
  isActionAllowed(key: string): boolean {
    const now = Date.now();
    const requestTimestamps = this.requests.get(key) || [];
    
    // Supprimer les timestamps plus anciens que la fenêtre de temps
    const validTimestamps = requestTimestamps.filter(timestamp => now - timestamp < this.timeWindow);
    
    if (validTimestamps.length < this.maxRequests) {
      validTimestamps.push(now);
      this.requests.set(key, validTimestamps);
      return true;
    }
    
    return false;
  }
  
  /**
   * Obtient le temps d'attente avant la prochaine requête autorisée
   * @param {string} key - Clé d'identification
   * @returns {number} Temps d'attente en millisecondes
   */
  getTimeToWait(key: string): number {
    const now = Date.now();
    const requestTimestamps = this.requests.get(key) || [];
    
    if (requestTimestamps.length < this.maxRequests) {
      return 0;
    }
    
    // Trier les timestamps pour trouver le plus ancien
    const sortedTimestamps = [...requestTimestamps].sort((a, b) => a - b);
    const oldestTimestamp = sortedTimestamps[0];
    
    // Calculer le temps à attendre
    return oldestTimestamp + this.timeWindow - now;
  }
}

// Exporter le limiteur de taux pour une utilisation externe
export const scrapingRateLimiter = new ScrapingRateLimiter();
