
/**
 * Tests unitaires pour l'authentification et la gestion des sessions
 */

import { authController } from '../controllers/authController';
import * as sessionManager from '../utils/sessionManager';
import '@types/jest';

// Mock pour localStorage
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

// Mock pour les fonctions de chiffrement
jest.mock('../utils/encryption', () => ({
  encrypt: (text: string) => `encrypted_${text}`,
  decrypt: (text: string) => text.replace('encrypted_', ''),
}));

// Mock pour sessionManager
jest.mock('../utils/sessionManager', () => ({
  startSession: jest.fn(),
  isSessionActive: jest.fn().mockReturnValue(true),
  endSession: jest.fn(),
}));

describe('Auth Controller', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  test('isAuthenticated devrait vérifier si des identifiants existent', () => {
    // Sans identifiants
    expect(authController.isAuthenticated()).toBe(false);
    
    // Avec des identifiants
    localStorage.setItem('databaseCredentials', 'encrypted_some_credentials');
    expect(authController.isAuthenticated()).toBe(true);
  });
  
  test('login devrait stocker les identifiants et démarrer une session', async () => {
    const mockCredentials = {
      database1: { username: 'user1', password: 'pass1', url: 'url1' },
      database2: { username: '', password: '', url: 'url2' },
      database3: { username: 'user3', password: 'pass3', url: 'url3' },
    };
    
    const result = await authController.login(mockCredentials);
    
    // Vérifie que les identifiants sont stockés
    expect(localStorage.getItem('databaseCredentials')).toBeTruthy();
    
    // Vérifie que la session est démarrée
    expect(sessionManager.startSession).toHaveBeenCalled();
    
    // Vérifie que seules les bases de données avec des identifiants sont retournées
    expect(result).toEqual(['database1', 'database3']);
  });
  
  test('logout devrait supprimer les identifiants et terminer la session', () => {
    // Prépare les données
    localStorage.setItem('databaseCredentials', 'encrypted_some_credentials');
    
    authController.logout();
    
    // Vérifie que les identifiants sont supprimés
    expect(localStorage.getItem('databaseCredentials')).toBeNull();
    
    // Vérifie que la session est terminée
    expect(sessionManager.endSession).toHaveBeenCalled();
  });
  
  // Modifions ce test pour éviter d'utiliser getCredentials qui n'existe pas
  test('les identifiants stockés devraient être accessibles', () => {
    // Prépare les données
    const mockCredentials = {
      database1: { username: 'user1', password: 'pass1', url: 'url1' }
    };
    localStorage.setItem('databaseCredentials', `encrypted_${JSON.stringify(mockCredentials)}`);
    
    // Vérifie en utilisant isAuthenticatedFor plutôt que getCredentials
    expect(authController.isAuthenticatedFor('database1')).toBe(true);
    expect(authController.isAuthenticatedFor('database2')).toBe(false);
  });
});
