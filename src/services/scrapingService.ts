
import puppeteer, { Browser, Page } from 'puppeteer';
import { SearchResult } from '@/models/SearchResult';
import { getAccessibleDatabases } from '@/models/Database';

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
    titleSelector: '.result-title',
    excerptSelector: '.result-excerpt',
    dateSelector: '.result-date',
    authorSelector: '.result-author',
    async extractData(page, query): Promise<SearchResult[]> {
      // En production, ceci serait une implémentation réelle de scraping
      // Pour cette démo, nous simulons des résultats
      await page.waitForTimeout(1000); // Simulation de délai de chargement
      
      console.log(`Scraping Lexis Nexis pour la requête: ${query}`);
      
      const results: SearchResult[] = [];
      for (let i = 0; i < 10; i++) {
        results.push({
          id: `lexis-${i + 1}`,
          title: `Scraping: Arrêt concernant ${query} - Lexis Nexis`,
          excerpt: `Ce document de Lexis Nexis traite de "${query}" dans le contexte juridique. Extrait par scraping web.`,
          source: 'Lexis Nexis',
          type: i % 2 === 0 ? 'jurisprudence' : 'doctrine',
          date: `${2020 + (i % 4)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
          url: `https://www.lexisnexis.fr/resultats/${i + 1}`,
          relevance: 95 - (i * 2),
          jurisdiction: i % 2 === 0 ? 'Cour de cassation' : 'Cour d\'appel',
          court: i % 2 === 0 ? 'Première chambre civile' : 'Chambre commerciale',
          author: `Auteur ${i + 1}`,
          publicationYear: 2020 + (i % 4),
          category: i % 2 === 0 ? 'Droit fiscal' : 'Droit des sociétés',
          language: 'Français',
          country: 'France',
          citations: Math.floor(Math.random() * 50)
        });
      }
      
      return results;
    }
  },
  'Dalloz': {
    url: 'https://www.dalloz.fr',
    searchPath: '/recherche',
    resultSelector: '.result-item',
    titleSelector: '.result-item-title',
    excerptSelector: '.result-item-excerpt',
    dateSelector: '.result-item-date',
    async extractData(page, query): Promise<SearchResult[]> {
      // Simulation pour Dalloz
      await page.waitForTimeout(1500);
      
      console.log(`Scraping Dalloz pour la requête: ${query}`);
      
      const results: SearchResult[] = [];
      for (let i = 0; i < 8; i++) {
        results.push({
          id: `dalloz-${i + 1}`,
          title: `Scraping: Texte relatif à ${query} - Dalloz`,
          excerpt: `Ce document de Dalloz concerne "${query}". Récupéré par web scraping.`,
          source: 'Dalloz',
          type: i % 2 === 0 ? 'legislation' : 'doctrine',
          date: `${2019 + (i % 5)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
          url: `https://www.dalloz.fr/document/${i + 1}`,
          relevance: 90 - (i * 3),
          jurisdiction: i % 2 === 0 ? 'Conseil d\'État' : 'Conseil constitutionnel',
          court: i % 2 === 0 ? 'Chambre sociale' : 'Chambre criminelle',
          author: `Expert ${i + 1}`,
          publicationYear: 2019 + (i % 5),
          category: i % 2 === 0 ? 'Droit administratif' : 'Droit pénal',
          language: 'Français',
          country: 'France',
          citations: Math.floor(Math.random() * 30)
        });
      }
      
      return results;
    }
  },
  'EFL Francis Lefebvre': {
    url: 'https://www.efl.fr',
    searchPath: '/recherche',
    resultSelector: '.search-result',
    titleSelector: '.result-heading',
    excerptSelector: '.result-description',
    dateSelector: '.publication-date',
    async extractData(page, query): Promise<SearchResult[]> {
      // Simulation pour EFL Francis Lefebvre
      await page.waitForTimeout(1200);
      
      console.log(`Scraping EFL Francis Lefebvre pour la requête: ${query}`);
      
      const results: SearchResult[] = [];
      for (let i = 0; i < 12; i++) {
        results.push({
          id: `efl-${i + 1}`,
          title: `Scraping: Publication sur ${query} - EFL Francis Lefebvre`,
          excerpt: `Article d'EFL Francis Lefebvre concernant "${query}". Données extraites via scraping.`,
          source: 'EFL Francis Lefebvre',
          type: i % 2 === 0 ? 'article' : 'doctrine',
          date: `${2018 + (i % 6)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
          url: `https://www.efl.fr/articles/${i + 1}`,
          relevance: 88 - (i * 2),
          jurisdiction: i % 2 === 0 ? 'Tribunal administratif' : 'Cour de cassation',
          court: i % 2 === 0 ? 'Chambre civile' : 'Chambre commerciale',
          author: `Juriste ${i + 1}`,
          publicationYear: 2018 + (i % 6),
          category: i % 2 === 0 ? 'Droit du travail' : 'Droit fiscal',
          language: 'Français',
          country: 'France',
          citations: Math.floor(Math.random() * 40)
        });
      }
      
      return results;
    }
  }
};

/**
 * Lance un navigateur Puppeteer avec des options optimisées
 * @returns {Promise<Browser>} Instance de navigateur
 */
async function launchBrowser(): Promise<Browser> {
  return puppeteer.launch({
    headless: 'new', // Utilise le nouveau mode headless
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
    defaultViewport: { width: 1280, height: 800 }
  });
}

/**
 * Effectue le scraping d'un site spécifique
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
    // Configuration du user agent pour éviter la détection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Désactiver les images et les styles pour accélérer le chargement
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
    
    // Accès au site avec gestion du timeout
    await Promise.race([
      page.goto(`${config.url}${config.searchPath}?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' }),
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout en accédant à ${site}`)), 15000))
    ]);
    
    // Extraction des données
    const results = await config.extractData(page, query);
    
    return results;
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
    const scrapingPromises = accessibleDatabases.map(db => scrapeSite(browser, db, query));
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
