
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Search } from 'lucide-react';
import { SearchHistory } from '@/models/SearchResult';

interface RecentSearchesProps {
  searches: SearchHistory[];
  onSearchSelect: (query: string) => void;
}

const RecentSearches = ({ searches, onSearchSelect }: RecentSearchesProps) => {
  return (
    <Card className="squarespace-card border-border/20 bg-card/50 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-xl font-medium">Recherches récentes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {searches.length > 0 ? (
          searches.map((search, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-between bg-background hover:bg-accent/30 transition-all duration-200 h-auto py-3 px-4 border-border/30"
              onClick={() => onSearchSelect(search.query)}
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
  );
};

export default RecentSearches;
