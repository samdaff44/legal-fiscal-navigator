
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Database, Book, FileClock, Clock, CheckCircle, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { getAccessibleDatabases } from '@/models/Database'; 
import { searchController } from '@/controllers/searchController';
import { authController } from '@/controllers/authController';
import { SearchHistory, DatabaseStatus } from '@/models/SearchResult';

/**
 * Page de tableau de bord
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [recentSearches, setRecentSearches] = useState<SearchHistory[]>([]);
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
  const [databasesStatus, setDatabasesStatus] = useState<DatabaseStatus[]>([]);

  useEffect(() => {
    // Vérifie si l'utilisateur est authentifié
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

    // Récupère les bases de données accessibles
    const accessibleDatabases = getAccessibleDatabases();
    
    // Définit le statut des connexions aux bases de données
    setDatabasesStatus(
      accessibleDatabases.map(name => ({
        name,
        status: "connected",
        lastChecked: new Date().toISOString()
      }))
    );

    // Récupère l'historique des recherches
    setRecentSearches(searchController.getSearchHistory());

    // Suggestions de recherches (données fictives)
    setSuggestedQueries([
      "Déclaration fiscale obligations",
      "Jurisprudence TVA immobilier",
      "Contrôle fiscal droits",
      "Fiscalité internationale conventions"
    ]);
  }, [navigate, toast]);

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
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {databasesStatus.map((db, index) => (
                <div 
                  key={index}
                  className="bg-accent/30 rounded-full px-4 py-1.5 flex items-center text-sm"
                  aria-label={`Statut de connexion: ${db.name}`}
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  <span className="font-light">Connecté à {db.name}</span>
                </div>
              ))}
            </div>
            
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </section>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <section className="animate-slide-in" style={{ animationDelay: "0.1s" }}>
              <Card className="squarespace-card border-border/20 bg-card/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-xl font-medium">Recherches récentes</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {recentSearches.length > 0 ? (
                    recentSearches.map((search, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-between bg-background hover:bg-accent/30 transition-all duration-200 h-auto py-3 px-4 border-border/30"
                        onClick={() => handleHistorySearch(search.query)}
                      >
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="font-light">{search.query}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{search.results} résultats</span>
                          <span>•</span>
                          <span>{new Date(search.timestamp).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </Button>
                    ))
                  ) : (
                    <div className="bg-accent/20 p-6 rounded-lg text-center">
                      <p className="text-muted-foreground font-light">Aucune recherche récente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
            
            <section className="animate-slide-in" style={{ animationDelay: "0.2s" }}>
              <Card className="squarespace-card border-border/20 bg-card/50 overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-xl font-medium">Suggestions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    {suggestedQueries.map((query, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start hover:bg-accent/30 transition-all duration-200 border-border/30 h-auto py-3"
                        onClick={() => handleHistorySearch(query)}
                      >
                        <FileClock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-light text-sm">{query}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <div className="bg-accent/20 rounded-lg p-6 mt-4">
                    <h3 className="font-medium mb-2">Besoin d'aide pour votre recherche?</h3>
                    <p className="text-sm text-muted-foreground mb-4 font-light">
                      Utilisez des opérateurs booléens (ET, OU, SAUF) pour affiner vos résultats.
                      Placez des expressions entre guillemets pour une correspondance exacte.
                    </p>
                    <Button variant="link" className="text-primary p-0 font-light">
                      Voir plus d'astuces de recherche
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border/20 py-8 bg-secondary/30">
        <div className="container max-w-6xl mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4">
          <p className="text-center text-sm text-muted-foreground font-light">
            © 2023 LegalFiscal Navigator. Tous droits réservés.
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
