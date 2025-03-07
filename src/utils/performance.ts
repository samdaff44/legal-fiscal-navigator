
/**
 * Utilitaires d'optimisation des performances
 */

/**
 * Cache simple en mémoire avec expiration
 */
class MemoryCache {
  private cache: Record<string, { value: any; expiry: number }> = {};

  /**
   * Ajoute ou met à jour une valeur dans le cache
   * @param {string} key - Clé du cache
   * @param {any} value - Valeur à stocker
   * @param {number} ttl - Durée de vie en millisecondes
   */
  set(key: string, value: any, ttl: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttl;
    this.cache[key] = { value, expiry };
  }

  /**
   * Récupère une valeur du cache
   * @param {string} key - Clé du cache
   * @returns {any|null} La valeur ou null si non trouvée/expirée
   */
  get(key: string): any | null {
    const item = this.cache[key];
    
    // Vérifie si l'élément existe et n'est pas expiré
    if (item && item.expiry > Date.now()) {
      return item.value;
    }
    
    // Supprime l'élément expiré
    if (item) {
      delete this.cache[key];
    }
    
    return null;
  }

  /**
   * Supprime une entrée du cache
   * @param {string} key - Clé à supprimer
   */
  remove(key: string): void {
    delete this.cache[key];
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    this.cache = {};
  }

  /**
   * Nettoie les entrées expirées du cache
   */
  cleanup(): void {
    const now = Date.now();
    
    Object.keys(this.cache).forEach(key => {
      if (this.cache[key].expiry <= now) {
        delete this.cache[key];
      }
    });
  }
}

// Export une instance singleton du cache
export const memoryCache = new MemoryCache();

/**
 * Mesure le temps d'exécution d'une fonction
 * @param {Function} fn - Fonction à exécuter
 * @param {any[]} args - Arguments de la fonction
 * @returns {Promise<any>} Résultat de la fonction
 */
export const measurePerformance = async <T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> => {
  const startTime = performance.now();
  
  try {
    const result = await fn(...args);
    const endTime = performance.now();
    console.log(`Temps d'exécution: ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`Erreur après ${(endTime - startTime).toFixed(2)}ms:`, error);
    throw error;
  }
};

/**
 * Debounce une fonction
 * @param {Function} fn - Fonction à debouncer
 * @param {number} delay - Délai en millisecondes
 * @returns {Function} Fonction debouncée
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};

// Cache périodiquement nettoyé
setInterval(() => {
  memoryCache.cleanup();
}, 5 * 60 * 1000); // Nettoyage toutes les 5 minutes
