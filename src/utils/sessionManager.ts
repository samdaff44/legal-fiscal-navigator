
/**
 * Gestionnaire de session avec expiration automatique et rafraîchissement
 */

import { encrypt, decrypt } from './encryption';
import { toast } from '@/hooks/use-toast';

// Constantes pour la session
const DEFAULT_SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const SESSION_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
const INACTIVITY_CHECK_INTERVAL = 60 * 1000; // 1 minute

// Clés pour le localStorage
const SESSION_TIMEOUT_KEY = 'session_timeout';
const SESSION_EXPIRY_KEY = 'session_expiry';
const SESSION_ACTIVE_KEY = 'session_active';
const SESSION_LAST_ACTIVITY_KEY = 'session_last_activity';

// Variables pour les intervalles
let sessionCheckInterval: ReturnType<typeof setInterval> | null = null;
let autoRefreshInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Interface pour les options de session
 */
interface SessionOptions {
  timeout?: number; // Délai d'expiration en minutes
  autoRefresh?: boolean; // Activer le rafraîchissement automatique
  onExpire?: () => void; // Callback lors de l'expiration
  showToasts?: boolean; // Afficher des toasts lors d'événements importants
}

/**
 * Démarre une nouvelle session utilisateur
 * @param {SessionOptions} options - Options de configuration de la session
 */
export const startSession = (options: SessionOptions = {}): void => {
  // Paramètres par défaut
  const timeoutMinutes = options.timeout || 30;
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const autoRefresh = options.autoRefresh !== false;
  const showToasts = options.showToasts !== false;
  
  // Sauvegarde du délai et de la date d'expiration
  localStorage.setItem(SESSION_TIMEOUT_KEY, encrypt(timeoutMs.toString()));
  
  // Calcul et sauvegarde de la date d'expiration
  const expiryTime = Date.now() + timeoutMs;
  localStorage.setItem(SESSION_EXPIRY_KEY, encrypt(expiryTime.toString()));
  
  // Marque la session comme active et sauvegarde le timestamp de dernière activité
  localStorage.setItem(SESSION_ACTIVE_KEY, encrypt('true'));
  updateLastActivity();
  
  // Affichage d'un toast si demandé
  if (showToasts) {
    toast({
      title: "Session démarrée",
      description: `Votre session expirera après ${timeoutMinutes} minutes d'inactivité`,
      duration: 3000,
    });
  }
  
  // Configuration du refresh automatique de la session à chaque activité utilisateur
  setupActivityListeners();
  
  // Configuration du rafraîchissement automatique si activé
  if (autoRefresh) {
    setupAutoRefresh(options.onExpire, showToasts);
  }
};

/**
 * Configure les écouteurs d'événements pour rafraîchir la session
 */
const setupActivityListeners = (): void => {
  // Nettoyer les écouteurs existants
  cleanupActivityListeners();
  
  // Rafraîchit la session à chaque interaction utilisateur
  const refreshOnActivity = () => {
    updateLastActivity();
    refreshSession();
  };
  
  // Liste des événements à écouter
  const events = ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'];
  
  // Ajout des écouteurs d'événements
  events.forEach(event => {
    window.addEventListener(event, refreshOnActivity);
  });
  
  // Configuration d'une vérification périodique de la validité de la session
  sessionCheckInterval = setInterval(checkSession, INACTIVITY_CHECK_INTERVAL);
};

/**
 * Nettoie les écouteurs d'événements existants
 */
const cleanupActivityListeners = (): void => {
  const events = ['click', 'keypress', 'scroll', 'mousemove', 'touchstart'];
  
  events.forEach(event => {
    window.removeEventListener(event, () => {});
  });
  
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval);
  }
  
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }
};

/**
 * Met à jour le timestamp de dernière activité
 */
const updateLastActivity = (): void => {
  localStorage.setItem(SESSION_LAST_ACTIVITY_KEY, encrypt(Date.now().toString()));
};

/**
 * Rafraîchit la durée de la session actuelle
 * @returns {boolean} Vrai si la session a été rafraîchie, faux sinon
 */
