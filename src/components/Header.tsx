
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Settings, Database, Home, LogOut } from 'lucide-react';
import { authController } from '@/controllers/authController';
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié
    setIsAuthenticated(authController.isAuthenticated());
  }, [location]);

  const handleLogout = () => {
    authController.logout();
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté de toutes les bases de données",
      duration: 3000,
    });
    navigate('/');
  };

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-border/20 py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 overflow-hidden">
            <div className="absolute inset-0 rounded-md bg-gradient-to-br from-primary to-primary/80 group-hover:from-primary/90 group-hover:to-primary/70 transition-all duration-300"></div>
            <div className="absolute inset-[3px] rounded-[4px] bg-background flex items-center justify-center">
              <Database className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <span className="font-light tracking-wide text-lg">LegalFiscal <span className="font-medium">Navigator</span></span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {location.pathname !== '/' && isAuthenticated && (
            <>
              <NavLink to="/dashboard" icon={<Home size={18} />} label="Accueil" pathname={location.pathname} />
              <NavLink to="/results" icon={<Search size={18} />} label="Recherches" pathname={location.pathname} />
              <NavLink to="/settings" icon={<Settings size={18} />} label="Paramètres" pathname={location.pathname} />
            </>
          )}
        </nav>
        
        {location.pathname === '/' && !isAuthenticated && (
          <Button variant="outline" asChild className="border-border/30 hover:border-border hover:bg-accent/50">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="font-light">Explorer</span>
            </Link>
          </Button>
        )}

        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center">
                <span className="hidden md:inline-block mr-2">Options</span>
                <Database className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

const NavLink = ({ to, icon, label, pathname }: { to: string; icon: React.ReactNode; label: string; pathname: string }) => {
  const isActive = pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 py-2 relative transition-all duration-200 ${
        isActive 
          ? 'text-foreground font-medium' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {icon}
      <span>{label}</span>
      
      {isActive && (
        <div className="absolute -bottom-[1px] left-0 w-full h-[2px] bg-primary animate-fade-in" />
      )}
    </Link>
  );
};

export default Header;
