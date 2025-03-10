
/**
 * Gestionnaire de session avec expiration automatique
 */

import { encrypt, decrypt } from './encryption';

// Constante pour la durée de session par défaut (30 minutes en millisecondes)
const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000;

// Clés pour le localStorage
const SESSION_TIMEOUT_KEY = 'session_timeout';
const SESSION_EXPIRY_KEY = 'session_expiry';
const SESSION_ACTIVE_KEY = 'session_active';

/**
 * Interface pour les options de session
 */
interface SessionOptions {
  timeout?: number; // Délai d'expiration en minutes
}

/**
 * Démarre une nouvelle session utilisateur
 * @param {SessionOptions} options - Options de configuration de la session
 */
export const startSession = (options: SessionOptions = {}): void => {
  // Calcul du délai d'expiration (par défaut ou spécifié)
  const timeoutMinutes = options.timeout || 30;
  const timeoutMs = timeoutMinutes * 60 * 1000;
  
  // Sauvegarde du délai et de la date d'expiration
  localStorage.setItem(SESSION_TIMEOUT_KEY, encrypt(timeoutMs.toString()));
  
  // Calcul et sauvegarde de la date d'expiration
  const expiryTime = Date.now() + timeoutMs;
  localStorage.setItem(SESSION_EXPIRY_KEY, encrypt(expiryTime.toString()));
  
  // Marque la session comme active
  localStorage.setItem(SESSION_ACTIVE_KEY, encrypt('true'));
  
  // Configuration du refresh automatique de la session à chaque activité utilisateur
  setupActivityListeners();
};

/**
 * Configure les écouteurs d'événements pour rafraîchir la session
 */
const setupActivityListeners = (): void => {
  // Rafraîchit la session à chaque interaction utilisateur
  const refreshOnActivity = () => refreshSession();
  
  // Ajout des écouteurs d'événements
  window.addEventListener('click', refreshOnActivity);
  window.addEventListener('keypress', refreshOnActivity);
  window.addEventListener('scroll', refreshOnActivity);
  window.addEventListener('mousemove', refreshOnActivity);
  
  // Configuration d'une vérification périodique de la validité de la session
  setInterval(checkSession, 60000); // Vérifie toutes les minutes
};

/**
 * Rafraîchit la durée de la session actuelle
 */
export const refreshSession = (): void => {
  if (!isSessionActive()) return;
  
  // Récupération du délai d'expiration actuel
  const timeoutEncrypted = localStorage.getItem(SESSION_TIMEOUT_KEY);
  if (!timeoutEncrypted) return;
  
  const timeout = parseInt(decrypt(timeoutEncrypted), 10);
  
  // Mise à jour de la date d'expiration
  const expiryTime = Date.now() + timeout;
  localStorage.setItem(SESSION_EXPIRY_KEY, encrypt(expiryTime.toString()));
};

/**
 * Vérifie si la session est toujours active
 * @returns {boolean} True si la session est active et non expirée
 */
export const isSessionActive = (): boolean => {
  // Vérification si la session est marquée comme active
  const sessionActiveEncrypted = localStorage.getItem(SESSION_ACTIVE_KEY);
  if (!sessionActiveEncrypted) return false;
  
  const sessionActive = decrypt(sessionActiveEncrypted) === 'true';
  if (!sessionActive) return false;
  
  // Vérification de l'expiration
  const expiryEncrypted = localStorage.getItem(SESSION_EXPIRY_KEY);
  if (!expiryEncrypted) return false;
  
  const expiryTime = parseInt(decrypt(expiryEncrypted), 10);
  
  // Si le temps d'expiration est dépassé, termine la session
  if (Date.now() > expiryTime) {
    endSession();
    return false;
  }
  
  return true;
};

/**
 * Vérifie périodiquement la validité de la session
 */
const checkSession = (): void => {
  if (!isSessionActive()) {
    // Déclenche un événement personnalisé pour la déconnexion
    window.dispatchEvent(new CustomEvent('sessionExpired'));
  }
};

/**
 * Termine la session utilisateur
 */
export const endSession = (): void => {
  localStorage.removeItem(SESSION_TIMEOUT_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
  localStorage.removeItem(SESSION_ACTIVE_KEY);
};

/**
 * Met à jour le délai d'expiration de la session
 * @param {number} timeoutMinutes - Nouveau délai d'expiration en minutes
 */
export const updateSessionTimeout = (timeoutMinutes: number): void => {
  if (isSessionActive()) {
    startSession({ timeout: timeoutMinutes });
  }
};
