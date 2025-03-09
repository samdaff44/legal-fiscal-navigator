
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultItem } from '@/types/search';

interface TabTriggersProps {
  results: ResultItem[];
}

const TabTriggers = ({ results }: TabTriggersProps) => {
  const lexisCount = results.filter(r => r.source === 'Lexis Nexis').length;
  const dallozCount = results.filter(r => r.source === 'Dalloz').length;
  const eflCount = results.filter(r => r.source === 'EFL Francis Lefebvre').length;

  return (
    <TabsList className="grid grid-cols-4 mb-6">
      <TabsTrigger value="all">Tous ({results.length})</TabsTrigger>
      <TabsTrigger value="lexisnexis">Lexis Nexis ({lexisCount})</TabsTrigger>
      <TabsTrigger value="dalloz">Dalloz ({dallozCount})</TabsTrigger>
      <TabsTrigger value="eflfrancislefebvre">EFL Francis Lefebvre ({eflCount})</TabsTrigger>
    </TabsList>
  );
};

export default TabTriggers;
