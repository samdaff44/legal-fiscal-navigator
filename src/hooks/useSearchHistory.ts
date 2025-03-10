
import { useState, useEffect } from 'react';
import { SearchHistory } from '@/models/SearchResult';
import { searchController } from '@/controllers/search';

/**
 * Hook personnalisé pour gérer l'historique de recherche
 * @returns {Object} État et fonctions pour gérer l'historique de recherche
 */
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  useEffect(() => {
    // Récupération de l'historique des recherches
    setSearchHistory(searchController.getSearchHistory());
  }, []);

  /**
   * Sélectionne un élément de l'historique
   */
  const selectHistoryItem = (item: string, callback?: () => void) => {
    if (callback) {
      callback();
    }
    setShowSearchHistory(false);
  };

  /**
   * Efface l'historique des recherches
   */
  const clearSearchHistory = () => {
    searchController.clearSearchHistory();
    setSearchHistory([]);
    setShowSearchHistory(false);
  };

  /**
   * Affiche ou masque l'historique des recherches
   */
  const toggleSearchHistory = (show: boolean) => {
    setShowSearchHistory(show);
  };

  return {
    searchHistory,
    showSearchHistory,
    selectHistoryItem,
    clearSearchHistory,
    toggleSearchHistory
  };
};
