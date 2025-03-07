
import { DATABASE_NAMES } from '../models/Database';
import { SearchOptions, SearchResult, SearchHistory } from '../models/SearchResult';
import { getAccessibleDatabases } from '../models/Database';

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

    try {
      // Recherche parallèle sur toutes les bases de données accessibles
      const searchPromises = accessibleDatabases.map(db => this.searchDatabase(db, options));
      const searchResults = await Promise.all(searchPromises);
      
      // Combine et trie par pertinence
      const allResults = searchResults.flat().sort((a, b) => b.relevance - a.relevance);
      
      return allResults;
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      throw new Error("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
    }
  }

  /**
   * Effectue une recherche sur une base de données spécifique
   * @param {string} database - Nom de la base de données
   * @param {SearchOptions} options - Options de recherche
   * @returns {Promise<SearchResult[]>} Résultats de recherche
   * @private
   */
  private async searchDatabase(
    database: string,
    options: SearchOptions
  ): Promise<SearchResult[]> {
    // Simulation de requête API vers chaque base de données
    console.log(`Recherche dans ${database} avec requête: ${options.query}`);
    
    // Cette implémentation est une simulation - en production, elle ferait des appels API réels
    return new Promise((resolve) => {
      setTimeout(() => {
        const results: SearchResult[] = [];
        
        // Génère des résultats fictifs par base de données
        const resultsCount = options.filters?.maxResults ? 
          Math.min(options.filters.maxResults, 30) : 15;
        
        for (let i = 0; i < resultsCount; i++) {
          // Données fictives diverses
          const types = ['jurisprudence', 'doctrine', 'legislation', 'article'];
          const typeIndex = i % 4;
          const jurisdictions = ['Cour de cassation', 'Conseil d\'État', 'Cour d\'appel', 'Tribunal administratif', 'Conseil constitutionnel'];
          const courts = ['Première chambre civile', 'Chambre commerciale', 'Chambre sociale', 'Chambre criminelle'];
          const authors = ['Dupont', 'Martin', 'Dubois', 'Lefebvre', 'Moreau'];
          const categories = ['Droit fiscal', 'Droit des sociétés', 'Droit du travail', 'Droit pénal', 'Droit administratif'];
          const languages = ['Français', 'Anglais'];
          const countries = ['France', 'Belgique', 'Luxembourg', 'Suisse'];
          
          results.push({
            id: `${database.toLowerCase().replace(/\s/g, '-')}-${i + 1}`,
            title: `${types[typeIndex] === 'jurisprudence' ? 'Arrêt' : 
                    types[typeIndex] === 'doctrine' ? 'Article sur' : 
                    types[typeIndex] === 'legislation' ? 'Texte concernant' : 
                    'Publication relative à'} ${options.query} - ${database}`,
            excerpt: `Ce document de ${database} traite de "${options.query}" dans le contexte fiscal et juridique. Il aborde les questions essentielles concernant l'application des dispositions légales.`,
            source: database as any,
            type: types[typeIndex] as any,
            date: `${2000 + (i % 23)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
            url: `https://example.com/${database.toLowerCase().replace(/\s/g, '')}/document/${i + 1}`,
            relevance: Math.round(98 - (i * 1.5)),
            jurisdiction: jurisdictions[i % jurisdictions.length],
            court: courts[i % courts.length],
            author: authors[i % authors.length],
            publicationYear: 2000 + (i % 23),
            category: categories[i % categories.length],
            language: languages[i % languages.length],
            country: countries[i % countries.length],
            citations: Math.floor(Math.random() * 100)
          });
        }
        
        resolve(results);
      }, 1000 + Math.random() * 1000); // Délai aléatoire pour simuler différents temps de réponse
    });
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
