
import { SearchResult, SearchFilter } from '@/models/SearchResult';

/**
 * Utility functions for filtering search results
 */
export class FilterUtils {
  /**
   * Filtre les résultats de recherche selon des critères
   * @param {SearchResult[]} results - Résultats à filtrer
   * @param {SearchFilter} filters - Critères de filtrage
   * @returns {SearchResult[]} Résultats filtrés
   */
  static filterResults(results: SearchResult[], filters: SearchFilter): SearchResult[] {
    return results.filter(result => {
      // Filtre par source
      if (filters.sources && filters.sources.length > 0) {
        if (!filters.sources.includes(result.source)) {
          return false;
        }
      }
      
      // Filtre par type
      if (filters.types && filters.types.length > 0) {
        if (!filters.types.includes(result.type)) {
          return false;
        }
      }
      
      // Filtre par plage de dates
      if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
        const resultDate = new Date(result.date);
        
        if (filters.dateRange.start && new Date(filters.dateRange.start) > resultDate) {
          return false;
        }
        
        if (filters.dateRange.end && new Date(filters.dateRange.end) < resultDate) {
          return false;
        }
      }
      
      // Filtre par juridiction
      if (filters.jurisdiction && result.jurisdiction !== filters.jurisdiction) {
        return false;
      }
      
      // Filtre par tribunal
      if (filters.court && result.court !== filters.court) {
        return false;
      }
      
      // Filtre par auteur
      if (filters.author && result.author !== filters.author) {
        return false;
      }
      
      // Filtre par année de publication
      if (filters.publicationYear && result.publicationYear !== filters.publicationYear) {
        return false;
      }
      
      // Filtre par catégorie
      if (filters.categories && filters.categories.length > 0) {
        if (!filters.categories.includes(result.category)) {
          return false;
        }
      }
      
      // Filtre par langue
      if (filters.languages && filters.languages.length > 0) {
        if (!filters.languages.includes(result.language)) {
          return false;
        }
      }
      
      // Filtre par pays
      if (filters.country && result.country !== filters.country) {
        return false;
      }
      
      // Filtre par pertinence minimale
      if (filters.relevanceThreshold && result.relevance < filters.relevanceThreshold) {
        return false;
      }
      
      // Filtre par nombre minimal de citations
      if (filters.minCitations && result.citations < filters.minCitations) {
        return false;
      }
      
      return true;
    });
  }
}
