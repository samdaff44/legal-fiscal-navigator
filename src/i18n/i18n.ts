
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Define translation resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome to our legal search platform",
      search: "Search",
      results: "Results",
      settings: "Settings",
      logout: "Logout"
    }
  },
  fr: {
    translation: {
      welcome: "Bienvenue sur notre plateforme de recherche juridique",
      search: "Rechercher",
      results: "Résultats",
      settings: "Paramètres",
      logout: "Déconnexion"
    }
  }
};

// Initialize i18next with proper configuration
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false
    },
    compatibilityJSON: 'v3', // Add compatibility option for older browsers
    react: {
      useSuspense: false
    }
  });

export default i18n;
