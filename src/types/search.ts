
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
  sources?: string[];
  dateFrom?: string;
  dateTo?: string;
  types?: string[];
  sortOption?: string;
  language?: string;
  country?: string;
}

export interface ResultsDisplayProps {
  query: string;
  filters?: SearchFilters;
  sortOrder?: string;
}
