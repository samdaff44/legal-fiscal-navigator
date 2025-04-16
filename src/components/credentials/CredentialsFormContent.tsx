
import { Button } from "@/components/ui/button";
import { CredentialsStore, DATABASE_NAMES } from '@/models/Database';
import DatabaseSelector from './DatabaseSelector';
import CredentialInput from './CredentialInput';
import DatabaseInfo from './DatabaseInfo';
import SecurityNotice from './SecurityNotice';
import { Database, Lock } from 'lucide-react';

interface CredentialsFormContentProps {
  activeDatabase: keyof CredentialsStore;
  setActiveDatabase: (db: keyof CredentialsStore) => void;
  credentials: CredentialsStore;
  handleCredentialChange: (db: keyof CredentialsStore, field: "username" | "password", value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  isFormValid: () => boolean;
  isVerifying: Record<keyof CredentialsStore, boolean>;
  verificationStatus: Record<keyof CredentialsStore, boolean | null>;
}

/**
 * Contenu du formulaire d'identifiants
 */
const CredentialsFormContent = ({
  activeDatabase,
  setActiveDatabase,
  credentials,
  handleCredentialChange,
  handleSubmit,
  isSubmitting,
  isFormValid,
  isVerifying,
  verificationStatus
}: CredentialsFormContentProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <SecurityNotice />

      <DatabaseSelector 
        activeDatabase={activeDatabase}
        setActiveDatabase={setActiveDatabase}
        credentials={credentials}
      />

      <div className="space-y-6 animate-fade-in">
        <DatabaseInfo 
          activeDatabase={activeDatabase}
          credentials={credentials}
          isVerifying={isVerifying[activeDatabase]}
          verificationStatus={verificationStatus[activeDatabase]}
        />

        <CredentialInput
          id={`${activeDatabase}-username`}
          label={`Identifiant ${DATABASE_NAMES[activeDatabase]}`}
          value={credentials[activeDatabase].username}
          onChange={(value) => handleCredentialChange(activeDatabase, "username", value)}
          placeholder="Entrez votre identifiant"
          Icon={Database}
        />

        <CredentialInput
          id={`${activeDatabase}-password`}
          label={`Mot de passe ${DATABASE_NAMES[activeDatabase]}`}
          value={credentials[activeDatabase].password}
          onChange={(value) => handleCredentialChange(activeDatabase, "password", value)}
          type="password"
          placeholder="Entrez votre mot de passe"
          Icon={Lock}
        />
      </div>

      <div className="mt-8">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </div>
    </form>
  );
};

export default CredentialsFormContent;
