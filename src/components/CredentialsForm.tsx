
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Shield } from 'lucide-react';
import { useCredentialsForm } from '@/hooks/useCredentialsForm';
import CredentialsFormContent from './credentials/CredentialsFormContent';

/**
 * Composant de formulaire d'identifiants pour les bases de données
 */
const CredentialsForm = () => {
  const {
    activeDatabase,
    setActiveDatabase,
    credentials,
    handleCredentialChange,
    handleSubmit,
    isSubmitting,
    isFormValid,
    isVerifying,
    verificationStatus
  } = useCredentialsForm();

  return (
    <Card className="w-full max-w-lg mx-auto opacity-95 shadow-soft animate-fade-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Connexion aux bases de données</CardTitle>
          <Shield className="text-primary h-6 w-6" />
        </div>
        <CardDescription>
          Entrez vos identifiants pour les bases de données juridiques et fiscales
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <CredentialsFormContent
          activeDatabase={activeDatabase}
          setActiveDatabase={setActiveDatabase}
          credentials={credentials}
          handleCredentialChange={handleCredentialChange}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          isVerifying={isVerifying}
          verificationStatus={verificationStatus}
        />
      </CardContent>
      
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-muted-foreground">
          Vos identifiants sont chiffrés et stockés localement
        </p>
      </CardFooter>
    </Card>
  );
};

export default CredentialsForm;
