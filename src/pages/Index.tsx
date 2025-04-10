
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import CredentialsForm from '@/components/CredentialsForm';
import { Button } from "@/components/ui/button";
import { Search, Database, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const showCredentials = searchParams.get('showCredentials') === 'true';
  const [hasCredentials, setHasCredentials] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [displayCredentialsForm, setDisplayCredentialsForm] = useState(showCredentials);

  useEffect(() => {
    // Check if we already have credentials
    const credentials = localStorage.getItem('databaseCredentials');
    if (credentials) {
      setHasCredentials(true);
    }

    // Si showCredentials est true, afficher directement le formulaire d'identifiants
    if (showCredentials) {
      setDisplayCredentialsForm(true);
    }

    // Disable intro animation after 2 seconds
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showCredentials]);

  const handleContinue = () => {
    // Si l'utilisateur n'a pas d'identifiants, afficher le formulaire au lieu de naviguer
    if (!hasCredentials) {
      setDisplayCredentialsForm(true);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-24 pb-16">
        {!displayCredentialsForm ? (
          <div 
            className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
              showAnimation ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
            }`}
          >
            <div className="flex justify-center mb-12 relative">
              <div className="relative w-24 h-24 animate-float">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl rotate-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl -rotate-3"></div>
                <div className="absolute inset-0 bg-card rounded-xl shadow-soft flex items-center justify-center">
                  <Database className="w-12 h-12 text-primary" />
                </div>
              </div>
            </div>
            
            <h1 className="squarespace-heading text-4xl md:text-6xl font-light tracking-tight mb-6">
              Torbey Tax Navigator
            </h1>
            
            <p className="text-xl text-muted-foreground mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Votre interface unifiée pour des recherches juridiques et fiscales avancées
              sur les bases de données professionnelles.
            </p>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center mb-20">
              <Button size="lg" onClick={handleContinue} className="group px-8 py-6 text-base">
                <span>Continuer vers le dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
              <FeatureCard 
                icon={<Search className="h-10 w-10 text-primary" />}
                title="Recherche unifiée"
                description="Interrogez simultanément les bases LexisNexis, Dalloz et EFL Francis Lefebvre."
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
        ) : (
          <div className={`w-full max-w-md mx-auto transition-all duration-1000 ${
            showAnimation ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0'
          }`}>
            <CredentialsForm />
          </div>
        )}
      </main>
      
      <footer className="py-10 bg-secondary/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2023 Torbey Tax Navigator. Tous droits réservés.
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
    <div className="flex flex-col items-center text-center p-8 rounded-lg squarespace-card">
      <div className="mb-6 p-4 bg-primary/5 rounded-full">{icon}</div>
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
