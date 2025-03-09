
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SearchResult } from '@/models/SearchResult';
import { searchController } from '@/controllers/searchController';
import { getAccessibleDatabases } from '@/models/Database';
import { SearchFilters } from '@/types/search';

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
        
        const searchResults = await searchController.searchAllDatabases({ 
          query,
          filters: filters || {},
          sortOrder // Now correctly passing sortOrder to searchAllDatabases
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
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Le texte a été copié dans le presse-papier",
      duration: 3000,
    });
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
