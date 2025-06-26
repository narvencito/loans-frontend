import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicEquipmentItem, equipmentPublicApi } from '../api/equipmentPublicApi';
import ProductGrid from '../components/general/ProductGrid';
import PublicSidebarFilters from '../components/general/PublicSidebarFilters';
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
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brandId') || '');
  const [selectedGeneralCategory, setSelectedGeneralCategory] = useState<string>(
    searchParams.get('generalCategoryId') || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('categoryId') || ''
  );
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');

  const loadEquipment = async () => {
    setLoading(true);
    try {
      const filters = {
        name: search || undefined,
        brandId: selectedBrand === 'all' ? undefined : selectedBrand || undefined,
        generalCategoryId: selectedGeneralCategory === 'all' ? undefined : selectedGeneralCategory || undefined,
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        statusId: 'active' // Solo mostrar equipos activos
      };

      const data = await equipmentPublicApi.getByFilter(filters);
      setEquipment(data);

      // Actualizar URL después de una búsqueda exitosa
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedBrand && selectedBrand !== 'all') params.set('brandId', selectedBrand);
      if (selectedGeneralCategory && selectedGeneralCategory !== 'all') params.set('generalCategoryId', selectedGeneralCategory);
      if (selectedCategory && selectedCategory !== 'all') params.set('categoryId', selectedCategory);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      setSearchParams(params);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar equipos inicialmente
  useEffect(() => {
    loadEquipment();
  }, []); // Solo se ejecuta al montar el componente

  const handleSearch = () => {
    console.log("busqueda de wquipos del lado publico");
    loadEquipment();
    setDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedGeneralCategory('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setDrawerOpen(false);
    loadEquipment(); // Cargar equipos después de limpiar filtros
  };

  const filters = (
    <PublicSidebarFilters
      search={search}
      onSearchChange={setSearch}
      selectedBrand={selectedBrand}
      onBrandChange={setSelectedBrand}
      selectedGeneralCategory={selectedGeneralCategory}
      onGeneralCategoryChange={setSelectedGeneralCategory}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
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
