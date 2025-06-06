import { SearchResult } from '@/models/SearchResult';

// Type definitions for the scraping service interfaces
type SearchFunction = (query: string) => Promise<SearchResult[]>;
interface RateLimiter {
  isActionAllowed: (key: string) => boolean;
  getTimeToWait: (key: string) => number;
}

// Define mock results for when all else fails
const generateMockResults = (query: string): SearchResult[] => [{
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

// Define fallback implementations
const fallbackSearchAllSites: SearchFunction = async (query: string) => {
  console.warn('Using fallback scraping implementation');
  return generateMockResults(query);
};

const fallbackRateLimiter: RateLimiter = {
  isActionAllowed: () => true,
  getTimeToWait: () => 0
};

// Start with fallback implementations
let searchAllSites: SearchFunction = fallbackSearchAllSites;
let scrapingRateLimiter: RateLimiter = fallbackRateLimiter;

// Safe environment detection
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

if (isBrowser) {
  console.log('Browser environment detected, using mock scraping service');
  
  // Use dynamic import with error handling for the mock implementation
  import('./mockScrapingService')
    .then((mockModule) => {
      searchAllSites = mockModule.searchAllSites;
      scrapingRateLimiter = mockModule.scrapingRateLimiter;
      console.log('Mock scraping service loaded successfully');
    })
    .catch((err) => {
      console.error('Failed to load mock scraping module:', err);
      // Keep using the fallbacks defined above
    });
} else {
  console.log('Server environment detected, attempting to load real scraping service');
  
  // In the server environment, we can safely attempt to load the server module
  // This code won't be executed in the browser
  try {
    // Use a more direct import that won't be processed by Vite in the browser build
    const serverModule = require('./scrapingService');
    searchAllSites = serverModule.searchAllSites;
    scrapingRateLimiter = serverModule.scrapingRateLimiter;
    console.log('Server-side scraping service loaded successfully');
  } catch (err) {
    console.error('Failed to load server-side scraping module:', err);
    
    // Try to use mock as fallback in server environment
    try {
      const mockModule = require('./mockScrapingService');
      searchAllSites = mockModule.searchAllSites;
      scrapingRateLimiter = mockModule.scrapingRateLimiter;
      console.log('Falling back to mock scraping service');
    } catch (mockErr) {
      console.error('Failed to load mock module as fallback:', mockErr);
      // Keep using the fallbacks defined above
    }
  }
}

export { searchAllSites, scrapingRateLimiter };
