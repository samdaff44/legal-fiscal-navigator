
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
import { AlertCircle, CheckCircle, Database, Lock, Shield, ExternalLink, Info, Loader } from 'lucide-react';
import { CredentialsStore, DATABASE_NAMES, DATABASE_URLS } from '@/models/Database';
import { useAuth } from '@/hooks/useAuth';
import { authController } from '@/controllers/auth/authController';
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
  const [isVerifying, setIsVerifying] = useState<Record<keyof CredentialsStore, boolean>>({
    database1: false,
    database2: false,
    database3: false
  });
  const [verificationStatus, setVerificationStatus] = useState<Record<keyof CredentialsStore, boolean | null>>({
    database1: null,
    database2: null,
    database3: null
  });
  const [credentials, setCredentials] = useState<CredentialsStore>({
    database1: { username: "", password: "", url: DATABASE_URLS.database1 },
    database2: { username: "", password: "", url: DATABASE_URLS.database2 },
    database3: { username: "", password: "", url: DATABASE_URLS.database3 }
  });

  /**
   * Gère le changement d'identifiants et vérifie si ceux-ci sont remplis
   */
  const handleCredentialChange = async (
    db: keyof CredentialsStore,
    field: "username" | "password",
    value: string
  ) => {
    const updatedCredentials = {
      ...credentials,
      [db]: {
        ...credentials[db],
        [field]: value
      }
    };
    
    setCredentials(updatedCredentials);
    
    // Vérifier les identifiants si les deux champs sont remplis
    const username = field === "username" ? value : credentials[db].username;
    const password = field === "password" ? value : credentials[db].password;
    
    if (username && password) {
      await verifyDatabaseCredentials(db, username, password);
    } else {
      // Réinitialiser le statut de vérification si un champ est vidé
      setVerificationStatus(prev => ({
        ...prev,
        [db]: null
      }));
    }
  };

  /**
   * Vérifie les identifiants pour une base de données spécifique
   */
  const verifyDatabaseCredentials = async (
    db: keyof CredentialsStore,
    username: string,
    password: string
  ) => {
    // Ne pas vérifier si les champs sont vides
    if (!username || !password) return;
    
    setIsVerifying(prev => ({ ...prev, [db]: true }));
    
    try {
      // En mode démo, on simule une vérification
      if (process.env.NODE_ENV === 'development') {
        // Simuler un délai pour la vérification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simuler un résultat de vérification (toujours valide en mode démo)
        const isValid = true;
        
        setVerificationStatus(prev => ({ ...prev, [db]: isValid }));
        
        if (isValid) {
          toast({
            title: "Vérification réussie",
            description: `Les identifiants pour ${DATABASE_NAMES[db]} sont valides`,
            variant: "default",
            duration: 3000,
          });
        }
      } else {
        // En production, on vérifie réellement les identifiants
        const isValid = await authController.verifyCredentials(db, username, password);
        
        setVerificationStatus(prev => ({ ...prev, [db]: isValid }));
        
        if (isValid) {
          toast({
            title: "Vérification réussie",
            description: `Les identifiants pour ${DATABASE_NAMES[db]} sont valides`,
            variant: "default",
            duration: 3000,
          });
        } else {
          toast({
            title: "Erreur de connexion",
            description: `Les identifiants pour ${DATABASE_NAMES[db]} sont invalides`,
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      
      setVerificationStatus(prev => ({ ...prev, [db]: false }));
      
      toast({
        title: "Erreur de vérification",
        description: error instanceof Error ? error.message : "Impossible de vérifier les identifiants",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsVerifying(prev => ({ ...prev, [db]: false }));
    }
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Éviter les soumissions multiples
    
    setIsSubmitting(true);
    
    try {
      // Vérifier qu'au moins une base de données a des identifiants valides
      const databasesWithCredentials = Object.keys(credentials).filter(db => {
        const dbKey = db as keyof CredentialsStore;
        return credentials[dbKey].username.trim() !== "" && 
               credentials[dbKey].password.trim() !== "" && 
               (verificationStatus[dbKey] === true || verificationStatus[dbKey] === null);
      });
      
      if (databasesWithCredentials.length === 0) {
        throw new Error("Veuillez saisir et vérifier les identifiants pour au moins une base de données");
      }
      
      // Tentative de connexion via le hook d'authentification
      const connectedDatabases = await login(credentials);
      
      toast({
        title: "Connexion réussie",
        description: `Vous êtes maintenant connecté à ${connectedDatabases.length} base${connectedDatabases.length > 1 ? 's' : ''} de données`,
        duration: 3000,
      });
      
      // Utiliser setTimeout pour éviter les mises à jour d'état rapides qui peuvent causer des problèmes
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      
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

  /**
   * Affiche l'indicateur de statut de vérification
   */
  const renderVerificationStatus = (db: keyof CredentialsStore) => {
    if (isVerifying[db]) {
      return (
        <div className="flex items-center text-blue-500">
          <Loader className="h-4 w-4 animate-spin mr-2" />
          <span className="text-xs">Vérification en cours...</span>
        </div>
      );
    }
    
    if (verificationStatus[db] === true) {
      return (
        <div className="flex items-center text-green-500">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span className="text-xs">Identifiants vérifiés</span>
        </div>
      );
    }
    
    if (verificationStatus[db] === false) {
      return (
        <div className="flex items-center text-red-500">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span className="text-xs">Identifiants invalides</span>
        </div>
      );
    }
    
    return null;
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
              {renderVerificationStatus(activeDatabase)}
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
              {isSubmitting ? "Connexion en cours..." : "Se connecter"}
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
