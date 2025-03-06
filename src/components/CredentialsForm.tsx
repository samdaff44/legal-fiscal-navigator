
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
import { Database, Lock, Shield, ExternalLink } from 'lucide-react';

interface Credentials {
  database1: {
    username: string;
    password: string;
    url: string;
  };
  database2: {
    username: string;
    password: string;
    url: string;
  };
  database3: {
    username: string;
    password: string;
    url: string;
  };
}

const DATABASE_NAMES = {
  database1: "Lexis Nexis",
  database2: "Dalloz",
  database3: "EFL Francis Lefebvre"
};

const DATABASE_URLS = {
  database1: "https://www.lexisnexis.fr",
  database2: "https://www.dalloz.fr",
  database3: "https://www.efl.fr"
};

const CredentialsForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeDatabase, setActiveDatabase] = useState<keyof Credentials>("database1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({
    database1: { username: "", password: "", url: DATABASE_URLS.database1 },
    database2: { username: "", password: "", url: DATABASE_URLS.database2 },
    database3: { username: "", password: "", url: DATABASE_URLS.database3 }
  });

  const handleCredentialChange = (
    db: keyof Credentials,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate connections to all three websites
    toast({
      title: "Connexion en cours",
      description: `Connexion à ${DATABASE_NAMES.database1}...`,
      duration: 1000,
    });
    
    setTimeout(() => {
      toast({
        title: "Connexion en cours",
        description: `Connexion à ${DATABASE_NAMES.database2}...`,
        duration: 1000,
      });
      
      setTimeout(() => {
        toast({
          title: "Connexion en cours",
          description: `Connexion à ${DATABASE_NAMES.database3}...`,
          duration: 1000,
        });
        
        setTimeout(() => {
          // Store credentials in localStorage
          localStorage.setItem('databaseCredentials', JSON.stringify(credentials));
          
          toast({
            title: "Connexion réussie",
            description: "Vos identifiants ont été enregistrés et vous êtes connecté aux trois bases de données",
            duration: 3000,
          });
          
          setIsSubmitting(false);
          navigate('/dashboard');
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const isFormComplete = () => {
    return Object.values(credentials).every(db => 
      db.username.trim() !== "" && db.password.trim() !== ""
    );
  };

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
        <form onSubmit={handleSubmit}>
          <div className="flex border rounded-lg overflow-hidden mb-6">
            {(Object.keys(credentials) as Array<keyof Credentials>).map((db) => (
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
            <Button type="submit" className="w-full" disabled={!isFormComplete() || isSubmitting}>
              {isSubmitting ? "Connexion..." : "Se connecter aux bases de données"}
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
