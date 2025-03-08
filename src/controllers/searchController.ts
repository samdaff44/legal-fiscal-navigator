import { DATABASE_NAMES } from '../models/Database';
import { SearchOptions, SearchResult, SearchHistory } from '../models/SearchResult';
import { getAccessibleDatabases } from '../models/Database';
import { searchAllSites, scrapingRateLimiter } from '../services/scrapingService';

/**
 * Contrôleur pour les opérations de recherche
 */
class SearchController {
  /**
   * Effectue une recherche sur toutes les bases de données accessibles
   * @param {SearchOptions} options - Options de recherche
   * @returns {Promise<SearchResult[]>} Résultats de recherche
   * @throws {Error} Si aucune base de données n'est accessible
   */
  async searchAllDatabases(options: SearchOptions): Promise<SearchResult[]> {
    const accessibleDatabases = getAccessibleDatabases();
    
    if (accessibleDatabases.length === 0) {
      throw new Error("Aucune base de données accessible. Veuillez fournir au moins un identifiant.");
    }

    // Vérifier les limites de taux par requête
    const rateLimitKey = options.query.toLowerCase().trim();
    if (!scrapingRateLimiter.isActionAllowed(rateLimitKey)) {
      const timeToWait = scrapingRateLimiter.getTimeToWait(rateLimitKey);
      throw new Error(`Trop de recherches. Veuillez réessayer dans ${Math.ceil(timeToWait / 1000)} secondes.`);
    }

    try {
      // Utilisation du service de scraping pour obtenir les résultats
      console.log(`Recherche via scraping pour la requête: ${options.query}`);
      const searchResults = await searchAllSites(options.query);
      
      // Appliquer les filtres si nécessaire
      let filteredResults = searchResults;
      if (options.filters) {
        filteredResults = this.filterResults(searchResults, options.filters);
      }
      
      // Trier par pertinence
      const sortedResults = filteredResults.sort((a, b) => b.relevance - a.relevance);
      
      return sortedResults;
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      throw new Error("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
    }
  }

  /**
   * Filtre les résultats de recherche selon des critères
   * @param {SearchResult[]} results - Résultats à filtrer
   * @param {Object} filters - Critères de filtrage
   * @returns {SearchResult[]} Résultats filtrés
   */
  filterResults(results: SearchResult[], filters: any): SearchResult[] {
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

  /**
   * Récupère et gère l'historique des recherches
   * @returns {SearchHistory[]} Historique des recherches
   */
  getSearchHistory(): SearchHistory[] {
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
  addToSearchHistory(query: string, resultsCount: number): void {
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
  clearSearchHistory(): void {
    try {
      localStorage.removeItem('searchHistory');
    } catch (error) {
      console.error("Erreur lors de l'effacement de l'historique:", error);
    }
  }
}

// Export une instance unique (singleton) du contrôleur
export const searchController = new SearchController();
