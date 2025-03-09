
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdvancedFilters from './AdvancedFilters';
import { searchController } from '@/controllers/search';
import { authController } from '@/controllers/authController';
import { SearchHistory } from '@/models/SearchResult';
import SearchInput from './search/SearchInput';
import SearchHistoryComponent from './search/SearchHistory';
import DatabaseButtons, { DATABASE_NAMES } from './search/DatabaseButtons';

/**
 * Composant de barre de recherche
 */
const SearchBar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>(["Toutes les bases"]);

  useEffect(() => {
    // Récupération de l'historique des recherches
    setSearchHistory(searchController.getSearchHistory());
  }, []);

  useEffect(() => {
    // Gestion des clics en dehors de la barre de recherche
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearchHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    const currentHistory = searchController.getSearchHistory();
    const newHistory = [
      { query: trimmedQuery, timestamp: Date.now() },
      ...currentHistory.filter(item => item.query !== trimmedQuery).slice(0, 4)
    ];
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Toast de notification
    const dbMessage = selectedDatabases.includes("Toutes les bases") 
      ? "Recherche sur les trois bases de données..."
      : `Recherche sur ${selectedDatabases.join(", ")}...`;
    
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
          databases: selectedDatabases.includes("Toutes les bases") 
            ? ["Lexis Nexis", "Dalloz", "EFL Francis Lefebvre"]
            : selectedDatabases
        } 
      });
    }, 1000);
  };

  /**
   * Sélectionne un élément de l'historique
   */
  const selectHistoryItem = (item: string) => {
    setQuery(item);
    setShowSearchHistory(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
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

  /**
   * Bascule la sélection d'une base de données
   */
  const toggleDatabase = (dbName: string) => {
    if (dbName === "Toutes les bases") {
      setSelectedDatabases(["Toutes les bases"]);
      return;
    }
    
    const newSelection = selectedDatabases.filter(db => db !== "Toutes les bases");
    
    if (newSelection.includes(dbName)) {
      if (newSelection.length === 1) {
        setSelectedDatabases(["Toutes les bases"]);
      } else {
        setSelectedDatabases(newSelection.filter(db => db !== dbName));
      }
    } else {
      setSelectedDatabases([...newSelection, dbName]);
    }
  };

  /**
   * Efface l'historique des recherches
   */
  const clearSearchHistory = () => {
    searchController.clearSearchHistory();
    setSearchHistory([]);
    setShowSearchHistory(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center">
          <SearchInput
            query={query}
            setQuery={setQuery}
            isSearching={isSearching}
            onFocus={() => setShowSearchHistory(true)}
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
        selectHistoryItem={selectHistoryItem}
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
