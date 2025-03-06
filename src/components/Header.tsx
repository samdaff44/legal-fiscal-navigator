
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Settings, Database, Home } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-primary rounded-md opacity-20 animate-pulse"></div>
            <div className="absolute inset-1 bg-white rounded-md shadow-inner"></div>
            <div className="absolute inset-[4px] bg-primary rounded-sm flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-medium text-lg">LegalFiscal Navigator</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {location.pathname !== '/' && (
            <>
              <NavLink to="/dashboard" icon={<Home size={16} />} label="Accueil" pathname={location.pathname} />
              <NavLink to="/results" icon={<Search size={16} />} label="Recherches" pathname={location.pathname} />
              <NavLink to="/settings" icon={<Settings size={16} />} label="Paramètres" pathname={location.pathname} />
            </>
          )}
        </nav>
        
        {location.pathname === '/' && (
          <Button variant="ghost" asChild>
            <Link to="/dashboard" className="flex items-center gap-2">
              <span>Explorer</span>
            </Link>
          </Button>
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
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
        isActive 
          ? 'bg-accent text-accent-foreground font-medium' 
          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Header;
