
import { SearchResult } from '@/models/SearchResult';

/**
 * Utility functions for sorting search results
 */
export class SortUtils {
  /**
   * Trie les résultats par pertinence
   * @param {SearchResult[]} results - Résultats à trier
   * @returns {SearchResult[]} Résultats triés
   */
  static sortByRelevance(results: SearchResult[]): SearchResult[] {
    return [...results].sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Applique un tri spécifique aux résultats
   * @param {SearchResult[]} results - Résultats à trier
   * @param {string} sortOrder - Ordre de tri à appliquer
   * @returns {SearchResult[]} Résultats triés
   */
  static applySortOrder(results: SearchResult[], sortOrder: string): SearchResult[] {
    switch (sortOrder) {
      case 'date-desc':
        return [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date-asc':
        return [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'source':
        return [...results].sort((a, b) => a.source.localeCompare(b.source));
      case 'citations':
        return [...results].sort((a, b) => (b.citations || 0) - (a.citations || 0));
      default:
        return results;
    }
  }
}
