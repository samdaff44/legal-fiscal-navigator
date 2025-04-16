
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { authController } from '@/controllers/auth/authController';
import { CredentialsStore, DATABASE_NAMES } from '@/models/Database';

/**
 * Hook pour gérer la vérification des identifiants
 */
export const useCredentialVerification = () => {
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState<Record<keyof CredentialsStore, boolean>>({
    database1: false,
    database2: false,
    database3: false
  });
  const [verificationStatus, setVerificationStatus] = useState<Record<keyof CredentialsStore, boolean | null>>({
    database1: null,
    database2: null,
    database3: null
  });

  /**
   * Vérifie les identifiants pour une base de données spécifique
   */
  const verifyDatabaseCredentials = async (
    db: keyof CredentialsStore,
    username: string,
    password: string
  ) => {
    // Ne pas vérifier si les champs sont vides
    if (!username || !password) return;
    
    setIsVerifying(prev => ({ ...prev, [db]: true }));
    
    try {
      // En mode démo, on simule une vérification
      if (process.env.NODE_ENV === 'development') {
        // Simuler un délai pour la vérification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simuler un résultat de vérification (toujours valide en mode démo)
        const isValid = true;
        
        setVerificationStatus(prev => ({ ...prev, [db]: isValid }));
        
        if (isValid) {
          toast({
            title: "Vérification réussie",
            description: `Les identifiants pour ${DATABASE_NAMES[db]} sont valides`,
            variant: "default",
            duration: 3000,
          });
        }
      } else {
        // En production, on vérifie réellement les identifiants
        const isValid = await authController.verifyCredentials(db, username, password);
        
        setVerificationStatus(prev => ({ ...prev, [db]: isValid }));
        
        if (isValid) {
          toast({
            title: "Vérification réussie",
            description: `Les identifiants pour ${DATABASE_NAMES[db]} sont valides`,
            variant: "default",
            duration: 3000,
          });
        } else {
          toast({
            title: "Erreur de connexion",
            description: `Les identifiants pour ${DATABASE_NAMES[db]} sont invalides`,
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification:", error);
      
      setVerificationStatus(prev => ({ ...prev, [db]: false }));
      
      toast({
        title: "Erreur de vérification",
        description: error instanceof Error ? error.message : "Impossible de vérifier les identifiants",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsVerifying(prev => ({ ...prev, [db]: false }));
    }
  };

  return {
    isVerifying,
    verificationStatus,
    verifyDatabaseCredentials,
    setVerificationStatus
  };
};
