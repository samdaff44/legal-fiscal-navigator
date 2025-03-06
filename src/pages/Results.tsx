
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
import AdvancedFilters from '@/components/AdvancedFilters';

interface LocationState {
  query?: string;
}

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('relevance');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  useEffect(() => {
    const state = location.state as LocationState;
    
    if (!state || !state.query) {
      navigate('/dashboard');
      return;
    }
    
    setQuery(state.query);
  }, [location, navigate]);

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
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="date-desc">Date (récent)</SelectItem>
                      <SelectItem value="date-asc">Date (ancien)</SelectItem>
                      <SelectItem value="source">Source</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Filtres</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <AdvancedFilters />
                    </PopoverContent>
                  </Popover>
                  
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Exporter</span>
                  </Button>
                </div>
              </div>
              
              <ResultsDisplay query={query} />
              
              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="flex items-center gap-2">
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
            Résultats compilés de LexisNexis, Westlaw et DataFiscal
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Results;
