import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicEquipmentItem, equipmentPublicApi } from '../api/equipmentPublicApi';
import ProductGrid from '../components/general/ProductGrid';
import PublicSidebarFilters from '../components/general/PublicSidebarFilters';
import { Button } from '@/components/ui/button';
import { Menu, Loader2 } from 'lucide-react';
import DrawerApp from '@/shared/components/DrawerApp';
import { EquipmentUsageType } from '../model/equipment.types';

const EquipmentGeneral = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipment, setEquipment] = useState<PublicEquipmentItem[]>([]);  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12; // Tamaño fijo por página

  // Ref para el observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  // Estados para los filtros
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.getAll('brandIds') || []
  );
  const [selectedGeneralCategories, setSelectedGeneralCategories] = useState<string[]>(
    searchParams.getAll('generalCategoryIds') || []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll('categoryIds') || []
  );
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [selectedUsageType, setSelectedUsageType] = useState<EquipmentUsageType | 'all'>(
    (searchParams.get('usageType') as EquipmentUsageType) || 'all'
  );

  // Efecto para cargar equipos inicialmente y cuando cambien los filtros
  useEffect(() => {
    handleResetAndLoad();
  }, [
    search,
    selectedBrands,
    selectedGeneralCategories,
    selectedCategories,
    minPrice,
    maxPrice,
    selectedUsageType
  ]);

  // Efecto para manejar el filtro de usageType desde la URL
  useEffect(() => {
    const usageType = searchParams.get('usageType');
    if (usageType && Object.values(EquipmentUsageType).includes(usageType as EquipmentUsageType)) {
      setSelectedUsageType(usageType as EquipmentUsageType);
    }
  }, [searchParams]);

  const loadEquipment = async (page: number) => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const filters = {
        name: search || undefined,
        brandIds: selectedBrands.length > 0 ? selectedBrands : undefined,
        generalCategoryIds: selectedGeneralCategories.length > 0 ? selectedGeneralCategories : undefined,
        categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        statusId: 'active',
        usageType: selectedUsageType === 'all' ? undefined : selectedUsageType,
        page,
        limit
      };

      const response = await equipmentPublicApi.getByFilter(filters);
      
      if (page === 1) {
        setEquipment(response.items);
      } else {
        setEquipment(prev => [...prev, ...response.items]);
      }
      
      setHasMore(response.items.length === limit);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error al cargar equipos:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para resetear y cargar desde el principio
  const handleResetAndLoad = useCallback(() => {
    setEquipment([]);
    setCurrentPage(1);
    setHasMore(true);
    loadEquipment(1);
  }, [search, selectedBrands, selectedGeneralCategories, selectedCategories, minPrice, maxPrice, selectedUsageType]);

  // Configurar el observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadEquipment(currentPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;

    return () => observer.disconnect();
  }, [isLoading, hasMore, currentPage]);

  // Observar el elemento de carga
  useEffect(() => {
    const currentObserver = observerRef.current;
    const loadingElement = loadingRef.current;

    if (currentObserver && loadingElement) {
      currentObserver.observe(loadingElement);
    }

    return () => {
      if (currentObserver && loadingElement) {
        currentObserver.unobserve(loadingElement);
      }
    };
  }, [equipment]);

  const handleSearch = () => {
    handleResetAndLoad();
    setDrawerOpen(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedBrands([]);
    setSelectedGeneralCategories([]);
    setSelectedCategories([]);
    setMinPrice('');
    setMaxPrice('');
    setSelectedUsageType('all');
    setDrawerOpen(false);
    handleResetAndLoad();
  };

  const filters = (
    <PublicSidebarFilters
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
      selectedUsageType={selectedUsageType}
      onUsageTypeChange={setSelectedUsageType}
      onSearch={handleSearch}
      onClearFilters={handleClearFilters}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="h-20 flex items-center justify-between fixed top-10 left-0 right-0 bg-white z-10 border-b px-4">
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

        <div className="flex pt-40">
          {/* Filtros laterales en desktop */}
          <aside className="hidden md:block w-80 fixed top-40 bottom-0 overflow-auto pr-4">
            {filters}
          </aside>

          {/* Contenido principal */}
          <main className="flex-1 md:ml-80">
            {equipment.length === 0 && !isLoading ? (
              <div className="text-center text-gray-500">
                <p>No se encontraron equipos que coincidan con los filtros seleccionados.</p>
              </div>
            ) : (
              <>
                <ProductGrid products={equipment} />
                <div ref={loadingRef} className="w-full py-8 flex justify-center">
                  {isLoading && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Cargando más equipos...</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
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
