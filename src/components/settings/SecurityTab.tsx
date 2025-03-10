
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
import { Shield } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SecurityTabProps {
  settings: {
    enableSecureMode: boolean;
    sessionTimeout: string;
  };
  handleSettingChange: (setting: string, value: string | boolean) => void;
}

const SecurityTab = ({ settings, handleSettingChange }: SecurityTabProps) => {
  const { toast } = useToast();
  const { updateSessionTime } = useAuth();

  const handleSessionTimeoutChange = (value: string) => {
    handleSettingChange('sessionTimeout', value);
    
    // Mise à jour du délai d'expiration via le hook d'authentification
    updateSessionTime(parseInt(value, 10));
    
    toast({
      title: "Délai d'expiration mis à jour",
      description: `Votre session expirera après ${value} minutes d'inactivité`,
      duration: 3000,
    });
  };

  return (
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
  );
};

export default SecurityTab;
