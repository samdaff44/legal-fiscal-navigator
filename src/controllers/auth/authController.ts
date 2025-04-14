
import { saveSecurely, getSecurely, removeSecurely } from '@/utils/secureStorage';
import { CredentialsStore } from '@/models/Database';
import { handleError } from '@/utils/errorHandling/errorHandlers';
import { ErrorType } from '@/utils/errorHandling/errorTypes';

class AuthController {
  private static CREDENTIALS_KEY = 'databaseCredentials';

  isAuthenticated(): boolean {
    try {
      const credentials = this.getStoredCredentials();
      return !!credentials && Object.values(credentials).some(
        db => db.username && db.password
      );
    } catch (error) {
      handleError(error, { type: ErrorType.AUTHENTICATION });
      return false;
    }
  }

  isAuthenticatedFor(dbKey: keyof CredentialsStore): boolean {
    try {
      const credentials = this.getStoredCredentials();
      if (!credentials) return false;
      return !!credentials[dbKey]?.username && !!credentials[dbKey]?.password;
    } catch (error) {
      handleError(error, { type: ErrorType.AUTHENTICATION });
      return false;
    }
  }

  private getStoredCredentials(): CredentialsStore | null {
    return getSecurely<CredentialsStore>(AuthController.CREDENTIALS_KEY);
  }

  async login(credentials: CredentialsStore): Promise<string[]> {
    try {
      const validDatabases = Object.keys(credentials).filter(
        db => credentials[db].username.trim() && credentials[db].password.trim()
      );

      if (validDatabases.length === 0) {
        throw new Error("Please provide credentials for at least one database");
      }

      saveSecurely(AuthController.CREDENTIALS_KEY, credentials);
      return validDatabases;
    } catch (error) {
      handleError(error, { 
        type: ErrorType.AUTHENTICATION, 
        showToast: true 
      });
      throw error;
    }
  }

  logout(): void {
    removeSecurely(AuthController.CREDENTIALS_KEY);
  }

  logoutFrom(dbKey: keyof CredentialsStore): boolean {
    try {
      const credentials = this.getStoredCredentials();
      if (!credentials) return false;
      
      // Check if user was authenticated for this database
      if (!this.isAuthenticatedFor(dbKey)) return false;
      
      // Clear credentials for the specific database
      credentials[dbKey] = {
        ...credentials[dbKey],
        username: '',
        password: ''
      };
      
      // Save the updated credentials
      saveSecurely(AuthController.CREDENTIALS_KEY, credentials);
      return true;
    } catch (error) {
      handleError(error, { type: ErrorType.AUTHENTICATION });
      return false;
    }
  }
}

export const authController = new AuthController();
