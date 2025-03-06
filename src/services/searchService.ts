
import { useToast } from "@/components/ui/use-toast";

interface SearchOptions {
  query: string;
  filters?: {
    date?: { start?: string; end?: string };
    sources?: string[];
    type?: string[];
    jurisdiction?: string;
    relevanceThreshold?: number;
    court?: string;
    author?: string;
    publicationYear?: number;
    category?: string[];
    language?: string[];
    country?: string;
    maxResults?: number;
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
  jurisdiction?: string;
  court?: string;
  author?: string;
  publicationYear?: number;
  category?: string;
  language?: string;
  country?: string;
  citations?: number;
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
      
      // Generate more mock results per database (increased from 5 to 15)
      const resultsCount = options.filters?.maxResults ? 
        Math.min(options.filters.maxResults, 30) : 15;
      
      for (let i = 0; i < resultsCount; i++) {
        // Create more diverse mock data
        const types = ['jurisprudence', 'doctrine', 'legislation', 'article'];
        const typeIndex = i % 4;
        const jurisdictions = ['Cour de cassation', 'Conseil d\'État', 'Cour d\'appel', 'Tribunal administratif', 'Conseil constitutionnel'];
        const courts = ['Première chambre civile', 'Chambre commerciale', 'Chambre sociale', 'Chambre criminelle'];
        const authors = ['Dupont', 'Martin', 'Dubois', 'Lefebvre', 'Moreau'];
        const categories = ['Droit fiscal', 'Droit des sociétés', 'Droit du travail', 'Droit pénal', 'Droit administratif'];
        const languages = ['Français', 'Anglais'];
        const countries = ['France', 'Belgique', 'Luxembourg', 'Suisse'];
        
        results.push({
          id: `${database.toLowerCase().replace(/\s/g, '-')}-${i + 1}`,
          title: `${types[typeIndex] === 'jurisprudence' ? 'Arrêt' : 
                   types[typeIndex] === 'doctrine' ? 'Article sur' : 
                   types[typeIndex] === 'legislation' ? 'Texte concernant' : 
                   'Publication relative à'} ${options.query} - ${database}`,
          excerpt: `Ce document de ${database} traite de "${options.query}" dans le contexte fiscal et juridique. Il aborde les questions essentielles concernant l'application des dispositions légales.`,
          source: database as any,
          type: types[typeIndex] as any,
          date: `${2000 + (i % 23)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
          url: `https://example.com/${database.toLowerCase().replace(/\s/g, '')}/document/${i + 1}`,
          relevance: Math.round(98 - (i * 1.5)),
          jurisdiction: jurisdictions[i % jurisdictions.length],
          court: courts[i % courts.length],
          author: authors[i % authors.length],
          publicationYear: 2000 + (i % 23),
          category: categories[i % categories.length],
          language: languages[i % languages.length],
          country: countries[i % countries.length],
          citations: Math.floor(Math.random() * 100)
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
    
    // Filter by jurisdiction
    if (filters.jurisdiction && result.jurisdiction !== filters.jurisdiction) {
      return false;
    }
    
    // Filter by court
    if (filters.court && result.court !== filters.court) {
      return false;
    }
    
    // Filter by author
    if (filters.author && result.author !== filters.author) {
      return false;
    }
    
    // Filter by publication year
    if (filters.publicationYear && result.publicationYear !== filters.publicationYear) {
      return false;
    }
    
    // Filter by category
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(result.category)) {
        return false;
      }
    }
    
    // Filter by language
    if (filters.languages && filters.languages.length > 0) {
      if (!filters.languages.includes(result.language)) {
        return false;
      }
    }
    
    // Filter by country
    if (filters.country && result.country !== filters.country) {
      return false;
    }
    
    // Filter by minimum relevance
    if (filters.relevanceThreshold && result.relevance < filters.relevanceThreshold) {
      return false;
    }
    
    // Filter by minimum citations
    if (filters.minCitations && result.citations < filters.minCitations) {
      return false;
    }
    
    return true;
  });
};
