
import { ResultItem } from '@/types/search';
import ResultCard from '../ResultCard';

interface ResultsListProps {
  results: ResultItem[];
  expandedResult: string | null;
  onToggleExpand: (id: string) => void;
  onCopy: (text: string) => void;
}

const ResultsList = ({ results, expandedResult, onToggleExpand, onCopy }: ResultsListProps) => {
  return (
    <div className="space-y-4">
      {results.length > 0 ? (
        results.map((result) => (
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
  );
};

export default ResultsList;
