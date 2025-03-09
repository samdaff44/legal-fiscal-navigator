
import { SearchOptions, SearchResult } from '@/models/SearchResult';
import { getAccessibleDatabases } from '@/models/Database';
import { searchAllSites, scrapingRateLimiter } from '@/services/scrapingService';
import { FilterUtils } from './filterUtils';
import { SortUtils } from './sortUtils';
import { HistoryUtils } from './historyUtils';

/**
 * Contrôleur pour les opérations de recherche
 */
class SearchController {
  /**
   * Effectue une recherche sur toutes les bases de données accessibles
   * @param {SearchOptions} options - Options de recherche
   * @returns {Promise<SearchResult[]>} Résultats de recherche
   * @throws {Error} Si aucune base de données n'est accessible ou si les limites de taux sont dépassées
   */
  async searchAllDatabases(options: SearchOptions): Promise<SearchResult[]> {
    // Vérifier l'accès aux bases de données
    const accessibleDatabases = this.validateDatabaseAccess();
    
    // Vérifier les limites de taux par requête
    this.checkRateLimits(options.query);
    
    try {
      // Utilisation du service de scraping pour obtenir les résultats
      console.log(`Recherche via scraping pour la requête: ${options.query}`);
      const searchResults = await searchAllSites(options.query);
      
      // Appliquer les filtres si nécessaire
      let filteredResults = searchResults;
      if (options.filters) {
        filteredResults = FilterUtils.filterResults(searchResults, options.filters);
      }
      
      // Trier les résultats selon l'option de tri fournie
      let sortedResults = SortUtils.sortByRelevance(filteredResults);
      
      // Tri supplémentaire basé sur l'option fournie
      if (options.sortOrder && options.sortOrder !== 'relevance') {
        sortedResults = SortUtils.applySortOrder(sortedResults, options.sortOrder);
      }
      
      // Ajouter la recherche à l'historique
      this.addToSearchHistory(options.query, sortedResults.length);
      
      return sortedResults;
    } catch (error) {
      this.handleSearchError(error);
    }
  }

  /**
   * Vérifie si des bases de données sont accessibles
   * @returns {string[]} Liste des bases de données accessibles
   * @throws {Error} Si aucune base de données n'est accessible
   */
  private validateDatabaseAccess(): string[] {
    const accessibleDatabases = getAccessibleDatabases();
    
    if (accessibleDatabases.length === 0) {
      throw new Error("Aucune base de données accessible. Veuillez fournir au moins un identifiant.");
    }

    return accessibleDatabases;
  }

  /**
   * Vérifie les limites de taux pour la requête
   * @param {string} query - Requête de recherche
   * @throws {Error} Si les limites de taux sont dépassées
   */
  private checkRateLimits(query: string): void {
    const rateLimitKey = query.toLowerCase().trim();
    if (!scrapingRateLimiter.isActionAllowed(rateLimitKey)) {
      const timeToWait = scrapingRateLimiter.getTimeToWait(rateLimitKey);
      throw new Error(`Trop de recherches. Veuillez réessayer dans ${Math.ceil(timeToWait / 1000)} secondes.`);
    }
  }

  /**
   * Gère les erreurs de recherche
   * @param {unknown} error - Erreur survenue
   * @throws {Error} Une erreur formatée
   */
  private handleSearchError(error: unknown): never {
    console.error("Erreur lors de la recherche:", error);
    throw new Error("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
  }

  /**
   * Expose FilterUtils.filterResults for backwards compatibility
   */
  filterResults(results: SearchResult[], filters: any): SearchResult[] {
    return FilterUtils.filterResults(results, filters);
  }

  /**
   * Expose HistoryUtils methods for backwards compatibility
   */
  getSearchHistory() {
    return HistoryUtils.getSearchHistory();
  }

  addToSearchHistory(query: string, resultsCount: number) {
    HistoryUtils.addToSearchHistory(query, resultsCount);
  }

  clearSearchHistory() {
    HistoryUtils.clearSearchHistory();
  }
}

// Export une instance unique (singleton) du contrôleur
export const searchController = new SearchController();
