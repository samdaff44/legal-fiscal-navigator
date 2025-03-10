
export interface ResultItem {
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

export interface SearchFilters {
  documentTypes?: string[];
  dateRange?: { from?: Date; to?: Date };
  jurisdiction?: string;
  court?: string;
  author?: string;
  publicationYears?: number[];
  categories?: string[];
  languages?: string[];
  country?: string;
  relevanceThreshold?: number;
  citationsThreshold?: number;
  sortOption?: string;
  maxResults?: number;
  sources?: string[];
  types?: string[];
}

export interface ResultsDisplayProps {
  query: string;
  filters?: SearchFilters;
  sortOrder?: string;
}
