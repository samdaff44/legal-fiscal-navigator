
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, FileClock } from 'lucide-react';

interface SuggestedSearchesProps {
  queries: string[];
  onQuerySelect: (query: string) => void;
}

const SuggestedSearches = ({ queries, onQuerySelect }: SuggestedSearchesProps) => {
  return (
    <Card className="squarespace-card border-border/20 bg-card/50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Book className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl font-medium">Suggestions</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {queries.map((query, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start hover:bg-accent/30 transition-all duration-200 border-border/30 h-auto py-3"
              onClick={() => onQuerySelect(query)}
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
  );
};

export default SuggestedSearches;
