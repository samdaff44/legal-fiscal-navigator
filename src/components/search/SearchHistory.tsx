
import { Search, X } from 'lucide-react';
import { SearchHistory as SearchHistoryType } from '@/models/SearchResult';

interface SearchHistoryProps {
  searchHistory: SearchHistoryType[];
  selectHistoryItem: (item: string) => void;
  clearSearchHistory: () => void;
  show: boolean;
}

const SearchHistory = ({ searchHistory, selectHistoryItem, clearSearchHistory, show }: SearchHistoryProps) => {
  if (!show || searchHistory.length === 0) return null;
  
  return (
    <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-md animate-fade-in">
      <div className="p-2 border-b">
        <h3 className="text-sm font-medium text-muted-foreground">Recherches récentes</h3>
      </div>
      <ul>
        {searchHistory.map((item, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => selectHistoryItem(item.query)}
              className="w-full px-4 py-2 text-left flex items-center hover:bg-accent transition-colors"
            >
              <Search className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="flex-grow truncate">{item.query}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="p-2 border-t">
        <button
          type="button"
          onClick={clearSearchHistory}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Effacer l'historique
        </button>
      </div>
    </div>
  );
};

export default SearchHistory;
