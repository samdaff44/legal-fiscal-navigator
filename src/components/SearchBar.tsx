
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdvancedFilters from './AdvancedFilters';
import { searchController } from '@/controllers/search';
import { authController } from '@/controllers/authController';
import SearchInput from './search/SearchInput';
import SearchHistoryComponent from './search/SearchHistory';
import DatabaseButtons from './search/DatabaseButtons';
import { useDatabaseSelection } from '@/hooks/useDatabaseSelection';
import { useSearchHistory } from '@/hooks/useSearchHistory';

/**
 * Composant de barre de recherche
 */
const SearchBar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  const { 
    selectedDatabases, 
    toggleDatabase,
    getSelectedDatabasesForSearch
  } = useDatabaseSelection();
  
  const {
    searchHistory,
    showSearchHistory,
    selectHistoryItem,
    clearSearchHistory,
    toggleSearchHistory
  } = useSearchHistory();

  useEffect(() => {
    // Gestion des clics en dehors de la barre de recherche
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        toggleSearchHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSearchHistory]);

  /**
   * Gère la soumission du formulaire de recherche
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast({
        title: "Recherche vide",
        description: "Veuillez entrer un terme de recherche",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Vérifie si l'utilisateur est authentifié
    if (!authController.isAuthenticated()) {
      toast({
        title: "Connexion requise",
        description: "Veuillez d'abord vous connecter aux bases de données",
        variant: "destructive",
        duration: 3000,
      });
      navigate('/');
      return;
    }

    setIsSearching(true);

    // Mise à jour de l'historique des recherches
    const trimmedQuery = query.trim();
    searchController.addToSearchHistory(trimmedQuery, 0);

    // Toast de notification
    const selectedDBs = getSelectedDatabasesForSearch();
    const dbMessage = selectedDatabases.includes("Toutes les bases") 
      ? "Recherche sur les trois bases de données..."
      : `Recherche sur ${selectedDBs.join(", ")}...`;
    
    toast({
      title: "Recherche en cours",
      description: dbMessage,
      duration: 2000,
    });

    // Redirection vers la page de résultats
    setTimeout(() => {
      setIsSearching(false);
      navigate('/results', { 
        state: { 
          query,
          databases: selectedDBs
        } 
      });
    }, 1000);
  };

  /**
   * Efface la requête de recherche
   */
  const clearQuery = () => {
    setQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center">
          <SearchInput
            query={query}
            setQuery={setQuery}
            isSearching={isSearching}
            onFocus={() => toggleSearchHistory(true)}
            clearQuery={clearQuery}
            searchInputRef={searchInputRef}
          />
          
          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button 
                type="button" 
                variant="outline" 
                size="icon" 
                className="ml-2"
                aria-label="Filtres avancés"
              >
                <Filter className={`h-5 w-5 ${filtersOpen ? 'text-primary' : ''}`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <AdvancedFilters />
            </PopoverContent>
          </Popover>
          
          <Button 
            type="submit" 
            className="ml-2" 
            disabled={isSearching || !query.trim()}
            aria-label="Lancer la recherche"
          >
            {isSearching ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
      </form>

      <SearchHistoryComponent
        searchHistory={searchHistory}
        selectHistoryItem={(item) => selectHistoryItem(item, () => setQuery(item))}
        clearSearchHistory={clearSearchHistory}
        show={showSearchHistory}
      />

      <DatabaseButtons
        selectedDatabases={selectedDatabases}
        toggleDatabase={toggleDatabase}
      />
    </div>
  );
};

export default SearchBar;
