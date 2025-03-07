
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Database, 
  Filter, 
  BookOpen, 
  FileText, 
  X, 
  ArrowRight 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import AdvancedFilters from './AdvancedFilters';
import { searchController } from '@/controllers/searchController';
import { authController } from '@/controllers/authController';
import { SearchHistory } from '@/models/SearchResult';

const DATABASE_NAMES = [
  { name: "Toutes les bases", icon: <Database className="h-4 w-4" /> },
  { name: "Lexis Nexis", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Dalloz", icon: <FileText className="h-4 w-4" /> },
  { name: "EFL Francis Lefebvre", icon: <Database className="h-4 w-4" /> }
];

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
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <Input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowSearchHistory(true)}
              placeholder="Rechercher des articles, jurisprudence, textes de loi..."
              className="pl-10 pr-10 py-6 text-base shadow-soft"
              disabled={isSearching}
              aria-label="Champ de recherche"
            />
            
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="absolute inset-y-0 right-2 flex items-center"
                aria-label="Effacer la recherche"
              >
                <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>
          
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

      {showSearchHistory && searchHistory.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-md animate-fade-in">
          <div className="p-2 border-b">
            <h3 className="text-sm font-medium text-muted-foreground">Recherches récentes</h3>
          </div>
          <ul>
            {searchHistory.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => selectHistoryItem(item.query)}
                  className="w-full px-4 py-2 text-left flex items-center hover:bg-accent transition-colors"
                >
                  <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="flex-grow truncate">{item.query}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="p-2 border-t">
            <button
              type="button"
              onClick={clearSearchHistory}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Effacer l'historique
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center mt-6 gap-3">
        {DATABASE_NAMES.map((db, index) => (
          <DatabaseButton 
            key={index} 
            icon={db.icon} 
            name={db.name} 
            isActive={selectedDatabases.includes(db.name)}
            onClick={() => toggleDatabase(db.name)}
          />
        ))}
      </div>
    </div>
  );
};

interface DatabaseButtonProps {
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const DatabaseButton = ({ icon, name, isActive, onClick }: DatabaseButtonProps) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`rounded-full transition-all duration-300 ${
        isActive 
          ? 'bg-primary text-primary-foreground shadow-md' 
          : 'bg-background hover:bg-accent'
      }`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span className="flex items-center">
        <span className="mr-2">{icon}</span>
        <span>{name}</span>
      </span>
    </Button>
  );
};

export default SearchBar;
