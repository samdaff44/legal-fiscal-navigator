
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft } from 'lucide-react';
import { CredentialsStore } from '@/models/Database';
import { useAuth } from '@/hooks/useAuth';

// Import des onglets refactorisés
import CredentialsTab from '@/components/settings/CredentialsTab';
import PreferencesTab from '@/components/settings/PreferencesTab';
import SecurityTab from '@/components/settings/SecurityTab';
import ExportTab from '@/components/settings/ExportTab';

const Settings = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [credentials, setCredentials] = useState<CredentialsStore>({
    database1: { username: "", password: "", url: "" },
    database2: { username: "", password: "", url: "" },
    database3: { username: "", password: "", url: "" }
  });
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

  const handleSettingChange = (
    setting: string,
    value: string | boolean
  ) => {
    setSettings({
      ...settings,
      [setting]: value
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
              <CredentialsTab 
                credentials={credentials} 
                setCredentials={setCredentials} 
              />
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <PreferencesTab 
                settings={settings} 
                handleSettingChange={handleSettingChange} 
              />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <SecurityTab 
                settings={settings} 
                handleSettingChange={handleSettingChange} 
              />
            </TabsContent>
            
            <TabsContent value="export" className="space-y-6">
              <ExportTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-6 bg-secondary/50 mt-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © 2023 Torbey Tax Navigator. Tous droits réservés.
          </p>
          <p className="text-center text-sm text-muted-foreground">
            Version 1.0.0
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
