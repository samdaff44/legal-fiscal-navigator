
import React from 'react';
import { Button } from "@/components/ui/button";

interface LoadingStateProps {
  message?: string;
}

export const SearchLoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Recherche en cours sur les trois bases de données..." 
}) => {
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
      <p className="text-muted-foreground mt-6">{message}</p>
    </div>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export const SearchErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="py-12 text-center">
      <div className="bg-destructive/10 p-6 rounded-lg max-w-xl mx-auto">
        <h3 className="text-lg font-medium text-destructive mb-2">Erreur de recherche</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button className="mt-4" variant="outline" onClick={onRetry || (() => window.location.reload())}>
          Réessayer
        </Button>
      </div>
    </div>
  );
};

interface EmptyStateProps {
  query: string;
  onBack?: () => void;
}

export const SearchEmptyState: React.FC<EmptyStateProps> = ({ query, onBack }) => {
  return (
    <div className="py-12 text-center">
      <div className="bg-accent/30 p-6 rounded-lg max-w-xl mx-auto">
        <h3 className="text-lg font-medium mb-2">Aucun résultat trouvé</h3>
        <p className="text-muted-foreground">
          Aucun résultat ne correspond à votre recherche "{query}" dans les trois bases de données.
        </p>
        <Button className="mt-4" variant="outline" onClick={onBack || (() => window.history.back())}>
          Retour
        </Button>
      </div>
    </div>
  );
};
