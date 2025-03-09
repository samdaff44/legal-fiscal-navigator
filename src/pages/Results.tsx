
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ResultsDisplay from '@/components/ResultsDisplay';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Filter, Download, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AdvancedFilters, { SearchFilters } from '@/components/AdvancedFilters';
import { authController } from '@/controllers/authController';
import { useToast } from "@/components/ui/use-toast";

interface LocationState {
  query?: string;
}

/**
 * Page de résultats de recherche
 */
const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SearchFilters | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  
  useEffect(() => {
    // Vérifie si l'utilisateur est authentifié
    if (!authController.isAuthenticated()) {
      navigate('/');
      return;
    }
    
    // Récupère la requête depuis l'état de navigation
    const state = location.state as LocationState;
    
    if (!state || !state.query) {
      navigate('/dashboard');
      return;
    }
    
    setQuery(state.query);
  }, [location, navigate]);

  const handleApplyFilters = (filters: SearchFilters) => {
    setActiveFilters(filters);
    setIsFilterActive(true);
    setSortOrder(filters.sortOption);
    setFiltersOpen(false);
    
    toast({
      title: "Filtres appliqués",
      description: "Les résultats ont été filtrés selon vos critères",
      duration: 3000,
    });
  };

  const handleExportResults = () => {
    toast({
      title: "Export en cours",
      description: "Vos résultats sont en cours d'exportation...",
      duration: 3000,
    });
    
    // Simuler un délai pour l'export
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "Vos résultats ont été exportés avec succès",
        duration: 3000,
      });
    }, 2000);
  };

  const handleLoadMore = () => {
    toast({
      title: "Chargement en cours",
      description: "Récupération des résultats supplémentaires...",
      duration: 1500,
    });
    
    // Simuler un délai pour le chargement
    setTimeout(() => {
      toast({
        title: "Résultats chargés",
        description: "De nouveaux résultats ont été ajoutés",
        duration: 1500,
      });
    }, 1500);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    
    // Si des filtres sont actifs, mettre à jour l'option de tri
    if (activeFilters) {
      setActiveFilters({
        ...activeFilters,
        sortOption: value
      });
    }
    
    toast({
      title: "Tri modifié",
      description: `Les résultats sont maintenant triés par ${getTriLabel(value)}`,
      duration: 2000,
    });
  };

  const getTriLabel = (value: string): string => {
    switch (value) {
      case 'relevance': return 'pertinence';
      case 'date-desc': return 'date (récent)';
      case 'date-asc': return 'date (ancien)';
      case 'citations': return 'nombre de citations';
      case 'source': return 'source';
      default: return value;
    }
  };

  if (!query) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 px-4 md:px-8">
        <div className="container mx-auto py-6">
          <div className="mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            
            <div className="mb-8">
              <SearchBar />
            </div>
            
            <div className="mt-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-2xl font-semibold">
                  Résultats pour: <span className="text-primary font-normal">"{query}"</span>
                </h1>
                
                <div className="flex flex-wrap gap-3">
                  <Select value={sortOrder} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="date-desc">Date (récent)</SelectItem>
                      <SelectItem value="date-asc">Date (ancien)</SelectItem>
                      <SelectItem value="source">Source</SelectItem>
                      <SelectItem value="citations">Citations</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant={isFilterActive ? "default" : "outline"} 
                        className={`flex items-center gap-2 ${isFilterActive ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        <Filter className="h-4 w-4" />
                        <span>Filtres {isFilterActive ? "(actifs)" : ""}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <AdvancedFilters 
                        onApplyFilters={handleApplyFilters}
                        initialFilters={activeFilters || undefined}
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleExportResults}
                  >
                    <Download className="h-4 w-4" />
                    <span>Exporter</span>
                  </Button>
                </div>
              </div>
              
              <ResultsDisplay query={query} filters={activeFilters || undefined} sortOrder={sortOrder} />
              
              <div className="mt-8 flex justify-center">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleLoadMore}
                >
                  <ChevronDown className="h-4 w-4" />
                  <span>Charger plus de résultats</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-secondary/50 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2023 LegalFiscal Navigator. Tous droits réservés.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Résultats compilés de vos bases de données juridiques
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Results;
