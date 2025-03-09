
import { CheckCircle } from 'lucide-react';
import { DatabaseStatus } from '@/models/SearchResult';

interface DatabaseStatusDisplayProps {
  databases: DatabaseStatus[];
}

const DatabaseStatusDisplay = ({ databases }: DatabaseStatusDisplayProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {databases.map((db, index) => (
        <div 
          key={index}
          className="bg-accent/30 rounded-full px-4 py-1.5 flex items-center text-sm"
          aria-label={`Statut de connexion: ${db.name}`}
        >
          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
          <span className="font-light">Connecté à {db.name}</span>
        </div>
      ))}
    </div>
  );
};

export default DatabaseStatusDisplay;
