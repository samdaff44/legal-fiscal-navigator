
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Download } from 'lucide-react';

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

const ExportTab = () => {
  return (
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
  );
};

export default ExportTab;
