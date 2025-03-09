
import { SearchHistory } from '@/models/SearchResult';

/**
 * Utility functions for managing search history
 */
export class HistoryUtils {
  /**
   * Récupère l'historique des recherches
   * @returns {SearchHistory[]} Historique des recherches
   */
  static getSearchHistory(): SearchHistory[] {
    try {
      const savedHistory = localStorage.getItem('searchHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      return [];
    }
  }

  /**
   * Ajoute une recherche à l'historique
   * @param {string} query - Requête de recherche
   * @param {number} resultsCount - Nombre de résultats
   */
  static addToSearchHistory(query: string, resultsCount: number): void {
    try {
      const currentHistory = this.getSearchHistory();
      const newHistory = [
        { query: query.trim(), timestamp: Date.now(), results: resultsCount },
        ...currentHistory.filter(item => item.query !== query.trim()).slice(0, 4)
      ];
      
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error("Erreur lors de l'ajout à l'historique:", error);
    }
  }

  /**
   * Efface l'historique des recherches
   */
  static clearSearchHistory(): void {
    try {
      localStorage.removeItem('searchHistory');
    } catch (error) {
      console.error("Erreur lors de l'effacement de l'historique:", error);
    }
  }
}
