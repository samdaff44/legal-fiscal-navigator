
import { CredentialsStore } from '../../models/Database';

export interface CredentialVerificationResult {
  isValid: boolean;
  error?: string;
}

export interface LoginResult {
  connectedDatabases: string[];
}

export interface AuthOptions {
  headless?: boolean;
}

// Configuration pour la vérification des identifiants selon la base de données
export interface DatabaseLoginConfig {
  loginUrl: string;
  usernameSelector: string;
  passwordSelector: string;
  submitSelector: string;
  successSelector: string;
}

// Configurations de connexion pour chaque base de données
export const DATABASE_LOGIN_CONFIGS: Record<keyof CredentialsStore, DatabaseLoginConfig> = {
  database1: { // Lexis Nexis
    loginUrl: 'https://www.lexisnexis.fr/connexion',
    usernameSelector: '#username',
    passwordSelector: '#password',
    submitSelector: 'button[type="submit"]',
    successSelector: '.user-profile, .user-account'
  },
  database2: { // Dalloz
    loginUrl: 'https://www.dalloz.fr/connexion',
    usernameSelector: '#user_login',
    passwordSelector: '#user_pass',
    submitSelector: '#wp-submit',
    successSelector: '.logged-in, .user-menu'
  },
  database3: { // EFL Francis Lefebvre
    loginUrl: 'https://www.efl.fr/connexion',
    usernameSelector: '#username',
    passwordSelector: '#password',
    submitSelector: 'button.btn-login',
    successSelector: '.logged-in-user, .user-profile'
  }
};
