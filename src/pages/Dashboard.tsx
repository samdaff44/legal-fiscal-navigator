
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Book, FileClock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { getAccessibleDatabases } from '@/models/Database'; 
import { searchController } from '@/controllers/search';
import { authController } from '@/controllers/authController';
import { SearchHistory, DatabaseStatus } from '@/models/SearchResult';
import RecentSearches from '@/components/dashboard/RecentSearches';
import SuggestedSearches from '@/components/dashboard/SuggestedSearches';
import DatabaseStatusDisplay from '@/components/dashboard/DatabaseStatus';

/**
 * Page de tableau de bord
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
  const [databasesStatus, setDatabasesStatus] = useState<DatabaseStatus[]>([]);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    // Prevent multiple executions of the effect
    if (initialCheckDone) return;
    
    const runInitialChecks = () => {
      // Authentication check
      if (!authController.isAuthenticated()) {
        toast({
          title: "Identifiants manquants",
          description: "Veuillez d'abord configurer vos identifiants",
          variant: "destructive",
          duration: 5000,
        });
        navigate('/');
        return;
      }
  
      // Get accessible databases
      const accessibleDatabases = getAccessibleDatabases();
      
      // Set database status
      setDatabasesStatus(
        accessibleDatabases.map(name => ({
          name,
          status: "connected",
          lastChecked: new Date().toISOString()
        }))
      );
  
      // Set search history
      setRecentSearches(searchController.getSearchHistory());
  
      // Set suggested queries
      setSuggestedQueries([
        "Déclaration fiscale obligations",
        "Jurisprudence TVA immobilier",
        "Contrôle fiscal droits",
        "Fiscalité internationale conventions"
      ]);
    };
    
    // Use setTimeout to avoid triggering state updates during render
    setTimeout(runInitialChecks, 0);
    
    // Mark initial check as done, this prevents the effect from running again
    setInitialCheckDone(true);
  }, [initialCheckDone]); // Remove navigate and toast from dependencies

  /**
   * Lance une recherche à partir de l'historique
   */
  const handleHistorySearch = (query: string) => {
    navigate('/results', { state: { query } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow flex flex-col pt-24 px-4 md:px-8 pb-16">
        <div className="container mx-auto max-w-6xl">
          <section className="mb-12 text-center animate-fade-in">
            <h1 className="squarespace-heading text-3xl md:text-4xl font-light tracking-tight mb-6">
              Recherchez dans vos bases juridiques et fiscales
            </h1>
            <p className="text-muted-foreground text-lg mb-10 max-w-3xl mx-auto font-light leading-relaxed">
              Notre système recherche simultanément dans vos bases de données juridiques
              pour vous fournir les résultats les plus pertinents.
            </p>
            
            <DatabaseStatusDisplay databases={databasesStatus} />
            
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
              <RecentSearches 
                searches={recentSearches} 
                onSearchSelect={handleHistorySearch} 
              />
            </section>
            
            <section className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
              <SuggestedSearches 
                queries={suggestedQueries} 
                onQuerySelect={handleHistorySearch} 
              />
            </section>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border/20 py-8 bg-secondary/30">
        <div className="container max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4">
          <p className="text-center text-sm text-muted-foreground font-light">
            © 2023 Torbey Tax Navigator. Tous droits réservés.
          </p>
          <p className="text-center text-sm text-muted-foreground font-light">
            Connecté à toutes vos bases de données
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
