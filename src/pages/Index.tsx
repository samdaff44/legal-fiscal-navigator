
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import CredentialsForm from '@/components/CredentialsForm';
import { Button } from "@/components/ui/button";
import { Search, Database, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [hasCredentials, setHasCredentials] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Check if we already have credentials
    const credentials = localStorage.getItem('databaseCredentials');
    if (credentials) {
      setHasCredentials(true);
    }

    // Disable intro animation after 2 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16 md:py-24">
        <div 
          className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${
            showAnimation ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
          }`}
        >
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-primary rounded-xl opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-lg shadow-inner"></div>
              <div className="absolute inset-4 bg-primary rounded-md flex items-center justify-center">
                <Database className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
            LegalFiscal Navigator
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Votre interface unifiée pour des recherches juridiques et fiscales avancées
            sur les bases de données professionnelles.
          </p>

          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center mb-12">
            {hasCredentials ? (
              <Button size="lg" onClick={handleContinue} className="group">
                <span>Continuer vers le dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button size="lg" onClick={() => {}} className="opacity-0">
                Placeholder
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard 
              icon={<Search className="h-10 w-10 text-primary" />}
              title="Recherche unifiée"
              description="Interrogez simultanément les bases LexisNexis, Westlaw et DataFiscal."
            />
            <FeatureCard 
              icon={<Database className="h-10 w-10 text-primary" />}
              title="Compilation intelligente"
              description="Les résultats sont automatiquement compilés et triés par pertinence."
            />
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Sécurité garantie"
              description="Vos identifiants sont chiffrés et stockés uniquement sur votre appareil."
            />
          </div>
        </div>

        {!hasCredentials && (
          <div className={`w-full max-w-lg mx-auto transition-all duration-1000 ${
            showAnimation ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
          }`}>
            <CredentialsForm />
          </div>
        )}
      </main>
      
      <footer className="border-t py-6 bg-secondary/50">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2023 LegalFiscal Navigator. Tous droits réservés.
          </p>
          <p className="text-center text-sm text-muted-foreground md:text-right">
            Une application conçue pour les professionnels du droit et de la fiscalité.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-soft animate-blur-in">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
