
/**
 * Modèle représentant une base de données avec ses informations de connexion
 */
import { encrypt, decrypt } from '../utils/encryption';

export interface DatabaseCredentials {
  username: string;
  password: string;
  url: string;
}

export interface CredentialsStore {
  database1: DatabaseCredentials;
  database2: DatabaseCredentials;
  database3: DatabaseCredentials;
}

export const DATABASE_NAMES: Record<keyof CredentialsStore, string> = {
  database1: "Lexis Nexis",
  database2: "Dalloz",
  database3: "EFL Francis Lefebvre"
};

export const DATABASE_URLS: Record<keyof CredentialsStore, string> = {
  database1: "https://www.lexisnexis.fr",
  database2: "https://www.dalloz.fr",
  database3: "https://www.efl.fr"
};

/**
 * Vérifie si des identifiants sont présents en localStorage
 * @returns {CredentialsStore | null} Les identifiants stockés ou null
 */
export const getStoredCredentials = (): CredentialsStore | null => {
  const encryptedCredentials = localStorage.getItem('databaseCredentials');
  if (!encryptedCredentials) return null;
  
  try {
    const decryptedCredentials = decrypt(encryptedCredentials);
    return JSON.parse(decryptedCredentials);
  } catch (error) {
    console.error("Erreur lors de la lecture des identifiants:", error);
    return null;
  }
};

/**
 * Retourne la liste des bases de données accessibles (ayant des identifiants)
 * @returns {string[]} Liste des noms de bases de données accessibles
 */
export const getAccessibleDatabases = (): string[] => {
  const credentials = getStoredCredentials();
  if (!credentials) return [];
  
  const accessibleDatabases = [];
  
  if (credentials.database1.username && credentials.database1.password) {
    accessibleDatabases.push(DATABASE_NAMES.database1);
  }
  if (credentials.database2.username && credentials.database2.password) {
    accessibleDatabases.push(DATABASE_NAMES.database2);
  }
  if (credentials.database3.username && credentials.database3.password) {
    accessibleDatabases.push(DATABASE_NAMES.database3);
  }
  
  return accessibleDatabases;
};

/**
 * Sauvegarde les identifiants dans le localStorage de manière chiffrée
 * @param {CredentialsStore} credentials - Les identifiants à stocker
 */
export const saveCredentials = (credentials: CredentialsStore): void => {
  try {
    // Chiffrement des identifiants avant stockage
    const encryptedCredentials = encrypt(JSON.stringify(credentials));
    localStorage.setItem('databaseCredentials', encryptedCredentials);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des identifiants:", error);
    throw new Error("Impossible de sauvegarder les identifiants");
  }
};
