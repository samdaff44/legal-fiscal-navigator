
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Database, Book, FileClock, Clock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface RecentSearch {
  query: string;
  date: string;
  results: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasCredentials, setHasCredentials] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);

  useEffect(() => {
    // Check if we have credentials
    const credentials = localStorage.getItem('databaseCredentials');
    
    if (!credentials) {
      toast({
        title: "Identifiants manquants",
        description: "Veuillez d'abord configurer vos identifiants",
        variant: "destructive",
        duration: 5000,
      });
      navigate('/');
      return;
    }
    
    setHasCredentials(true);

    // Mock data for recent searches
    setRecentSearches([
      { query: "Fraude fiscale internationale", date: "2023-05-12", results: 42 },
      { query: "Optimisation fiscale et abus de droit", date: "2023-05-10", results: 37 },
      { query: "Contentieux fiscal procédure", date: "2023-05-08", results: 54 },
    ]);

    // Mock data for suggested queries
    setSuggestedQueries([
      "Déclaration fiscale obligations",
      "Jurisprudence TVA immobilier",
      "Contrôle fiscal droits",
      "Fiscalité internationale conventions"
    ]);
  }, [navigate, toast]);

  if (!hasCredentials) {
    return <div className="flex items-center justify-center h-screen">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col pt-20 px-4 md:px-8">
        <div className="container mx-auto py-8 md:py-12">
          <section className="mb-16 text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Recherchez dans vos bases juridiques et fiscales
            </h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-3xl mx-auto">
              Notre système recherche simultanément dans Lexis Nexis, Dalloz et EFL Francis Lefebvre
              pour vous fournir les résultats les plus pertinents.
            </p>
            
            <SearchBar />
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <section className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Recherches récentes</h2>
              </div>
              
              <div className="space-y-4">
                {recentSearches.map((search, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-between bg-card hover:bg-accent/50 transition-all duration-200"
                    onClick={() => navigate('/results', { state: { query: search.query } })}
                  >
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="font-normal">{search.query}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{search.results} résultats</span>
                      <span>•</span>
                      <span>{new Date(search.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </Button>
                ))}
                
                {recentSearches.length === 0 && (
                  <div className="bg-accent p-6 rounded-lg text-center">
                    <p className="text-muted-foreground">Aucune recherche récente</p>
                  </div>
                )}
              </div>
            </section>
            
            <section className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center gap-2 mb-4">
                <Book className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Suggestions</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {suggestedQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start hover:bg-accent/50 transition-all duration-200"
                    onClick={() => navigate('/results', { state: { query } })}
                  >
                    <FileClock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-normal text-sm">{query}</span>
                  </Button>
                ))}
              </div>
              
              <div className="bg-accent/30 rounded-lg p-6 mt-6">
                <h3 className="font-medium mb-2">Besoin d'aide pour votre recherche?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Utilisez des opérateurs booléens (ET, OU, SAUF) pour affiner vos résultats.
                  Placez des expressions entre guillemets pour une correspondance exacte.
                </p>
                <Button variant="link" className="text-primary p-0">
                  Voir plus d'astuces de recherche
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-secondary/50">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2023 LegalFiscal Navigator. Tous droits réservés.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Connecté à toutes vos bases de données
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
