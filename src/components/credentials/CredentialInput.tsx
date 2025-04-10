
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LucideIcon } from 'lucide-react';

interface CredentialInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  Icon: LucideIcon;
}

/**
 * Composant d'entrée pour les identifiants
 */
const CredentialInput = ({ 
  id, 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder,
  Icon 
}: CredentialInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10"
          placeholder={placeholder}
        />
        <Icon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  );
};

export default CredentialInput;
