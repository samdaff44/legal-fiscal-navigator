
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

// Initialize i18next
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'fr', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
