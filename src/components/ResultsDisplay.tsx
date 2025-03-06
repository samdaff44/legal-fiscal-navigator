import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, BookOpen, FileText, Database, Check, Copy, ExternalLink } from 'lucide-react';
import { searchAllDatabases, filterResults } from '@/services/searchService';

interface ResultItem {
  id: string;
  title: string;
  excerpt: string;
  source: 'Lexis Nexis' | 'Dalloz' | 'EFL Francis Lefebvre';
  type: 'jurisprudence' | 'doctrine' | 'legislation' | 'article';
  date: string;
  url: string;
  relevance: number;
}

interface ResultsDisplayProps {
  query: string;
}

const ResultsDisplay = ({ query }: ResultsDisplayProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        toast({
          title: "Recherche en cours",
          description: "Interrogation des trois bases de données...",
          duration: 3000,
        });
        
        const searchResults = await searchAllDatabases({ query });
        setResults(searchResults);
        
        toast({
          title: "Recherche terminée",
          description: `${searchResults.length} résultats trouvés sur les trois bases de données`,
          duration: 3000,
        });
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la recherche");
        
        toast({
          title: "Erreur de recherche",
          description: err instanceof Error ? err.message : "Une erreur est survenue lors de la recherche",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [query, toast]);

  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(result => result.source.toLowerCase().replace(/\s/g, '') === activeTab);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié",
      description: "Le texte a été copié dans le presse-papier",
      duration: 3000,
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedResult(expandedResult === id ? null : id);
  };

  const getIconForSource = (source: string) => {
    switch (source) {
      case 'Lexis Nexis':
        return <BookOpen className="h-4 w-4" />;
      case 'Dalloz':
        return <FileText className="h-4 w-4" />;
      case 'EFL Francis Lefebvre':
        return <Database className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'jurisprudence':
        return <span className="w-3 h-3 bg-blue-500 rounded-full mr-1" />;
      case 'doctrine':
        return <span className="w-3 h-3 bg-green-500 rounded-full mr-1" />;
      case 'legislation':
        return <span className="w-3 h-3 bg-red-500 rounded-full mr-1" />;
      case 'article':
        return <span className="w-3 h-3 bg-amber-500 rounded-full mr-1" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full max-w-3xl mb-4">
              <div className="h-40 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-6">Recherche en cours sur les trois bases de données...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="bg-destructive/10 p-6 rounded-lg max-w-xl mx-auto">
          <h3 className="text-lg font-medium text-destructive mb-2">Erreur de recherche</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-accent/30 p-6 rounded-lg max-w-xl mx-auto">
          <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
          <p className="text-muted-foreground">
            Aucun résultat ne correspond à votre recherche "{query}" dans les trois bases de données.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => window.history.back()}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">Tous ({results.length})</TabsTrigger>
          <TabsTrigger value="lexisnexis">Lexis Nexis ({results.filter(r => r.source === 'Lexis Nexis').length})</TabsTrigger>
          <TabsTrigger value="dalloz">Dalloz ({results.filter(r => r.source === 'Dalloz').length})</TabsTrigger>
          <TabsTrigger value="eflfrancislefebvre">EFL Francis Lefebvre ({results.filter(r => r.source === 'EFL Francis Lefebvre').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-4">
            {filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <ResultCard 
                  key={result.id}
                  result={result}
                  expanded={expandedResult === result.id}
                  onToggleExpand={() => toggleExpand(result.id)}
                  onCopy={handleCopy}
                  getIconForSource={getIconForSource}
                  getIconForType={getIconForType}
                />
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">Aucun résultat trouvé pour cette source</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ResultCardProps {
  result: ResultItem;
  expanded: boolean;
  onToggleExpand: () => void;
  onCopy: (text: string) => void;
  getIconForSource: (source: string) => React.ReactNode;
  getIconForType: (type: string) => React.ReactNode;
}

const ResultCard = ({ 
  result, 
  expanded, 
  onToggleExpand, 
  onCopy,
  getIconForSource,
  getIconForType
}: ResultCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 ${
        expanded ? 'shadow-md' : 'hover:shadow-sm'
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                {getIconForSource(result.source)}
                <span className="ml-1">{result.source}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                {getIconForType(result.type)}
                <span className="capitalize">{result.type}</span>
              </div>
              <span>•</span>
              <span>{new Date(result.date).toLocaleDateString('fr-FR')}</span>
            </div>
            <CardTitle 
              className="text-lg font-medium cursor-pointer hover:text-primary transition-colors"
              onClick={onToggleExpand}
            >
              {result.title}
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-accent/50">
            {result.relevance}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className={`text-muted-foreground ${expanded ? '' : 'line-clamp-2'}`}>
          {result.excerpt}
        </p>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t animate-fade-in">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Détails supplémentaires</h4>
                <p className="text-sm text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae neque ac eros pellentesque ultrices. 
                  Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
                  Suspendisse potenti. Etiam at nulla vitae turpis tempor mollis.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Référence:</span>{" "}
                  <span className="text-muted-foreground">REF-{result.id.toUpperCase()}</span>
                </div>
                <div>
                  <span className="font-medium">Juridiction:</span>{" "}
                  <span className="text-muted-foreground">France</span>
                </div>
                <div>
                  <span className="font-medium">Source:</span>{" "}
                  <span className="text-muted-foreground">{result.source}</span>
                </div>
                <div>
                  <span className="font-medium">Publié le:</span>{" "}
                  <span className="text-muted-foreground">{new Date(result.date).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-2">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onCopy(result.title + "\n\n" + result.excerpt)}
          >
            <Copy className="h-4 w-4 mr-1" />
            <span className="text-xs">Copier</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave}>
            {isSaved ? (
              <>
                <Check className="h-4 w-4 mr-1 text-green-500" />
                <span className="text-xs">Sauvegardé</span>
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="text-xs">Sauvegarder</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleExpand}
          >
            <span className="text-xs">{expanded ? 'Réduire' : 'Détails'}</span>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              <span className="text-xs">Ouvrir</span>
            </a>
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            <span className="text-xs">PDF</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResultsDisplay;
