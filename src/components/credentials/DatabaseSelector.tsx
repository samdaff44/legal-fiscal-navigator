
import { Database } from 'lucide-react';
import { CredentialsStore, DATABASE_NAMES } from '@/models/Database';

interface DatabaseSelectorProps {
  activeDatabase: keyof CredentialsStore;
  setActiveDatabase: (db: keyof CredentialsStore) => void;
  credentials: CredentialsStore;
}

/**
 * Composant de sélection de base de données
 */
const DatabaseSelector = ({ 
  activeDatabase, 
  setActiveDatabase, 
  credentials 
}: DatabaseSelectorProps) => {
  return (
    <div className="flex border rounded-lg overflow-hidden mb-6">
      {(Object.keys(credentials) as Array<keyof CredentialsStore>).map((db) => (
        <button
          key={db}
          type="button"
          className={`flex-1 py-2 px-3 text-sm font-medium transition-all ${
            activeDatabase === db
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
          onClick={() => setActiveDatabase(db)}
        >
          {DATABASE_NAMES[db]}
        </button>
      ))}
    </div>
  );
};

export default DatabaseSelector;
