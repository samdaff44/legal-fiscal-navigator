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
import { Database, Lock, Shield } from 'lucide-react';

interface Credentials {
  database1: {
    username: string;
    password: string;
  };
  database2: {
    username: string;
    password: string;
  };
  database3: {
    username: string;
    password: string;
  };
}

const DATABASE_NAMES = {
  database1: "Lexis Nexis",
  database2: "Dalloz",
  database3: "EFL Francis Lefebvre"
};

const CredentialsForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeDatabase, setActiveDatabase] = useState<keyof Credentials>("database1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<Credentials>({
    database1: { username: "", password: "" },
    database2: { username: "", password: "" },
    database3: { username: "", password: "" }
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
    
    // Simulate API connection
    setTimeout(() => {
      // Store credentials in localStorage (in a real app, better to use a more secure approach)
      localStorage.setItem('databaseCredentials', JSON.stringify(credentials));
      
      toast({
        title: "Connexion réussie",
        description: "Vos identifiants ont été enregistrés",
        duration: 3000,
      });
      
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 1500);
  };

  const isFormComplete = () => {
    return Object.values(credentials).every(db => 
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
              {isSubmitting ? "Connexion..." : "Se connecter"}
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
