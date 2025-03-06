import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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
import { Calendar as CalendarIcon, Filter, BookOpen, Database, FileText, GitBranch, User, Globe, BookMarked, Languages, Award, Bookmark, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const AdvancedFilters = () => {
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [jurisdiction, setJurisdiction] = useState<string | undefined>();
  const [court, setCourt] = useState<string | undefined>();
  const [author, setAuthor] = useState<string>("");
  const [publicationYears, setPublicationYears] = useState([2000, 2023]);
  const [categories, setCategories] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [country, setCountry] = useState<string | undefined>();
  const [relevanceThreshold, setRelevanceThreshold] = useState([70]);
  const [citationsThreshold, setCitationsThreshold] = useState([0]);
  const [sortOption, setSortOption] = useState<string>("relevance");
  const [maxResults, setMaxResults] = useState<number>(50);

  const handleDocumentTypeChange = (type: string) => {
    setDocumentTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleCategoryChange = (category: string) => {
    setCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleLanguageChange = (language: string) => {
    setLanguages(prev =>
      prev.includes(language)
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const resetFilters = () => {
    setDocumentTypes([]);
    setDateRange({});
    setJurisdiction(undefined);
    setCourt(undefined);
    setAuthor("");
    setPublicationYears([2000, 2023]);
    setCategories([]);
    setLanguages([]);
    setCountry(undefined);
    setRelevanceThreshold([70]);
    setCitationsThreshold([0]);
    setSortOption("relevance");
    setMaxResults(50);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">Filtres avancés</h3>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <Filter className="h-4 w-4 mr-1" />
          Réinitialiser
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["documentType", "date", "sort"]}>
        <AccordionItem value="documentType">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Type de document</span>
            </div>
          </AccordionTrigger>
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
                id="article" 
                checked={documentTypes.includes("article")} 
                onChange={() => handleDocumentTypeChange("article")}
                label="Articles"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Période</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal">
                      {dateRange.from ? (
                        format(dateRange.from, "dd MMM yyyy", { locale: fr })
                      ) : (
                        <span>Date début</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start text-left font-normal">
                      {dateRange.to ? (
                        format(dateRange.to, "dd MMM yyyy", { locale: fr })
                      ) : (
                        <span>Date fin</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Année de publication</Label>
                <div className="flex items-center justify-between text-sm">
                  <span>{publicationYears[0]}</span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground mx-2" />
                  <span>{publicationYears[1]}</span>
                </div>
                <Slider
                  min={1950}
                  max={2023}
                  step={1}
                  value={publicationYears}
                  onValueChange={setPublicationYears}
                  className="w-full"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="jurisdiction">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span>Juridiction & Tribunaux</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Select value={jurisdiction} onValueChange={setJurisdiction}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une juridiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cour de cassation">Cour de cassation</SelectItem>
                  <SelectItem value="Conseil d'État">Conseil d'État</SelectItem>
                  <SelectItem value="Cour d'appel">Cour d'appel</SelectItem>
                  <SelectItem value="Conseil constitutionnel">Conseil constitutionnel</SelectItem>
                  <SelectItem value="Tribunal administratif">Tribunal administratif</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={court} onValueChange={setCourt}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une chambre/formation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Première chambre civile">Première chambre civile</SelectItem>
                  <SelectItem value="Chambre commerciale">Chambre commerciale</SelectItem>
                  <SelectItem value="Chambre sociale">Chambre sociale</SelectItem>
                  <SelectItem value="Chambre criminelle">Chambre criminelle</SelectItem>
                  <SelectItem value="Assemblée plénière">Assemblée plénière</SelectItem>
                  <SelectItem value="Chambre mixte">Chambre mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="author">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Auteur & Source</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="author">Auteur</Label>
                <Input 
                  id="author" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)} 
                  placeholder="Nom de l'auteur" 
                  className="mt-1"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Domaine</Label>
                <div className="grid grid-cols-2 gap-2">
                  <CheckboxItem 
                    id="droit-fiscal" 
                    checked={categories.includes("Droit fiscal")} 
                    onChange={() => handleCategoryChange("Droit fiscal")}
                    label="Droit fiscal"
                  />
                  <CheckboxItem 
                    id="droit-societes" 
                    checked={categories.includes("Droit des sociétés")} 
                    onChange={() => handleCategoryChange("Droit des sociétés")}
                    label="Droit des sociétés"
                  />
                  <CheckboxItem 
                    id="droit-travail" 
                    checked={categories.includes("Droit du travail")} 
                    onChange={() => handleCategoryChange("Droit du travail")}
                    label="Droit du travail"
                  />
                  <CheckboxItem 
                    id="droit-penal" 
                    checked={categories.includes("Droit pénal")} 
                    onChange={() => handleCategoryChange("Droit pénal")}
                    label="Droit pénal"
                  />
                  <CheckboxItem 
                    id="droit-admin" 
                    checked={categories.includes("Droit administratif")} 
                    onChange={() => handleCategoryChange("Droit administratif")}
                    label="Droit administratif"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="location">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Pays & Langue</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Belgique">Belgique</SelectItem>
                  <SelectItem value="Luxembourg">Luxembourg</SelectItem>
                  <SelectItem value="Suisse">Suisse</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                <Label>Langue</Label>
                <div className="flex flex-wrap gap-2">
                  <CheckboxItem 
                    id="francais" 
                    checked={languages.includes("Français")} 
                    onChange={() => handleLanguageChange("Français")}
                    label="Français"
                  />
                  <CheckboxItem 
                    id="anglais" 
                    checked={languages.includes("Anglais")} 
                    onChange={() => handleLanguageChange("Anglais")}
                    label="Anglais"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="relevance">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Pertinence & Citations</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Pertinence minimale</Label>
                  <span className="text-sm">{relevanceThreshold[0]}%</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={relevanceThreshold}
                  onValueChange={setRelevanceThreshold}
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Nombre minimum de citations</Label>
                  <span className="text-sm">{citationsThreshold[0]}</span>
                </div>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={citationsThreshold}
                  onValueChange={setCitationsThreshold}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort">
          <AccordionTrigger className="py-2">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              <span>Tri & Affichage</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label>Trier par</Label>
                <RadioGroup value={sortOption} onValueChange={setSortOption} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="relevance" id="relevance" />
                    <Label htmlFor="relevance">Pertinence</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="date-desc" id="date-desc" />
                    <Label htmlFor="date-desc">Date (récent d'abord)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="date-asc" id="date-asc" />
                    <Label htmlFor="date-asc">Date (ancien d'abord)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="citations" id="citations" />
                    <Label htmlFor="citations">Nombre de citations</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="max-results" className="flex items-center">
                    Nombre maximum de résultats
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Limite le nombre de résultats par source</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <span className="text-sm">{maxResults}</span>
                </div>
                <Slider
                  id="max-results"
                  min={10}
                  max={100}
                  step={5}
                  value={[maxResults]}
                  onValueChange={(value) => setMaxResults(value[0])}
                  className="mt-2"
                />
              </div>
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
