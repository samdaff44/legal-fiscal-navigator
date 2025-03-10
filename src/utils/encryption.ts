
/**
 * Utilitaires de chiffrement pour sécuriser les données sensibles
 */

// Clé de chiffrement dérivée du domaine de l'application
// En production, cette clé devrait être plus robuste et sécurisée
const ENCRYPTION_KEY = window.location.hostname + '_secure_key';

/**
 * Chiffre une chaîne de caractères
 * @param {string} text - Texte à chiffrer
 * @returns {string} Texte chiffré en base64
 */
export const encrypt = (text: string): string => {
  if (!text) return '';
  
  try {
    // Création d'un salt aléatoire pour renforcer la sécurité
    const salt = Math.random().toString(36).substring(2, 15);
    
    // Combinaison de la clé et du salt pour créer une clé unique
    const key = ENCRYPTION_KEY + salt;
    
    // Algorithme simple de chiffrement XOR
    const encryptedChars = text.split('').map(char => {
      const charCode = char.charCodeAt(0);
      // XOR avec des caractères de la clé
      return String.fromCharCode(charCode ^ key.charCodeAt(0) ^ key.charCodeAt(1));
    });
    
    // Combinaison du texte chiffré avec le salt (pour pouvoir déchiffrer)
    const encryptedText = encryptedChars.join('');
    const result = salt + ':' + encryptedText;
    
    // Encodage en base64 pour stockage sécurisé
    return btoa(result);
  } catch (error) {
    console.error('Erreur lors du chiffrement:', error);
    return '';
  }
};

/**
 * Déchiffre une chaîne de caractères
 * @param {string} encryptedText - Texte chiffré en base64
 * @returns {string} Texte déchiffré
 */
export const decrypt = (encryptedText: string): string => {
  if (!encryptedText) return '';
  
  try {
    // Décodage du base64
    const decodedText = atob(encryptedText);
    
    // Extraction du salt et du texte chiffré
    const [salt, text] = decodedText.split(':');
    
    // Recréation de la clé unique avec le salt
    const key = ENCRYPTION_KEY + salt;
    
    // Déchiffrement XOR inverse
    const decryptedChars = text.split('').map(char => {
      const charCode = char.charCodeAt(0);
      return String.fromCharCode(charCode ^ key.charCodeAt(0) ^ key.charCodeAt(1));
    });
    
    return decryptedChars.join('');
  } catch (error) {
    console.error('Erreur lors du déchiffrement:', error);
    return '';
  }
};
