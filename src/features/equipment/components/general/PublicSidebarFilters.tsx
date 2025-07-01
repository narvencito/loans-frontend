import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PublicBrandCheckboxList from './PublicBrandCheckboxList';
import PublicGeneralCategoryCheckboxList from './PublicGeneralCategoryCheckboxList';
import PublicEquipmentCategoryCheckboxList from './PublicEquipmentCategoryCheckboxList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EquipmentUsageType, EQUIPMENT_USAGE_TYPE_LABELS } from '../../model/equipment.types';
import { ScrollArea } from "@/components/ui/scroll-area";
import EquipmentUsageTypeCheckboxList from "../EquipmentUsageTypeCheckboxList";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  selectedBrands: string[];
  onBrandsChange: (value: string[]) => void;
  selectedGeneralCategories: string[];
  onGeneralCategoriesChange: (value: string[]) => void;
  selectedCategories: string[];
  onCategoriesChange: (value: string[]) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  selectedUsageType: EquipmentUsageType | 'all';
  onUsageTypeChange: (value: EquipmentUsageType | 'all') => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

const PublicSidebarFilters = ({
  search,
  onSearchChange,
  selectedBrands,
  onBrandsChange,
  selectedGeneralCategories,
  onGeneralCategoriesChange,
  selectedCategories,
  onCategoriesChange,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  selectedUsageType,
  onUsageTypeChange,
  onSearch,
  onClearFilters
}: Props) => {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-xl font-semibold mb-4">Filtros de Búsqueda</h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="usageType" className="border-b">
          <AccordionTrigger className="hover:no-underline hover:bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="text-sm font-medium">Tipo de Uso</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3 pt-1">
            <EquipmentUsageTypeCheckboxList
              selectedUsageType={selectedUsageType}
              onChange={onUsageTypeChange}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="hover:no-underline hover:bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="text-sm font-medium">Marca</span>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[200px] pr-4">
              <PublicBrandCheckboxList
                selectedBrands={selectedBrands}
                onChange={onBrandsChange}
              />
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="generalCategory">
          <AccordionTrigger className="hover:no-underline hover:bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="text-sm font-medium">Perfil de uso</span>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[200px] pr-4">
              <PublicEquipmentCategoryCheckboxList
                selectedCategories={selectedCategories}
                onChange={onCategoriesChange}
              />
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger className="hover:no-underline hover:bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="text-sm font-medium">Categoría</span>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-[200px] pr-4">
              <PublicGeneralCategoryCheckboxList
                selectedCategories={selectedGeneralCategories}
                onChange={onGeneralCategoriesChange}
              />
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="hover:no-underline hover:bg-gray-100 px-4 py-2 flex justify-between items-center">
            <span className="text-sm font-medium">Rango de precios</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Precio mínimo"
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
                min={0}
              />
              <Input
                type="number"
                placeholder="Precio máximo"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                min={0}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="space-y-2 pt-4">
        <Button 
          onClick={onSearch}
          className="w-full bg-yellow-500 hover:bg-yellow-600"
        >
          Aplicar filtros
        </Button>
        <Button 
          onClick={onClearFilters}
          className="w-full"
        >
          Limpiar filtros
        </Button>
      </div>
    </div>
  );
};

export default PublicSidebarFilters; 