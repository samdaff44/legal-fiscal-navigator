
import { useToast } from "@/hooks/use-toast";

/**
 * Copie le texte dans le presse-papier
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} - True si la copie a réussi
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Erreur lors de la copie dans le presse-papier:', error);
    return false;
  }
};

/**
 * Formate le texte pour l'export
 * @param {string} text - Texte à formater
 * @returns {string} - Texte formaté
 */
export const formatTextForExport = (text: string): string => {
  // Nettoyage du texte pour l'export
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n');
};

/**
 * Gère l'action de partage
 * @param {string} title - Titre du contenu
 * @param {string} text - Texte à partager
 * @param {string} url - URL optionnelle
 * @returns {Promise<boolean>} - True si le partage a réussi
 */
export const shareContent = async (title: string, text: string, url?: string): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: text.substring(0, 100) + '...',
        url
      });
      return true;
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      return false;
    }
  }
  return false;
};
