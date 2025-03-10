
import { useState } from 'react';
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";

interface PreferencesTabProps {
  settings: {
    autoSaveSearches: boolean;
    defaultSearchEngine: string;
    resultsPerPage: string;
    includeExternalDatabases: boolean;
  };
  handleSettingChange: (setting: string, value: string | boolean) => void;
}

const PreferencesTab = ({ settings, handleSettingChange }: PreferencesTabProps) => {
  const { toast } = useToast();

  return (
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
  );
};

export default PreferencesTab;
