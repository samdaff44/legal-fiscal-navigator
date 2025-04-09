
import { SearchResult } from '@/models/SearchResult';

// Dynamically import the appropriate service based on the environment
let searchAllSites: (query: string) => Promise<SearchResult[]>;
let scrapingRateLimiter: {
  isActionAllowed: (key: string) => boolean;
  getTimeToWait: (key: string) => number;
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

// Use dynamic imports to avoid loading the server-side code in the browser
if (isBrowser) {
  const mockModule = await import('./mockScrapingService');
  searchAllSites = mockModule.searchAllSites;
  scrapingRateLimiter = mockModule.scrapingRateLimiter;
} else {
  try {
    const serverModule = await import('./scrapingService');
    searchAllSites = serverModule.searchAllSites;
    scrapingRateLimiter = serverModule.scrapingRateLimiter;
  } catch (err) {
    console.error('Failed to load server-side scraping module:', err);
    // Fallback to mock if server-side import fails
    const mockModule = await import('./mockScrapingService');
    searchAllSites = mockModule.searchAllSites;
    scrapingRateLimiter = mockModule.scrapingRateLimiter;
  }
}

export { searchAllSites, scrapingRateLimiter };