export const refreshSession = (): boolean => {
  if (!isSessionActive()) return false;
  
  // Récupération du délai d'expiration actuel
  const timeoutEncrypted = localStorage.getItem(SESSION_TIMEOUT_KEY);
  if (!timeoutEncrypted) return false;
  
  const timeout = parseInt(decrypt(timeoutEncrypted), 10);
  
  // Mise à jour de la date d'expiration
  const expiryTime = Date.now() + timeout;
  localStorage.setItem(SESSION_EXPIRY_KEY, encrypt(expiryTime.toString()));
  
  return true;
};

/**
 * Configure le rafraîchissement automatique de la session
 */
const setupAutoRefresh = (onExpire?: () => void, showToasts = true): void => {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
  }
  
  autoRefreshInterval = setInterval(() => {
    // Vérifie si la session doit être rafraîchie
    if (shouldRefreshSession()) {
      const refreshed = refreshSession();
      
      if (refreshed && showToasts) {
        toast({
          title: "Session rafraîchie",
          description: "Votre session a été automatiquement prolongée",
          duration: 3000,
        });
      }
    } else {
      // Si trop de temps d'inactivité, vérifie si la session est expirée
      checkSession(onExpire);
    }
  }, SESSION_REFRESH_INTERVAL);
};

/**
 * Détermine si une session doit être rafraîchie automatiquement
 * @returns {boolean} Vrai si la session doit être rafraîchie
 */
const shouldRefreshSession = (): boolean => {
  // Vérifie si la session est active
  if (!isSessionActive()) return false;
  
  // Vérifie s'il y a eu une activité récente
  const lastActivityEncrypted = localStorage.getItem(SESSION_LAST_ACTIVITY_KEY);
  if (!lastActivityEncrypted) return false;
  
  const lastActivity = parseInt(decrypt(lastActivityEncrypted), 10);
  const inactivityTime = Date.now() - lastActivity;
  
  // Rafraîchit seulement s'il y a eu une activité dans les dernières minutes
  return inactivityTime < 10 * 60 * 1000; // 10 minutes
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
 * @param {Function} onExpire - Callback exécuté si la session est expirée
 */
const checkSession = (onExpire?: () => void): void => {
  if (!isSessionActive()) {
    // Déclenche un événement personnalisé pour la déconnexion
    window.dispatchEvent(new CustomEvent('sessionExpired'));
    
    // Exécute le callback si fourni
    if (onExpire) {
      onExpire();
    }
  }
};

/**
 * Termine la session utilisateur
 */
export const endSession = (): void => {
  localStorage.removeItem(SESSION_TIMEOUT_KEY);
  localStorage.removeItem(SESSION_EXPIRY_KEY);
  localStorage.removeItem(SESSION_ACTIVE_KEY);
  localStorage.removeItem(SESSION_LAST_ACTIVITY_KEY);
  
  // Nettoyage des intervalles
  cleanupActivityListeners();
};

/**
 * Met à jour le délai d'expiration de la session
 * @param {number} timeoutMinutes - Nouveau délai d'expiration en minutes
 * @param {boolean} showToasts - Afficher un toast de confirmation
 */
export const updateSessionTimeout = (timeoutMinutes: number, showToasts = true): void => {
  if (isSessionActive()) {
    startSession({ 
      timeout: timeoutMinutes,
      autoRefresh: autoRefreshInterval !== null,
      showToasts: showToasts
    });
  }
};

/**
 * Retourne les informations sur la session actuelle
 */
export const getSessionInfo = () => {
  if (!isSessionActive()) {
    return { active: false };
  }
  
  const expiryEncrypted = localStorage.getItem(SESSION_EXPIRY_KEY);
  const lastActivityEncrypted = localStorage.getItem(SESSION_LAST_ACTIVITY_KEY);
  
  if (!expiryEncrypted || !lastActivityEncrypted) {
    return { active: false };
  }
  
  const expiryTime = parseInt(decrypt(expiryEncrypted), 10);
  const lastActivity = parseInt(decrypt(lastActivityEncrypted), 10);
  
  return {
    active: true,
    expiresAt: new Date(expiryTime),
    lastActivity: new Date(lastActivity),
    remainingTime: Math.max(0, expiryTime - Date.now()),
    timeUntilAutoRefresh: autoRefreshInterval ? 
      SESSION_REFRESH_INTERVAL - ((Date.now() - lastActivity) % SESSION_REFRESH_INTERVAL) : null,
  };
};
