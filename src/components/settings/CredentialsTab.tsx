
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Database, Save, Trash2, User, Lock, 
  CheckCircle, LogOut
} from 'lucide-react';
import { CredentialsStore, DATABASE_NAMES } from '@/models/Database';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';

interface CredentialsTabProps {
  credentials: CredentialsStore;
  setCredentials: (credentials: CredentialsStore) => void;
}

const CredentialsTab = ({ credentials, setCredentials }: CredentialsTabProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { logout, logoutFrom } = useAuth();
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const saveCredentials = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      localStorage.setItem('databaseCredentials', JSON.stringify(credentials));
      
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos identifiants ont été mis à jour",
        duration: 3000,
      });
      
      setIsSaving(false);
    }, 1000);
  };

  const clearCredentials = () => {
    logout();
    
    toast({
      title: "Déconnexion réussie",
      description: "Toutes vos informations d'identification ont été effacées",
      duration: 3000,
    });
    
    navigate('/');
  };

  const handleLogoutFromDatabase = (db: keyof CredentialsStore) => {
    const success = logoutFrom(db);
    
    if (success) {
      // Mettre à jour l'état local des identifiants
      setCredentials({
        ...credentials,
        [db]: { 
          ...credentials[db], 
          username: "",
          password: ""
        }
      });
      
      toast({
        title: "Déconnexion réussie",
        description: `Vous avez été déconnecté de ${DATABASE_NAMES[db]}`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Erreur",
        description: `Impossible de vous déconnecter de ${DATABASE_NAMES[db]}`,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const isConnectedToDatabase = (db: keyof CredentialsStore): boolean => {
    return credentials[db].username !== "" && credentials[db].password !== "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="mr-2 h-5 w-5 text-primary" />
          <span>Identifiants des bases de données</span>
        </CardTitle>
        <CardDescription>
          Gérez vos identifiants pour les différentes bases de données juridiques et fiscales
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {(Object.keys(credentials) as Array<keyof CredentialsStore>).map((db) => (
          <div key={db} className="space-y-4 p-4 border rounded-lg bg-secondary/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{DATABASE_NAMES[db]}</h3>
              <div className="flex items-center gap-2">
                {isConnectedToDatabase(db) ? (
                  <>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">Connecté</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="ml-2 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleLogoutFromDatabase(db)}
                    >
                      <LogOut className="h-3.5 w-3.5 mr-1" />
                      Déconnecter
                    </Button>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">Non connecté</span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`${db}-username`}>Identifiant</Label>
                <div className="relative">
                  <Input
                    id={`${db}-username`}
                    value={credentials[db].username}
                    onChange={(e) => handleCredentialChange(db, "username", e.target.value)}
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`${db}-password`}>Mot de passe</Label>
                <div className="relative">
                  <Input
                    id={`${db}-password`}
                    type={showPasswords ? "text" : "password"}
                    value={credentials[db].password}
                    onChange={(e) => handleCredentialChange(db, "password", e.target.value)}
                    className="pl-10"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="flex items-center space-x-2">
          <Switch
            id="show-passwords"
            checked={showPasswords}
            onCheckedChange={setShowPasswords}
          />
          <Label htmlFor="show-passwords">Afficher les mots de passe</Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Déconnexion complète
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action va vous déconnecter de toutes les bases de données et supprimer tous vos identifiants. Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={clearCredentials}>Confirmer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button 
          onClick={saveCredentials} 
          disabled={isSaving}
          className="flex items-center"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CredentialsTab;
