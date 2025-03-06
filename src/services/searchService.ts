
import { useToast } from "@/components/ui/use-toast";

interface SearchOptions {
  query: string;
  filters?: {
    date?: { start?: string; end?: string };
    sources?: string[];
    type?: string[];
  };
}

interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  source: 'Lexis Nexis' | 'Dalloz' | 'EFL Francis Lefebvre';
  type: 'jurisprudence' | 'doctrine' | 'legislation' | 'article';
  date: string;
  url: string;
  relevance: number;
}

const searchDatabase = async (
  database: string,
  options: SearchOptions
): Promise<SearchResult[]> => {
  // Simulate API request to each database
  console.log(`Searching ${database} with query: ${options.query}`);
  
  // This is a simulation - in real implementation, this would make actual API calls
  // to each service using the stored credentials
  return new Promise((resolve) => {
    setTimeout(() => {
      const results: SearchResult[] = [];
      
      // Generate 5 mock results per database
      for (let i = 0; i < 5; i++) {
        results.push({
          id: `${database.toLowerCase().replace(/\s/g, '-')}-${i + 1}`,
          title: `${i % 3 === 0 ? 'Arrêt' : i % 3 === 1 ? 'Article sur' : 'Texte concernant'} ${options.query} - ${database}`,
          excerpt: `Ce document de ${database} traite de "${options.query}" dans le contexte fiscal et juridique. Il aborde les questions essentielles concernant l'application des dispositions légales.`,
          source: database as any,
          type: ['jurisprudence', 'doctrine', 'legislation', 'article'][i % 4] as any,
          date: `${2010 + (i % 13)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
          url: `https://example.com/${database.toLowerCase().replace(/\s/g, '')}/document/${i + 1}`,
          relevance: Math.round(95 - (i * 3.5))
        });
      }
      
      resolve(results);
    }, 1000 + Math.random() * 1000); // Random delay to simulate different response times
  });
};

export const searchAllDatabases = async (options: SearchOptions): Promise<SearchResult[]> => {
  // Check if credentials exist
  const credentialsString = localStorage.getItem('databaseCredentials');
  if (!credentialsString) {
    throw new Error("Aucun identifiant trouvé. Veuillez vous connecter d'abord.");
  }

  try {
    // Get results from all three databases in parallel
    const [lexisResults, dallozResults, eflResults] = await Promise.all([
      searchDatabase('Lexis Nexis', options),
      searchDatabase('Dalloz', options),
      searchDatabase('EFL Francis Lefebvre', options)
    ]);

    // Combine and sort by relevance
    const allResults = [...lexisResults, ...dallozResults, ...eflResults]
      .sort((a, b) => b.relevance - a.relevance);
    
    return allResults;
  } catch (error) {
    console.error("Error searching databases:", error);
    throw new Error("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
  }
};

export const filterResults = (results: SearchResult[], filters: any): SearchResult[] => {
  return results.filter(result => {
    // Filter by source if specified
    if (filters.sources && filters.sources.length > 0) {
      if (!filters.sources.includes(result.source)) {
        return false;
      }
    }
    
    // Filter by type if specified
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(result.type)) {
        return false;
      }
    }
    
    // Filter by date range if specified
    if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
      const resultDate = new Date(result.date);
      
      if (filters.dateRange.start && new Date(filters.dateRange.start) > resultDate) {
        return false;
      }
      
      if (filters.dateRange.end && new Date(filters.dateRange.end) < resultDate) {
        return false;
      }
    }
    
    return true;
  });
};
