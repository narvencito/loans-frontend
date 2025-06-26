import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PublicBrandCheckboxList from './PublicBrandCheckboxList';
import PublicGeneralCategoryCheckboxList from './PublicGeneralCategoryCheckboxList';
import PublicEquipmentCategoryCheckboxList from './PublicEquipmentCategoryCheckboxList';

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
  onSearch,
  onClearFilters
}: Props) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Filtros</h2>
      
      <div className="space-y-6">
        {/* Búsqueda */}
        <div className="space-y-2">
          <Label>Búsqueda</Label>
          <Input
            type="text"
            placeholder="Buscar equipos..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Accordion type="multiple" className="w-full">
          {/* Marca */}
          <AccordionItem value="brand">
            <AccordionTrigger>Marca</AccordionTrigger>
            <AccordionContent>
              <PublicBrandCheckboxList
                selectedBrands={selectedBrands}
                onChange={onBrandsChange}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Perfil de uso */}
          <AccordionItem value="generalCategory">
            <AccordionTrigger>Perfil de uso</AccordionTrigger>
            <AccordionContent>
              <PublicGeneralCategoryCheckboxList
                selectedCategories={selectedGeneralCategories}
                onChange={onGeneralCategoriesChange}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Categoría */}
          <AccordionItem value="category">
            <AccordionTrigger>Categoría</AccordionTrigger>
            <AccordionContent>
              <PublicEquipmentCategoryCheckboxList
                selectedCategories={selectedCategories}
                onChange={onCategoriesChange}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Rango de precios */}
          <AccordionItem value="price">
            <AccordionTrigger>Rango de precios</AccordionTrigger>
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
            className="w-full"
          >
            Aplicar filtros
          </Button>
          <Button 
            onClick={onClearFilters}
            variant="outline"
            className="w-full"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PublicSidebarFilters; 