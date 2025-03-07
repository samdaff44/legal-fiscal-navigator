
/**
 * Tests unitaires pour le contrôleur de recherche
 * 
 * Note: Ces tests sont implémentés pour illustrer une bonne pratique,
 * mais ne seront pas exécutés dans cette démo.
 */

import { searchController } from '../controllers/searchController';
import { SearchResult } from '../models/SearchResult';

// Mocks pour localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('SearchController', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  
  test('searchAllDatabases should throw error when no databases are accessible', async () => {
    await expect(searchController.searchAllDatabases({ query: 'test' }))
      .rejects
      .toThrow('Aucune base de données accessible');
  });
  
  test('filterResults should filter by source correctly', () => {
    const mockResults: SearchResult[] = [
      { id: '1', title: 'Test 1', source: 'Lexis Nexis', type: 'jurisprudence', date: '2023-01-01', url: 'test.com', relevance: 90, excerpt: 'Test' },
      { id: '2', title: 'Test 2', source: 'Dalloz', type: 'doctrine', date: '2023-01-02', url: 'test.com', relevance: 85, excerpt: 'Test' },
    ];
    
    const filteredResults = searchController.filterResults(mockResults, {
      sources: ['Lexis Nexis']
    });
    
    expect(filteredResults.length).toBe(1);
    expect(filteredResults[0].source).toBe('Lexis Nexis');
  });
  
  test('searchHistory functions should work correctly', () => {
    // Test adding to history
    searchController.addToSearchHistory('test query', 5);
    const history = searchController.getSearchHistory();
    
    expect(history.length).toBe(1);
    expect(history[0].query).toBe('test query');
    expect(history[0].results).toBe(5);
    
    // Test clearing history
    searchController.clearSearchHistory();
    expect(searchController.getSearchHistory().length).toBe(0);
  });
});
