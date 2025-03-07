
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultItem } from '@/types/search';
import ResultCard from './ResultCard';

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
                onToggleExpand={() => onToggleExpand(result.id)}
                onCopy={onCopy}
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
  );
};

export default SearchResultsTabs;
