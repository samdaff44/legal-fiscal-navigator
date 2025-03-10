
import { useState } from 'react';

/**
 * Hook personnalisé pour gérer la sélection des bases de données
 * @returns {Object} État et fonctions pour gérer la sélection des bases de données
 */
export const useDatabaseSelection = () => {
  const [selectedDatabases, setSelectedDatabases] = useState<string[]>(["Toutes les bases"]);

  /**
   * Bascule la sélection d'une base de données
   * @param {string} dbName - Nom de la base de données
   */
  const toggleDatabase = (dbName: string) => {
    if (dbName === "Toutes les bases") {
      setSelectedDatabases(["Toutes les bases"]);
      return;
    }
    
    const newSelection = selectedDatabases.filter(db => db !== "Toutes les bases");
    
    if (newSelection.includes(dbName)) {
      if (newSelection.length === 1) {
        setSelectedDatabases(["Toutes les bases"]);
      } else {
        setSelectedDatabases(newSelection.filter(db => db !== dbName));
      }
    } else {
      setSelectedDatabases([...newSelection, dbName]);
    }
  };

  /**
   * Retourne toutes les bases de données sélectionnées ou toutes les bases si "Toutes les bases" est sélectionné
   */
  const getSelectedDatabasesForSearch = (): string[] => {
    if (selectedDatabases.includes("Toutes les bases")) {
      return ["Lexis Nexis", "Dalloz", "EFL Francis Lefebvre"];
    }
    return selectedDatabases;
  };

  return {
    selectedDatabases,
    toggleDatabase,
    getSelectedDatabasesForSearch
  };
};
