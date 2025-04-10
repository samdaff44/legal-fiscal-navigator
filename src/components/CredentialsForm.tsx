
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Database, Lock, Shield, ExternalLink, Info } from 'lucide-react';
import { CredentialsStore, DATABASE_NAMES, DATABASE_URLS } from '@/models/Database';
import { useAuth } from '@/hooks/useAuth';
import DatabaseSelector from './credentials/DatabaseSelector';
import CredentialInput from './credentials/CredentialInput';
import SecurityNotice from './credentials/SecurityNotice';

/**
 * Composant de formulaire d'identifiants pour les bases de données
 */
const CredentialsForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeDatabase, setActiveDatabase] = useState<keyof CredentialsStore>("database1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<CredentialsStore>({
    database1: { username: "", password: "", url: DATABASE_URLS.database1 },
    database2: { username: "", password: "", url: DATABASE_URLS.database2 },
    database3: { username: "", password: "", url: DATABASE_URLS.database3 }
  });

  /**
   * Gère le changement d'identifiants
   */
  const handleCredentialChange = (
    db: keyof CredentialsStore,
    field: "username" | "password",
    value: string
  ) => {
    setCredentials({
      ...credentials,
      [db]: {
        ...credentials[db],
        [field]: value
      }
    });
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Tentative de connexion via le hook d'authentification
      const connectedDatabases = await login(credentials);
      
      toast({
        title: "Identifiants enregistrés",
        description: `Vos identifiants pour ${connectedDatabases.length} base${connectedDatabases.length > 1 ? 's' : ''} de données ont été enregistrés`,
        duration: 3000,
      });
      
      // Message informatif sur la simulation
      toast({
        title: "Mode démonstration",
        description: "En mode réel, les identifiants seraient vérifiés sur les bases de données cibles.",
        variant: "default",
        icon: <Info className="h-4 w-4 text-blue-500" />,
        duration: 5000,
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement des identifiants",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Vérifie si le formulaire est valide
   */
  const isFormValid = () => {
    return Object.values(credentials).some(db => 
      db.username.trim() !== "" && db.password.trim() !== ""
    );
  };

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
        <SecurityNotice />
      
        <form onSubmit={handleSubmit}>
          <DatabaseSelector 
            activeDatabase={activeDatabase}
            setActiveDatabase={setActiveDatabase}
            credentials={credentials}
          />

          <div className="space-y-6 animate-fade-in">
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
            </div>

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
              {isSubmitting ? "Enregistrement..." : "Enregistrer les identifiants"}
            </Button>
          </div>
        </form>
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
