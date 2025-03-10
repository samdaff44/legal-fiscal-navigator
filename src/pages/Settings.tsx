import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  ArrowLeft, Database, Download, Save, Trash2, User, Lock, 
  CheckCircle, LogOut, Shield
} from 'lucide-react';
import { CredentialsStore, DATABASE_NAMES } from '@/models/Database';
import { useAuth } from '@/hooks/useAuth';
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

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, logout, logoutFrom, updateSessionTime } = useAuth();
  const [credentials, setCredentials] = useState<CredentialsStore>({
    database1: { username: "", password: "", url: "" },
    database2: { username: "", password: "", url: "" },
    database3: { username: "", password: "", url: "" }
  });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    autoSaveSearches: true,
    defaultSearchEngine: 'all',
    resultsPerPage: '20',
    includeExternalDatabases: false,
    enableSecureMode: true,
    sessionTimeout: '30'
  });

  useEffect(() => {
    // Vérifie si l'utilisateur est authentifié
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Charger les identifiants depuis le localStorage déchiffré
    // Cette fonctionnalité est gérée par le hook useAuth
  }, [isAuthenticated, navigate]);

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

  const handleSettingChange = (
    setting: string,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      [setting]: value
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

  const handleSessionTimeoutChange = (value: string) => {
    setSettings({
      ...settings,
      sessionTimeout: value
    });
    
    // Mise à jour du délai d'expiration via le hook d'authentification
    updateSessionTime(parseInt(value, 10));
    
    toast({
      title: "Délai d'expiration mis à jour",
      description: `Votre session expirera après ${value} minutes d'inactivité`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 px-4 md:px-8">
        <div className="container mx-auto py-6 max-w-4xl animate-fade-in">
          <Button 
            variant="ghost" 
            className="mb-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          
          <h1 className="text-3xl font-semibold mb-8">Paramètres</h1>
          
          <Tabs defaultValue="credentials">
            <TabsList className="mb-8">
              <TabsTrigger value="credentials">Identifiants</TabsTrigger>
              <TabsTrigger value="preferences">Préférences</TabsTrigger>
              <TabsTrigger value="security">Sécurité</TabsTrigger>
              <TabsTrigger value="export">Export & Sauvegarde</TabsTrigger>
            </TabsList>
            
            <TabsContent value="credentials" className="space-y-6">
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
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de recherche</CardTitle>
                  <CardDescription>
                    Personnalisez votre expérience de recherche juridique et fiscale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sauvegarder automatiquement les recherches</Label>
                      <p className="text-sm text-muted-foreground">
                        Enregistrer l'historique de vos recherches pour y accéder facilement
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoSaveSearches}
                      onCheckedChange={(value) => handleSettingChange('autoSaveSearches', value)}
                    />
                  </div>
                  
                  <div className="space-y-4 border-t pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="default-search-engine">Moteur de recherche par défaut</Label>
                      <select
                        id="default-search-engine"
                        value={settings.defaultSearchEngine}
                        onChange={(e) => handleSettingChange('defaultSearchEngine', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="all">Toutes les bases de données</option>
                        <option value="lexisnexis">LexisNexis uniquement</option>
                        <option value="dalloz">Dalloz uniquement</option>
                        <option value="efl">EFL Francis Lefebvre uniquement</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="results-per-page">Résultats par page</Label>
                      <select
                        id="results-per-page"
                        value={settings.resultsPerPage}
                        onChange={(e) => handleSettingChange('resultsPerPage', e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="10">10 résultats</option>
                        <option value="20">20 résultats</option>
                        <option value="50">50 résultats</option>
                        <option value="100">100 résultats</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t pt-6">
                    <div className="space-y-0.5">
                      <Label>Inclure les bases de données externes</Label>
                      <p className="text-sm text-muted-foreground">
                        Rechercher également dans des sources gratuites additionnelles
                      </p>
                    </div>
                    <Switch
                      checked={settings.includeExternalDatabases}
                      onCheckedChange={(value) => handleSettingChange('includeExternalDatabases', value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => {
                    toast({
                      title: "Préférences sauvegardées",
                      description: "Vos paramètres ont été mis à jour",
                      duration: 3000,
                    });
                  }}>
                    Sauvegarder les préférences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-primary" />
                    <span>Paramètres de sécurité</span>
                  </CardTitle>
                  <CardDescription>
                    Configurez les options de sécurité pour protéger vos données
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mode sécurisé</Label>
                      <p className="text-sm text-muted-foreground">
                        Active des protections supplémentaires pour vos sessions
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSecureMode}
                      onCheckedChange={(value) => handleSettingChange('enableSecureMode', value)}
                    />
                  </div>
                  
                  <div className="space-y-4 border-t pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">Expiration de session (minutes)</Label>
                      <p className="text-sm text-muted-foreground mb-2">
                        Durée après laquelle vous serez automatiquement déconnecté
                      </p>
                      <select
                        id="session-timeout"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleSessionTimeoutChange(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        disabled={!settings.enableSecureMode}
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 heure</option>
                        <option value="120">2 heures</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <h3 className="font-medium flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-amber-600" />
                      Recommandations de sécurité
                    </h3>
                    <ul className="list-disc ml-5 space-y-1 text-sm text-muted-foreground">
                      <li>Utilisez des mots de passe forts et uniques pour chaque base de données</li>
                      <li>Activez le mode sécurisé pour une protection optimale</li>
                      <li>Ne partagez pas vos identifiants avec d'autres personnes</li>
                      <li>Déconnectez-vous lorsque vous n'utilisez plus l'application</li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={() => {
                    toast({
                      title: "Paramètres de sécurité sauvegardés",
                      description: "Vos préférences de sécurité ont été mises à jour",
                      duration: 3000,
                    });
                  }}>
                    Sauvegarder les paramètres de sécurité
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="export" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Export et sauvegarde de données</CardTitle>
                  <CardDescription>
                    Gérez vos données de recherche et exportez vos résultats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Exporter vos données</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Téléchargez l'ensemble de vos recherches et résultats au format CSV ou PDF
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Exporter l'historique (CSV)
                      </Button>
                      <Button variant="outline" className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Exporter les résultats sauvegardés (PDF)
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-medium">Sauvegarde des données</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Créez une sauvegarde complète de vos paramètres et de vos recherches
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="outline" className="flex items-center">
                        <Download className="mr-2 h-4 w-4" />
                        Créer une sauvegarde
                      </Button>
                      <label className="cursor-pointer">
                        <div className="flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                          <Upload className="mr-2 h-4 w-4" />
                          Importer une sauvegarde
                        </div>
                        <input type="file" className="hidden" accept=".json" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="bg-accent/30 rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                      Toutes vos données sont stockées uniquement sur votre appareil. 
                      Nous vous recommandons de créer régulièrement des sauvegardes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-secondary/50 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2023 LegalFiscal Navigator. Tous droits réservés.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Version 1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
};

const Upload = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default Settings;
