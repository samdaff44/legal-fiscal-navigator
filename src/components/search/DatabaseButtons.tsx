
import { Button } from "@/components/ui/button";
import { DATABASE_NAMES } from './dbConstants';

interface DatabaseButtonProps {
  icon: React.ReactNode;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

export const DatabaseButton = ({ icon, name, isActive, onClick }: DatabaseButtonProps) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      className={`rounded-full transition-all duration-300 ${
        isActive 
          ? 'bg-primary text-primary-foreground shadow-md' 
          : 'bg-background hover:bg-accent'
      }`}
      onClick={onClick}
      aria-pressed={isActive}
    >
      <span className="flex items-center">
        <span className="mr-2">{icon}</span>
        <span>{name}</span>
      </span>
    </Button>
  );
};

interface DatabaseButtonsProps {
  selectedDatabases: string[];
  toggleDatabase: (dbName: string) => void;
}

const DatabaseButtons = ({ selectedDatabases, toggleDatabase }: DatabaseButtonsProps) => {
  return (
    <div className="flex flex-wrap justify-center mt-6 gap-3">
      {DATABASE_NAMES.map((db, index) => (
        <DatabaseButton 
          key={index} 
          icon={db.icon} 
          name={db.name} 
          isActive={selectedDatabases.includes(db.name)}
          onClick={() => toggleDatabase(db.name)}
        />
      ))}
    </div>
  );
};

export default DatabaseButtons;
