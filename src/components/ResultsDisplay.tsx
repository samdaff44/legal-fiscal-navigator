
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, BookOpen, FileText, Database, Check, Copy, ExternalLink } from 'lucide-react';

interface ResultItem {
  id: string;
  title: string;
  excerpt: string;
  source: 'LexisNexis' | 'Westlaw' | 'DataFiscal';
  type: 'jurisprudence' | 'doctrine' | 'legislation' | 'article';
  date: string;
  url: string;
  relevance: number;
}

interface ResultsDisplayProps {
  query: string;
}

// Mock data generator
const generateMockResults = (query: string): ResultItem[] => {
  const sources = ['LexisNexis', 'Westlaw', 'DataFiscal'] as const;
  const types = ['jurisprudence', 'doctrine', 'legislation', 'article'] as const;
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `result-${i + 1}`,
    title: `${i % 3 === 0 ? 'Arrêt' : i % 3 === 1 ? 'Article sur' : 'Texte concernant'} ${query} ${i + 1}`,
    excerpt: `Ce document traite de "${query}" dans le contexte fiscal et juridique. Il aborde les questions essentielles concernant l'application des dispositions légales et les implications pratiques pour les professionnels.`,
    source: sources[i % sources.length],
    type: types[i % types.length],
    date: `${2010 + (i % 13)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
    url: `https://example.com/document/${i + 1}`,
    relevance: Math.round(95 - (i * 3.5))
  }));
};

const ResultsDisplay = ({ query }: ResultsDisplayProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [results] = useState<ResultItem[]>(generateMockResults(query));
  const [expandedResult, setExpandedResult] = useState<string | null>(null);

  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(result => result.source.toLowerCase() === activeTab);

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
      case 'LexisNexis':
        return <BookOpen className="h-4 w-4" />;
      case 'Westlaw':
        return <FileText className="h-4 w-4" />;
      case 'DataFiscal':
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

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="all">Tous ({results.length})</TabsTrigger>
          <TabsTrigger value="lexisnexis">LexisNexis ({results.filter(r => r.source === 'LexisNexis').length})</TabsTrigger>
          <TabsTrigger value="westlaw">Westlaw ({results.filter(r => r.source === 'Westlaw').length})</TabsTrigger>
          <TabsTrigger value="datafiscal">DataFiscal ({results.filter(r => r.source === 'DataFiscal').length})</TabsTrigger>
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
    // In a real app, you'd save this to user's saved items
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
