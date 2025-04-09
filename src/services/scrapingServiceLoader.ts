
import { SearchResult } from '@/models/SearchResult';

// Dynamically import the appropriate service based on the environment
let searchAllSites: (query: string) => Promise<SearchResult[]>;
let scrapingRateLimiter: {
  isActionAllowed: (key: string) => boolean;
  getTimeToWait: (key: string) => number;
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Define fallback implementations in case imports fail
const fallbackSearchAllSites = async (query: string): Promise<SearchResult[]> => {
  console.warn('Using fallback scraping implementation');
  return [{
    id: 'fallback-1',
    title: `Fallback result for "${query}"`,
    excerpt: 'Une erreur est survenue lors du chargement du service de recherche.',
    source: 'Lexis Nexis',
    type: 'jurisprudence',
    date: new Date().toISOString().split('T')[0],
    url: '#',
    relevance: 0,
    jurisdiction: 'N/A',
    court: 'N/A',
    author: 'System',
    publicationYear: new Date().getFullYear(),
    category: 'Error',
    language: 'Français',
    country: 'France',
    citations: 0
  }];
};

const fallbackRateLimiter = {
  isActionAllowed: () => true,
  getTimeToWait: () => 0
};

// Initialize with fallbacks first
searchAllSites = fallbackSearchAllSites;
scrapingRateLimiter = fallbackRateLimiter;

// Wrap the dynamic imports in an IIFE to handle async imports
(async () => {
  try {
    if (isBrowser) {
      console.log('Browser environment detected, using mock scraping service');
      try {
        const mockModule = await import('./mockScrapingService');
        searchAllSites = mockModule.searchAllSites;
        scrapingRateLimiter = mockModule.scrapingRateLimiter;
      } catch (err) {
        console.error('Failed to load mock scraping module:', err);
      }
    } else {
      console.log('Server environment detected, using real scraping service');
      try {
        const serverModule = await import('./scrapingService');
        searchAllSites = serverModule.searchAllSites;
        scrapingRateLimiter = serverModule.scrapingRateLimiter;
      } catch (err) {
        console.error('Failed to load server-side scraping module:', err);
        // Fallback to mock if server-side import fails
        try {
          const mockModule = await import('./mockScrapingService');
          searchAllSites = mockModule.searchAllSites;
          scrapingRateLimiter = mockModule.scrapingRateLimiter;
        } catch (mockErr) {
          console.error('Failed to load mock module as fallback:', mockErr);
        }
      }
    }
  } catch (error) {
    console.error('Error initializing scraping service:', error);
    // Fallbacks are already set above
  }
})();

export { searchAllSites, scrapingRateLimiter };
