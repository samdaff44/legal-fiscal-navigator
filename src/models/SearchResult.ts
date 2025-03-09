/**
 * Modèle représentant les options de recherche
 */
export interface SearchOptions {
  query: string;
  filters?: SearchFilter;
  sortOrder?: string;  // Adding sortOrder property to fix the error
}

/**
 * Structure pour les filtres de recherche
 */
export interface SearchFilter {
  sources?: string[];
  types?: string[];
  dateRange?: { 
    start?: string; 
    end?: string 
  };
  jurisdiction?: string;
  court?: string;
  author?: string;
  publicationYear?: number;
  categories?: string[];
  languages?: string[];
  country?: string;
  relevanceThreshold?: number;
  minCitations?: number;
  maxResults?: number;
}

/**
 * Modèle représentant un résultat de recherche
 */
export interface SearchResult {
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

/**
 * Type pour l'historique des recherches
 */
export interface SearchHistory {
  query: string;
  timestamp: number;
  results?: number;
}

/**
 * Type pour le statut des bases de données
 */
export interface DatabaseStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastChecked: string;
}
