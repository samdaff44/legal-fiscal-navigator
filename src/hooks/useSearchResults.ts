
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SearchResult } from '@/models/SearchResult';
import { searchController } from '@/controllers/search';
import { getAccessibleDatabases } from '@/models/Database';
import { SearchFilters } from '@/types/search';
import { copyToClipboard } from '@/utils/resultActions';
import { SearchFilter } from '@/models/SearchResult';

interface UseSearchResultsProps {
  query: string;
  filters?: SearchFilters;
  sortOrder?: string;
}

/**
 * Hook personnalisé pour gérer les résultats de recherche
 * @param {UseSearchResultsProps} props - Propriétés de recherche
 * @returns {Object} État et fonctions pour gérer les résultats
 */
export const useSearchResults = ({ query, filters, sortOrder }: UseSearchResultsProps) => {
  const { toast } = useToast();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [searchedDatabases, setSearchedDatabases] = useState<string[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Détermine quelles bases de données ont des identifiants
        const availableDatabases = getAccessibleDatabases();
        
        if (availableDatabases.length === 0) {
          throw new Error("Aucun identifiant trouvé. Veuillez vous connecter d'abord.");
        }
        
        setSearchedDatabases(availableDatabases);
        
        toast({
          title: "Recherche en cours",
          description: `Interrogation de ${availableDatabases.length} base${availableDatabases.length > 1 ? 's' : ''} de données: ${availableDatabases.join(', ')}`,
          duration: 3000,
        });
        
        // Convertir les filtres du format SearchFilters vers SearchFilter
        const convertedFilters: SearchFilter = {};
        
        if (filters) {
          // Map sources and types directly
          if (filters.sources) convertedFilters.sources = filters.sources;
          if (filters.types) convertedFilters.types = filters.types;
          
          // Convert dateRange format
          if (filters.dateRange) {
            convertedFilters.dateRange = {
              start: filters.dateRange.from ? filters.dateRange.from.toISOString() : undefined,
              end: filters.dateRange.to ? filters.dateRange.to.toISOString() : undefined
            };
          }
          
          // Map other properties directly
          if (filters.jurisdiction) convertedFilters.jurisdiction = filters.jurisdiction;
          if (filters.court) convertedFilters.court = filters.court;
          if (filters.author) convertedFilters.author = filters.author;
          if (filters.publicationYears && filters.publicationYears.length > 0) {
            convertedFilters.publicationYear = filters.publicationYears[0]; // Using the first year for simplicity
          }
          if (filters.categories) convertedFilters.categories = filters.categories;
          if (filters.languages) convertedFilters.languages = filters.languages;
          if (filters.country) convertedFilters.country = filters.country;
          if (filters.relevanceThreshold) convertedFilters.relevanceThreshold = filters.relevanceThreshold;
          if (filters.citationsThreshold) convertedFilters.minCitations = filters.citationsThreshold;
          if (filters.maxResults) convertedFilters.maxResults = filters.maxResults;
        }
        
        const searchResults = await searchController.searchAllDatabases({ 
          query,
          filters: convertedFilters,
          sortOrder
        });
        setResults(searchResults);
        
        // Ajoute la recherche à l'historique
        searchController.addToSearchHistory(query, searchResults.length);
        
        toast({
          title: "Recherche terminée",
          description: `${searchResults.length} résultats trouvés`,
          duration: 3000,
        });
      } catch (err) {
        console.error('Erreur de recherche:', err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la recherche");
        
        toast({
          title: "Erreur de recherche",
          description: err instanceof Error ? err.message : "Une erreur est survenue lors de la recherche",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [query, filters, sortOrder, toast]);

  /**
   * Bascule l'état d'expansion d'un résultat
   * @param {string} id - Identifiant du résultat
   */
  const toggleExpand = (id: string) => {
    setExpandedResult(expandedResult === id ? null : id);
  };

  /**
   * Copie le texte dans le presse-papier
   * @param {string} text - Texte à copier
   */
  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    
    if (success) {
      toast({
        title: "Copié",
        description: "Le texte a été copié dans le presse-papier",
        duration: 3000,
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte dans le presse-papier",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return {
    results,
    isLoading,
    error,
    expandedResult,
    toggleExpand,
    handleCopy,
    searchedDatabases
  };
};
