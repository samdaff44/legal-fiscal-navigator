
import { InfoIcon } from 'lucide-react';

/**
 * Composant d'information sur la sécurité des identifiants
 */
const SecurityNotice = () => {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6 flex items-start">
      <InfoIcon className="text-amber-600 dark:text-amber-400 h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-amber-800 dark:text-amber-300">
        Vos identifiants seront chiffrés et stockés localement sur votre appareil. 
        Une session active expirera automatiquement après 30 minutes d'inactivité.
      </p>
    </div>
  );
};

export default SecurityNotice;
