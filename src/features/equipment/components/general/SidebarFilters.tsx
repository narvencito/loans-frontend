import { useEffect, useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import BrandCheckboxList from '@/features/brand/components/BrandCheckboxList';
import GeneralCategoryCheckboxList from '@/features/general-category/components/GeneralCategoryCheckboxList';
import EquipmentCategoryCheckboxList from '@/features/equipment-category/components/EquipmentCategoryCheckboxList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EquipmentUsageType, EQUIPMENT_USAGE_TYPE_LABELS } from '../../model/equipment.types';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  selectedGeneralCategories: string[];
  onGeneralCategoriesChange: (categories: string[]) => void;
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  minPrice: string;
  onMinPriceChange: (value: string) => void;
  maxPrice: string;
  onMaxPriceChange: (value: string) => void;
  selectedUsageType: EquipmentUsageType | '';
  onUsageTypeChange: (value: EquipmentUsageType | '') => void;
  onSearch: () => void;
  onClearFilters: () => void;
}

const SidebarFilters = ({
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
          {/* Tipo de Uso */}
          <AccordionItem value="usageType">
            <AccordionTrigger>Tipo de Uso</AccordionTrigger>
            <AccordionContent>
              <Select
                value={selectedUsageType}
                onValueChange={(value) => onUsageTypeChange(value as EquipmentUsageType | '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  {Object.entries(EQUIPMENT_USAGE_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AccordionContent>
          </AccordionItem>

          {/* Marca */}
          <AccordionItem value="brand">
            <AccordionTrigger>Marca</AccordionTrigger>
            <AccordionContent>
              <BrandCheckboxList
                selectedBrands={selectedBrands}
                onBrandsChange={onBrandsChange}
                label=""
              />
            </AccordionContent>
          </AccordionItem>

          {/* Perfil de uso */}
          <AccordionItem value="generalCategory">
            <AccordionTrigger>Perfil de uso</AccordionTrigger>
            <AccordionContent>
              <GeneralCategoryCheckboxList
                selectedCategories={selectedGeneralCategories}
                onCategoriesChange={onGeneralCategoriesChange}
                label=""
              />
            </AccordionContent>
          </AccordionItem>

          {/* Categoría */}
          <AccordionItem value="category">
            <AccordionTrigger>Categoría</AccordionTrigger>
            <AccordionContent>
              <EquipmentCategoryCheckboxList
                selectedCategories={selectedCategories}
                onCategoriesChange={onCategoriesChange}
                label=""
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
            className="w-full "
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarFilters;