
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import React from 'react';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  onFocus: () => void;
  clearQuery: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

const SearchInput = ({ 
  query, 
  setQuery, 
  isSearching, 
  onFocus, 
  clearQuery,
  searchInputRef 
}: SearchInputProps) => {
  return (
    <div className="relative flex-grow">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <Input
        ref={searchInputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        placeholder="Rechercher des articles, jurisprudence, textes de loi..."
        className="pl-10 pr-10 py-6 text-base shadow-soft"
        disabled={isSearching}
        aria-label="Champ de recherche"
      />
      
      {query && (
        <button
          type="button"
          onClick={clearQuery}
          className="absolute inset-y-0 right-2 flex items-center"
          aria-label="Effacer la recherche"
        >
          <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
