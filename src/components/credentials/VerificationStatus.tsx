
import { Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface VerificationStatusProps {
  isVerifying: boolean;
  verificationStatus: boolean | null;
}

/**
 * Affiche l'indicateur de statut de vérification des identifiants
 */
const VerificationStatus = ({ isVerifying, verificationStatus }: VerificationStatusProps) => {
  if (isVerifying) {
    return (
      <div className="flex items-center text-blue-500">
        <Loader className="h-4 w-4 animate-spin mr-2" />
        <span className="text-xs">Vérification en cours...</span>
      </div>
    );
  }
  
  if (verificationStatus === true) {
    return (
      <div className="flex items-center text-green-500">
        <CheckCircle className="h-4 w-4 mr-2" />
        <span className="text-xs">Identifiants vérifiés</span>
      </div>
    );
  }
  
  if (verificationStatus === false) {
    return (
      <div className="flex items-center text-red-500">
        <AlertCircle className="h-4 w-4 mr-2" />
        <span className="text-xs">Identifiants invalides</span>
      </div>
    );
  }
  
  return null;
};

export default VerificationStatus;
