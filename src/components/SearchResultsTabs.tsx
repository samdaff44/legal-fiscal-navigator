
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ResultItem } from '@/types/search';
import TabTriggers from './search/TabTriggers';
import ResultsList from './search/ResultsList';

interface SearchResultsTabsProps {
  results: ResultItem[];
  expandedResult: string | null;
  onToggleExpand: (id: string) => void;
  onCopy: (text: string) => void;
}

const SearchResultsTabs: React.FC<SearchResultsTabsProps> = ({
  results,
  expandedResult,
  onToggleExpand,
  onCopy
}) => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(result => result.source.toLowerCase().replace(/\s/g, '') === activeTab);

  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabTriggers results={results} />

      <TabsContent value={activeTab} className="mt-0">
        <ResultsList 
          results={filteredResults}
          expandedResult={expandedResult}
          onToggleExpand={onToggleExpand}
          onCopy={onCopy}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SearchResultsTabs;
