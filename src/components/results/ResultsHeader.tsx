
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

interface ResultsHeaderProps {
  query: string;
  navigateToDashboard: () => void;
}

const ResultsHeader = ({ query, navigateToDashboard }: ResultsHeaderProps) => {
  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={navigateToDashboard}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
            
      <h1 className="text-2xl font-semibold">
        Résultats pour: <span className="text-primary font-normal">"{query}"</span>
      </h1>
    </>
  );
};

export default ResultsHeader;
