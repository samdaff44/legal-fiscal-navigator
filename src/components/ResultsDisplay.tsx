
import React from 'react';
import { ResultsDisplayProps } from '@/types/search';
import { useSearchResults } from '@/hooks/useSearchResults';
import { SearchLoadingState, SearchErrorState, SearchEmptyState } from './SearchLoadingState';
import SearchResultsTabs from './SearchResultsTabs';

const ResultsDisplay = ({ query }: ResultsDisplayProps) => {
  const {
    results,
    isLoading,
    error,
    expandedResult,
    toggleExpand,
    handleCopy
  } = useSearchResults({ query });

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
