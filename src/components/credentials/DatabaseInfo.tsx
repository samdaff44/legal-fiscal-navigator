
import { ExternalLink } from 'lucide-react';
import { CredentialsStore, DATABASE_NAMES } from '@/models/Database';
import VerificationStatus from './VerificationStatus';

interface DatabaseInfoProps {
  activeDatabase: keyof CredentialsStore;
  credentials: CredentialsStore;
  isVerifying: boolean;
  verificationStatus: boolean | null;
}

/**
 * Affiche les informations de la base de données active et son statut de vérification
 */
const DatabaseInfo = ({ 
  activeDatabase, 
  credentials, 
  isVerifying, 
  verificationStatus 
}: DatabaseInfoProps) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <p className="text-sm text-muted-foreground">
        <ExternalLink className="h-4 w-4 inline mr-1" />
        <a 
          href={credentials[activeDatabase].url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Visiter {DATABASE_NAMES[activeDatabase]}
        </a>
      </p>
      <VerificationStatus 
        isVerifying={isVerifying} 
        verificationStatus={verificationStatus} 
      />
    </div>
  );
};

export default DatabaseInfo;
