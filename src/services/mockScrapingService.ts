
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
    },
    {
      id: 'mock-2',
      title: `Autre résultat pour "${query}"`,
      excerpt: 'Second résultat simulé pour la démonstration côté client.',
      source: 'Dalloz',
      type: 'doctrine',
      date: new Date().toISOString().split('T')[0],
      url: '#',
      relevance: 88,
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

// Simple client-side rate limiter implementation
class ClientRateLimiter {
  private timestamps: Record<string, number[]> = {};
  private maxRequests = 5;
  private timeWindow = 60000; // 1 minute
  
  isActionAllowed(key: string): boolean {
    const now = Date.now();
    if (!this.timestamps[key]) {
      this.timestamps[key] = [now];
      return true;
    }
    
    // Filter out old timestamps
    const validTimestamps = this.timestamps[key].filter(
      timestamp => now - timestamp < this.timeWindow
    );
    
    if (validTimestamps.length < this.maxRequests) {
      validTimestamps.push(now);
      this.timestamps[key] = validTimestamps;
      return true;
    }
    
    return false;
  }
  
  getTimeToWait(key: string): number {
    const now = Date.now();
    if (!this.timestamps[key] || this.timestamps[key].length < this.maxRequests) {
      return 0;
    }
    
    // Sort timestamps to find the oldest one
    const oldestValidTimestamp = [...this.timestamps[key]]
      .sort((a, b) => a - b)[0];
    
    return Math.max(0, (oldestValidTimestamp + this.timeWindow) - now);
  }
}

// Export the rate limiter interface
export const scrapingRateLimiter = new ClientRateLimiter();
