
/**
 * Utilitaires pour la gestion des erreurs de manière consistante dans l'application
 */

import { toast } from '@/hooks/use-toast';

// Types d'erreurs connus
export enum ErrorType {
  AUTHENTICATION = 'authentication',
  NETWORK = 'network',
  API = 'api',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  UNKNOWN = 'unknown'
}

// Interface pour les options de gestion d'erreur
interface ErrorHandlingOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  logToService?: boolean;
  throwError?: boolean;
  onError?: (error: AppError) => void;
}

// Options par défaut
const defaultOptions: ErrorHandlingOptions = {
  showToast: true,
  logToConsole: true,
  logToService: false,
  throwError: false
};

// Classe d'erreur personnalisée
export class AppError extends Error {
  type: ErrorType;
  originalError?: Error | unknown;
  context?: Record<string, unknown>;
  
  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    originalError?: Error | unknown,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.context = context;
  }
  
  // Obtenir les détails pour journalisation
  getLogDetails() {
    return {
      type: this.type,
      message: this.message,
      stack: this.stack,
      originalError: this.originalError instanceof Error ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : this.originalError,
      context: this.context
    };
  }
}

/**
 * Gère une erreur de manière consistante
 * @param error - L'erreur à gérer
 * @param options - Options de gestion d'erreur
 * @returns - L'erreur convertie en AppError
 */
export const handleError = (
  error: Error | unknown,
  options: ErrorHandlingOptions = {}
): AppError => {
  const opts = { ...defaultOptions, ...options };
  
  // Convertit l'erreur en AppError si nécessaire
  const appError = error instanceof AppError 
    ? error 
    : new AppError(
        error instanceof Error ? error.message : 'Une erreur est survenue',
        ErrorType.UNKNOWN,
        error
      );
  
  // Affiche un toast si demandé
  if (opts.showToast) {
    showErrorToast(appError);
  }
  
  // Journalise dans la console si demandé
  if (opts.logToConsole) {
    console.error('[AppError]', appError.getLogDetails());
  }
  
  // Journalise dans un service si demandé
  if (opts.logToService) {
    logErrorToService(appError);
  }
  
  // Exécute le callback onError si fourni
  if (opts.onError) {
    opts.onError(appError);
  }
  
  // Propage l'erreur si demandé
  if (opts.throwError) {
    throw appError;
  }
  
  return appError;
};

/**
 * Affiche un toast d'erreur adapté au type d'erreur
 * @param error - L'erreur à afficher
 */
const showErrorToast = (error: AppError): void => {
  const toastProps = {
    title: getTitleByErrorType(error.type),
    description: error.message,
    variant: "destructive" as const,
    duration: 5000,
  };
  
  toast(toastProps);
};

/**
 * Obtient un titre adapté au type d'erreur
 */
const getTitleByErrorType = (type: ErrorType): string => {
  switch (type) {
    case ErrorType.AUTHENTICATION:
      return 'Erreur d\'authentification';
    case ErrorType.NETWORK:
      return 'Erreur réseau';
    case ErrorType.API:
      return 'Erreur d\'API';
    case ErrorType.VALIDATION:
      return 'Erreur de validation';
    case ErrorType.PERMISSION:
      return 'Erreur de permission';
    default:
      return 'Erreur';
  }
};

/**
 * Journalise une erreur dans un service externe
 * @param error - L'erreur à journaliser
 */
const logErrorToService = (error: AppError): void => {
  // Implémentation fictive pour un service de journalisation
  // En production, utilisez un service comme Sentry, LogRocket, etc.
  console.log('[ErrorLoggingService]', error.getLogDetails());
  
  // Exemple d'implémentation avec fetch:
  /*
  fetch('/api/log-error', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(error.getLogDetails())
  }).catch(e => console.error('Failed to log error to service:', e));
  */
};

/**
 * Crée une erreur d'authentification
 */
export const createAuthError = (message: string, context?: Record<string, unknown>): AppError => {
  return new AppError(message, ErrorType.AUTHENTICATION, undefined, context);
};

/**
 * Crée une erreur réseau
 */
export const createNetworkError = (message: string, originalError?: Error): AppError => {
  return new AppError(message, ErrorType.NETWORK, originalError);
};

/**
 * Crée une erreur API
 */
export const createApiError = (message: string, originalError?: Error, context?: Record<string, unknown>): AppError => {
  return new AppError(message, ErrorType.API, originalError, context);
};

/**
 * Crée une erreur de validation
 */
export const createValidationError = (message: string, context?: Record<string, unknown>): AppError => {
  return new AppError(message, ErrorType.VALIDATION, undefined, context);
};

/**
 * Wrapper de fonction qui attrape les erreurs et les gère
 * @param fn - Fonction à exécuter
 * @param errorMessage - Message d'erreur par défaut
 * @param options - Options de gestion d'erreur
 */
export const withErrorHandling = <T, Args extends any[]>(
  fn: (...args: Args) => T,
  errorMessage: string = 'Une erreur est survenue',
  options: ErrorHandlingOptions = {}
): ((...args: Args) => T) => {
  return (...args: Args): T => {
    try {
      const result = fn(...args);
      
      // Gestion des Promises
      if (result instanceof Promise) {
        return result.catch(error => {
          handleError(error, {
            ...options,
            throwError: false
          });
          throw error;
        }) as unknown as T;
      }
      
      return result;
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error(errorMessage),
        options
      );
      throw error;
    }
  };
};
