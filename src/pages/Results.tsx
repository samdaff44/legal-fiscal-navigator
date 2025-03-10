
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import ResultsDisplay from '@/components/ResultsDisplay';
import ResultsActions from '@/components/results/ResultsActions';
import ResultsHeader from '@/components/results/ResultsHeader';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SearchFilters } from '@/types/search';

interface LocationState {
  query?: string;
  databases?: string[];
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
  const [searchDatabases, setSearchDatabases] = useState<string[]>([]);
  
  useEffect(() => {
    // Récupère la requête depuis l'état de navigation
    const state = location.state as LocationState;
    
    if (!state || !state.query) {
      navigate('/dashboard');
      return;
    }
    
    setQuery(state.query);
    if (state.databases) {
      setSearchDatabases(state.databases);
    }
  }, [location, navigate]);

  // Create default filters with required properties
  const createDefaultFilters = (): SearchFilters => {
    return {
      documentTypes: [],
      dateRange: {},
      author: "",
      publicationYears: [2000, 2023],
      categories: [],
      languages: [],
      relevanceThreshold: 70,
      citationsThreshold: 0,
      sortOption: 'relevance',
      maxResults: 50
    };
  };

  const handleApplyFilters = (filters: SearchFilters) => {
    setActiveFilters(filters);
    setIsFilterActive(true);
    setSortOrder(filters.sortOption || 'relevance');
    setFiltersOpen(false);
    
    toast({
      title: "Filtres appliqués",
      description: "Les résultats ont été filtrés selon vos critères",
      duration: 3000,
    });
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

  if (!query) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 px-4 md:px-8">
        <div className="container mx-auto py-6">
          <div className="mb-8 animate-fade-in">
            <ResultsHeader 
              query={query} 
              navigateToDashboard={() => navigate('/dashboard')}
            />
            
            <div className="mb-8">
              <SearchBar />
            </div>
            
            <div className="mt-8">
              <ResultsActions 
                query={query}
                sortOrder={sortOrder}
                handleSortChange={handleSortChange}
                isFilterActive={isFilterActive}
                filtersOpen={filtersOpen}
                setFiltersOpen={setFiltersOpen}
                activeFilters={activeFilters ? activeFilters : createDefaultFilters()}
                handleApplyFilters={handleApplyFilters}
                handleExportResults={handleExportResults}
              />
              
              <ResultsDisplay 
                query={query} 
                filters={activeFilters || undefined} 
                sortOrder={sortOrder} 
              />
              
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
            © 2023 Torbey Tax Navigator. Tous droits réservés.
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
