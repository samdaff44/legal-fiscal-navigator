
import { Filter, Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AdvancedFilters, { SearchFilters } from '@/components/AdvancedFilters';

interface ResultsActionsProps {
  query: string;
  sortOrder: string;
  handleSortChange: (value: string) => void;
  isFilterActive: boolean;
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  activeFilters: SearchFilters | null;
  handleApplyFilters: (filters: SearchFilters) => void;
  handleExportResults: () => void;
}

const ResultsActions = ({
  sortOrder,
  handleSortChange,
  isFilterActive,
  filtersOpen,
  setFiltersOpen,
  activeFilters,
  handleApplyFilters,
  handleExportResults
}: ResultsActionsProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex flex-wrap gap-3">
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Pertinence</SelectItem>
            <SelectItem value="date-desc">Date (récent)</SelectItem>
            <SelectItem value="date-asc">Date (ancien)</SelectItem>
            <SelectItem value="source">Source</SelectItem>
            <SelectItem value="citations">Citations</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant={isFilterActive ? "default" : "outline"} 
              className={`flex items-center gap-2 ${isFilterActive ? "bg-primary text-primary-foreground" : ""}`}
            >
              <Filter className="h-4 w-4" />
              <span>Filtres {isFilterActive ? "(actifs)" : ""}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <AdvancedFilters 
              onApplyFilters={handleApplyFilters}
              initialFilters={activeFilters || undefined}
            />
          </PopoverContent>
        </Popover>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleExportResults}
        >
          <Download className="h-4 w-4" />
          <span>Exporter</span>
        </Button>
      </div>
    </div>
  );
};

export default ResultsActions;
