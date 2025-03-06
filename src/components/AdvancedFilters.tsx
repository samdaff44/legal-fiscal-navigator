
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Calendar } from 'lucide-react';

const AdvancedFilters = () => {
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState([2015, 2023]);
  const [jurisdiction, setJurisdiction] = useState<string | undefined>();
  const [relevance, setRelevance] = useState([75]);

  const handleDocumentTypeChange = (type: string) => {
    setDocumentTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const resetFilters = () => {
    setDocumentTypes([]);
    setDateRange([2015, 2023]);
    setJurisdiction(undefined);
    setRelevance([75]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Filtres avancés</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>Réinitialiser</Button>
      </div>

      <Accordion type="multiple" defaultValue={["documentType", "date"]}>
        <AccordionItem value="documentType">
          <AccordionTrigger className="py-2">Type de document</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <CheckboxItem 
                id="jurisprudence" 
                checked={documentTypes.includes("jurisprudence")} 
                onChange={() => handleDocumentTypeChange("jurisprudence")}
                label="Jurisprudence"
              />
              <CheckboxItem 
                id="doctrine" 
                checked={documentTypes.includes("doctrine")} 
                onChange={() => handleDocumentTypeChange("doctrine")}
                label="Doctrine"
              />
              <CheckboxItem 
                id="legislation" 
                checked={documentTypes.includes("legislation")} 
                onChange={() => handleDocumentTypeChange("legislation")}
                label="Législation"
              />
              <CheckboxItem 
                id="articles" 
                checked={documentTypes.includes("articles")} 
                onChange={() => handleDocumentTypeChange("articles")}
                label="Articles"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date">
          <AccordionTrigger className="py-2">Période</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>{dateRange[0]}</span>
                <Calendar className="h-4 w-4 text-muted-foreground mx-2" />
                <span>{dateRange[1]}</span>
              </div>
              <Slider
                min={1950}
                max={2023}
                step={1}
                value={dateRange}
                onValueChange={setDateRange}
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="jurisdiction">
          <AccordionTrigger className="py-2">Juridiction</AccordionTrigger>
          <AccordionContent>
            <Select value={jurisdiction} onValueChange={setJurisdiction}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une juridiction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cass">Cour de cassation</SelectItem>
                <SelectItem value="ce">Conseil d'État</SelectItem>
                <SelectItem value="ca">Cour d'appel</SelectItem>
                <SelectItem value="cc">Conseil constitutionnel</SelectItem>
                <SelectItem value="caa">Cour administrative d'appel</SelectItem>
                <SelectItem value="ta">Tribunal administratif</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="relevance">
          <AccordionTrigger className="py-2">Pertinence</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Min: {relevance[0]}%</span>
              </div>
              <Slider
                min={0}
                max={100}
                step={5}
                value={relevance}
                onValueChange={setRelevance}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full mt-4">Appliquer les filtres</Button>
    </div>
  );
};

const CheckboxItem = ({ id, checked, onChange, label }: { 
  id: string; 
  checked: boolean; 
  onChange: () => void; 
  label: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
    </div>
  );
};

export default AdvancedFilters;
