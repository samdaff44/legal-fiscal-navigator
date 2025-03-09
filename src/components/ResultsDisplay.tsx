
import React from 'react';
import { ResultsDisplayProps } from '@/types/search';
import { useSearchResults } from '@/hooks/useSearchResults';
import { SearchLoadingState, SearchErrorState, SearchEmptyState } from './SearchLoadingState';
import SearchResultsTabs from './SearchResultsTabs';
import { Database } from 'lucide-react';

/**
 * Composant d'affichage des résultats de recherche (Vue)
 * @param {ResultsDisplayProps} props - Propriétés du composant
 */
const ResultsDisplay = ({ query, filters, sortOrder }: ResultsDisplayProps) => {
  const {
    results,
    isLoading,
    error,
    expandedResult,
    toggleExpand,
    handleCopy,
    searchedDatabases
  } = useSearchResults({ query, filters, sortOrder });

  if (isLoading) {
    return <SearchLoadingState />;
  }

  if (error) {
    return <SearchErrorState error={error} />;
  }

  if (results.length === 0) {
    return <SearchEmptyState query={query} />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-start gap-2 text-sm text-muted-foreground mb-4">
        <Database className="h-4 w-4" />
        <span>
          Résultats de {searchedDatabases.length} base{searchedDatabases.length > 1 ? 's' : ''} de données: {searchedDatabases.join(', ')}
        </span>
      </div>
      
      <SearchResultsTabs 
        results={results}
        expandedResult={expandedResult}
        onToggleExpand={toggleExpand}
        onCopy={handleCopy}
      />
    </div>
  );
};

export default ResultsDisplay;
