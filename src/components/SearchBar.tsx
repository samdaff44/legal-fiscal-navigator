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

interface SearchHistory {
  query: string;
  timestamp: number;
}

const SearchBar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
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

    setIsSearching(true);

    const newHistory = [
      { query: query.trim(), timestamp: Date.now() },
      ...searchHistory.filter(item => item.query !== query.trim()).slice(0, 4)
    ];
    
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    setTimeout(() => {
      setIsSearching(false);
      navigate('/results', { state: { query } });
    }, 1000);
  };

  const selectHistoryItem = (item: string) => {
    setQuery(item);
    setShowSearchHistory(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

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
            />
            
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="absolute inset-y-0 right-2 flex items-center"
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
              onClick={() => {
                setSearchHistory([]);
                localStorage.removeItem('searchHistory');
                setShowSearchHistory(false);
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Effacer l'historique
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center mt-6 gap-3">
        <DatabaseButton icon={<Database />} name="Toutes les bases" />
        <DatabaseButton icon={<BookOpen />} name="Lexis Nexis" />
        <DatabaseButton icon={<FileText />} name="Dalloz" />
        <DatabaseButton icon={<Database />} name="EFL Francis Lefebvre" />
      </div>
    </div>
  );
};

const DatabaseButton = ({ icon, name }: { icon: React.ReactNode; name: string }) => {
  const [active, setActive] = useState(name === "Toutes les bases");
  
  return (
    <Button
      variant={active ? "default" : "outline"}
      className={`rounded-full transition-all duration-300 ${
        active 
          ? 'bg-primary text-primary-foreground shadow-md' 
          : 'bg-background hover:bg-accent'
      }`}
      onClick={() => setActive(!active)}
    >
      <span className="flex items-center">
        <span className="mr-2">{icon}</span>
        <span>{name}</span>
      </span>
    </Button>
  );
};

export default SearchBar;
