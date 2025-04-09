
import { SearchResult } from '@/models/SearchResult';

/**
 * Client-side mock implementation of the scraping service
 * This avoids importing Puppeteer in the browser
 */
export async function searchAllSites(query: string): Promise<SearchResult[]> {
  console.log('Using mock scraping service for client-side rendering');
  
  // Generate some mock results for demonstration
  return [
    {
      id: 'mock-1',
      title: `Résultat pour "${query}"`,
      excerpt: 'Ceci est un résultat simulé pour la démonstration côté client.',
      source: 'Lexis Nexis', // Using a valid source from the enum
      type: 'jurisprudence',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      relevance: 95,
      jurisdiction: 'France',
      court: 'Simulation',
      author: 'Client-side Mock',
      publicationYear: new Date().getFullYear(),
      category: 'Simulation',
      language: 'Français',
      country: 'France',
      citations: 0
    }
  ];
}

// Export the same rate limiter interface as the real service
export const scrapingRateLimiter = {
  isActionAllowed: (key: string): boolean => true,
  getTimeToWait: (key: string): number => 0
};
