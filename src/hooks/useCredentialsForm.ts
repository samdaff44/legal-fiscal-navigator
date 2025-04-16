
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { CredentialsStore } from '@/models/Database';
import { useAuth } from '@/hooks/useAuth';
import { useCredentialVerification } from './useCredentialVerification';

/**
 * Hook pour gérer la logique du formulaire d'identifiants
 */
export const useCredentialsForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isVerifying, verificationStatus, verifyDatabaseCredentials } = useCredentialVerification();
  const [activeDatabase, setActiveDatabase] = useState<keyof CredentialsStore>("database1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credentials, setCredentials] = useState<CredentialsStore>({
    database1: { username: "", password: "", url: "https://www.lexisnexis.fr/connexion" },
    database2: { username: "", password: "", url: "https://www.dalloz.fr/connexion" },
    database3: { username: "", password: "", url: "https://www.efl.fr/connexion" }
  });

  /**
   * Gère le changement d'identifiants et vérifie si ceux-ci sont remplis
   */
  const handleCredentialChange = async (
    db: keyof CredentialsStore,
    field: "username" | "password",
    value: string
  ) => {
    const updatedCredentials = {
      ...credentials,
      [db]: {
        ...credentials[db],
        [field]: value
      }
    };
    
    setCredentials(updatedCredentials);
    
    // Vérifier les identifiants si les deux champs sont remplis
    const username = field === "username" ? value : credentials[db].username;
    const password = field === "password" ? value : credentials[db].password;
    
    if (username && password) {
      await verifyDatabaseCredentials(db, username, password);
    } else {
      // Réinitialiser le statut de vérification si un champ est vidé
      setVerificationStatus(prev => ({
        ...prev,
        [db]: null
      }));
    }
  };

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Éviter les soumissions multiples
    
    setIsSubmitting(true);
    
    try {
      // Vérifier qu'au moins une base de données a des identifiants valides
      const databasesWithCredentials = Object.keys(credentials).filter(db => {
        const dbKey = db as keyof CredentialsStore;
        return credentials[dbKey].username.trim() !== "" && 
               credentials[dbKey].password.trim() !== "" && 
               (verificationStatus[dbKey] === true || verificationStatus[dbKey] === null);
      });
      
      if (databasesWithCredentials.length === 0) {
        throw new Error("Veuillez saisir et vérifier les identifiants pour au moins une base de données");
      }
      
      // Tentative de connexion via le hook d'authentification
      const connectedDatabases = await login(credentials);
      
      toast({
        title: "Connexion réussie",
        description: `Vous êtes maintenant connecté à ${connectedDatabases.length} base${connectedDatabases.length > 1 ? 's' : ''} de données`,
        duration: 3000,
      });
      
      // Utiliser setTimeout pour éviter les mises à jour d'état rapides qui peuvent causer des problèmes
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'enregistrement des identifiants",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Vérifie si le formulaire est valide
   */
  const isFormValid = () => {
    return Object.values(credentials).some(db => 
      db.username.trim() !== "" && db.password.trim() !== ""
    );
  };

  return {
    activeDatabase,
    setActiveDatabase,
    credentials,
    handleCredentialChange,
    handleSubmit,
    isSubmitting,
    isFormValid,
    isVerifying,
    verificationStatus
  };
};
