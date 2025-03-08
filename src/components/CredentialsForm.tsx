
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Database, Lock, Shield, ExternalLink, InfoIcon } from 'lucide-react';
import { CredentialsStore, DATABASE_NAMES, DATABASE_URLS } from '@/models/Database';
import { authController } from '@/controllers/authController';

/**
 * Composant de formulaire d'identifiants pour les bases de données
 */
const CredentialsForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
      // Tentative de connexion via le contrôleur d'authentification
      const connectedDatabases = await authController.login(credentials);
      
      toast({
        title: "Identifiants enregistrés",
        description: `Vos identifiants pour ${connectedDatabases.length} base${connectedDatabases.length > 1 ? 's' : ''} de données ont été enregistrés`,
        duration: 3000,
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
    // Vérifie si au moins une base de données a un nom d'utilisateur et un mot de passe
    return Object.values(credentials).some(db => 
      db.username.trim() !== "" && db.password.trim() !== ""
    );
  };

  /**
   * Visite le site web de la base de données
   */
  const visitDatabaseWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
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
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6 flex items-start">
          <InfoIcon className="text-amber-600 dark:text-amber-400 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800 dark:text-amber-300">
            Vos identifiants seront utilisés pour accéder aux sites web via un navigateur automatisé. 
            Les recherches s'effectueront uniquement sur les bases de données pour lesquelles vous avez fourni des identifiants valides.
          </p>
        </div>
      
        <form onSubmit={handleSubmit}>
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

            <div className="space-y-2">
              <Label htmlFor={`${activeDatabase}-username`}>
                Identifiant {DATABASE_NAMES[activeDatabase]}
              </Label>
              <div className="relative">
                <Input
                  id={`${activeDatabase}-username`}
                  value={credentials[activeDatabase].username}
                  onChange={(e) => handleCredentialChange(activeDatabase, "username", e.target.value)}
                  className="pl-10"
                  placeholder="Entrez votre identifiant"
                />
                <Database className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`${activeDatabase}-password`}>
                Mot de passe {DATABASE_NAMES[activeDatabase]}
              </Label>
              <div className="relative">
                <Input
                  id={`${activeDatabase}-password`}
                  type="password"
                  value={credentials[activeDatabase].password}
                  onChange={(e) => handleCredentialChange(activeDatabase, "password", e.target.value)}
                  className="pl-10"
                  placeholder="Entrez votre mot de passe"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
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
