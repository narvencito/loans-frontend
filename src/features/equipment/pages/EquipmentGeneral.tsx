import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicEquipmentItem, equipmentPublicApi } from '../api/equipmentPublicApi';
import ProductGrid from '../components/general/ProductGrid';
import SidebarFilters from '../components/general/SidebarFilters';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import DrawerApp from '@/shared/components/DrawerApp';

const EquipmentGeneral = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipment, setEquipment] = useState<PublicEquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Estados para los filtros
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brands')?.split(',').filter(Boolean) || []
  );
  const [selectedGeneralCategories, setSelectedGeneralCategories] = useState<string[]>(
    searchParams.get('generalCategories')?.split(',').filter(Boolean) || []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categories')?.split(',').filter(Boolean) || []
  );
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const filters = {
        search: search || undefined,
        brandIds: selectedBrands.length > 0 ? selectedBrands : undefined,
        generalCategoryIds: selectedGeneralCategories.length > 0 ? selectedGeneralCategories : undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        status: 'active' // Solo mostrar equipos activos
      };

      const data = await equipmentPublicApi.getByFilter(filters);
      setEquipment(data);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
    if (selectedGeneralCategories.length > 0) params.set('generalCategories', selectedGeneralCategories.join(','));
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    setSearchParams(params);
  }, [search, selectedBrands, selectedGeneralCategories, selectedCategories, minPrice, maxPrice]);

  // Cargar equipos cuando cambien los filtros
  useEffect(() => {
    loadEquipment();
  }, [search, selectedBrands, selectedGeneralCategories, selectedCategories, minPrice, maxPrice]);

  const handleSearch = () => {
    loadEquipment();
    setDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedBrands([]);
    setSelectedGeneralCategories([]);
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setDrawerOpen(false);
  };

  const filters = (
    <SidebarFilters
      search={search}
      onSearchChange={setSearch}
      selectedBrands={selectedBrands}
      onBrandsChange={setSelectedBrands}
      selectedGeneralCategories={selectedGeneralCategories}
      onGeneralCategoriesChange={setSelectedGeneralCategories}
      selectedCategories={selectedCategories}
      onCategoriesChange={setSelectedCategories}
      minPrice={minPrice}
      onMinPriceChange={setMinPrice}
      maxPrice={maxPrice}
      onMaxPriceChange={setMaxPrice}
      onSearch={handleSearch}
      onClearFilters={handleClearFilters}
    />
  );

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Catálogo de Equipos</h1>
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros laterales en desktop */}
        <aside className="hidden md:block w-80">
          {filters}
        </aside>

        {/* Contenido principal */}
        <main className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2">Cargando...</span>
            </div>
          ) : equipment.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>No se encontraron equipos que coincidan con los filtros seleccionados.</p>
            </div>
          ) : (
            <ProductGrid products={equipment} />
          )}
        </main>
      </div>

      {/* Drawer para filtros en móvil */}
      <DrawerApp 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
      >
        <div className="p-4">
          {filters}
        </div>
      </DrawerApp>
    </div>
  );
};

export default EquipmentGeneral;
