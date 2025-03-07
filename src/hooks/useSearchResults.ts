
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { ResultItem } from '@/types/search';
import { searchAllDatabases } from '@/services/searchService';

interface UseSearchResultsProps {
  query: string;
}

export const useSearchResults = ({ query }: UseSearchResultsProps) => {
  const { toast } = useToast();
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [searchedDatabases, setSearchedDatabases] = useState<string[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Determine which databases have credentials
        const credentialsString = localStorage.getItem('databaseCredentials');
        const credentials = credentialsString ? JSON.parse(credentialsString) : null;
        
        if (!credentials) {
          throw new Error("Aucun identifiant trouvé. Veuillez vous connecter d'abord.");
        }
        
        const availableDatabases = [];
        if (credentials.database1.username && credentials.database1.password) {
          availableDatabases.push('Lexis Nexis');
        }
        if (credentials.database2.username && credentials.database2.password) {
          availableDatabases.push('Dalloz');
        }
        if (credentials.database3.username && credentials.database3.password) {
          availableDatabases.push('EFL Francis Lefebvre');
        }
        
        setSearchedDatabases(availableDatabases);
        
        toast({
          title: "Recherche en cours",
          description: `Interrogation de ${availableDatabases.length} base${availableDatabases.length > 1 ? 's' : ''} de données: ${availableDatabases.join(', ')}`,
          duration: 3000,
        });
        
        const searchResults = await searchAllDatabases({ query });
        setResults(searchResults);
        
        toast({
          title: "Recherche terminée",
          description: `${searchResults.length} résultats trouvés`,
          duration: 3000,
        });
      } catch (err) {
        console.error('Search error:', err);
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
  }, [query, toast]);

  const toggleExpand = (id: string) => {
    setExpandedResult(expandedResult === id ? null : id);
  };

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
