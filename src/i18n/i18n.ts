
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { InitOptions } from 'i18next';

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
const initOptions: InitOptions = {
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false
  },
  react: {
    useSuspense: false
  }
};

// The compatibilityJSON option needs to be handled differently as it's type-checked
if (typeof window !== 'undefined') {
  // Only add compatibility mode in browser environment
  (initOptions as any).compatibilityJSON = 'v3';
}

i18n
  .use(initReactI18next)
  .init(initOptions);

export default i18n;
