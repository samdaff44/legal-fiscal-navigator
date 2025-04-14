
import { encrypt, decrypt } from './encryption';

export const saveSecurely = (key: string, data: any) => {
  try {
    const encryptedData = encrypt(JSON.stringify(data));
    localStorage.setItem(key, encryptedData);
  } catch (error) {
    console.error('Error saving secure data:', error);
  }
};

export const getSecurely = <T>(key: string): T | null => {
  try {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;
    
    const decryptedData = decrypt(encryptedData);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Error retrieving secure data:', error);
    return null;
  }
};

export const removeSecurely = (key: string) => {
  localStorage.removeItem(key);
};
