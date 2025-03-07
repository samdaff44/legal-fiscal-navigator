
/**
 * Utilitaires de sécurité pour l'application
 */

/**
 * Vérifie si une chaîne contient des caractères potentiellement dangereux
 * @param {string} input - La chaîne à vérifier
 * @returns {boolean} True si la chaîne est sécuritaire
 */
export const isInputSafe = (input: string): boolean => {
  // Vérifie si l'entrée contient des caractères suspects (XSS protection simple)
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+=/gi,
    /data:/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};

/**
 * Échappe les caractères HTML dangereux dans une chaîne
 * @param {string} unsafe - La chaîne non sécurisée
 * @returns {string} La chaîne échappée
 */
export const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * "Chiffre" des données en utilisant Base64 (très basique, à titre d'exemple)
 * Note: Ceci n'est PAS un vrai chiffrement sécurisé!
 * @param {string} data - Les données à chiffrer
 * @returns {string} Les données chiffrées
 */
export const encryptData = (data: string): string => {
  // En production, utilisez une vraie librairie de chiffrement comme CryptoJS
  return btoa(data);
};

/**
 * "Déchiffre" des données encodées en Base64 (très basique, à titre d'exemple)
 * @param {string} encryptedData - Les données chiffrées
 * @returns {string} Les données en clair
 */
export const decryptData = (encryptedData: string): string => {
  try {
    // En production, utilisez une vraie librairie de chiffrement
    return atob(encryptedData);
  } catch (error) {
    console.error("Erreur de déchiffrement:", error);
    return "";
  }
};

/**
 * Rate limiter simple pour les appels d'API
 */
export class RateLimiter {
  private requestTimes: Record<string, number[]> = {};
  private maxRequests: number;
  private timeWindow: number;

  /**
   * @param {number} maxRequests - Nombre maximum de requêtes autorisées
   * @param {number} timeWindow - Fenêtre de temps en millisecondes
   */
  constructor(maxRequests: number = 10, timeWindow: number = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
  }

  /**
   * Vérifie si une action est autorisée pour une clé donnée
   * @param {string} key - Clé identifiant l'action (ex: 'search')
   * @returns {boolean} True si l'action est autorisée
   */
  isActionAllowed(key: string): boolean {
    const now = Date.now();
    
    if (!this.requestTimes[key]) {
      this.requestTimes[key] = [];
    }
    
    // Supprime les requêtes plus anciennes que la fenêtre de temps
    this.requestTimes[key] = this.requestTimes[key].filter(
      time => time > now - this.timeWindow
    );
    
    // Vérifie si le nombre de requêtes est inférieur à la limite
    if (this.requestTimes[key].length < this.maxRequests) {
      this.requestTimes[key].push(now);
      return true;
    }
    
    return false;
  }
  
  /**
   * Temps restant avant la prochaine requête autorisée
   * @param {string} key - Clé identifiant l'action
   * @returns {number} Temps en millisecondes
   */
  getTimeToWait(key: string): number {
    if (!this.requestTimes[key] || this.requestTimes[key].length < this.maxRequests) {
      return 0;
    }
    
    const oldestRequest = Math.min(...this.requestTimes[key]);
    return oldestRequest + this.timeWindow - Date.now();
  }
}

// Export une instance singleton du rate limiter
export const rateLimiter = new RateLimiter();
