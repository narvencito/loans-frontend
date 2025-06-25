import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Brand, brandApi } from '../api/brand_api';
import BrandTable from '../components/BrandTable';
import BrandFormModal from '../components/BrandFormModal';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

const AdminBrandPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | undefined>();

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await brandApi.getAll();
      setBrands(data);
    } catch (error) {
      console.error('Error al cargar marcas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleCreate = async (data: { name: string }) => {
    try {
      await brandApi.create(data);
      setShowModal(false);
      loadBrands();
    } catch (error) {
      console.error('Error al crear marca:', error);
    }
  };

  const handleEdit = async (data: { name: string }) => {
    if (!selectedBrand) return;
    try {
      await brandApi.update(selectedBrand.id, data);
      setShowModal(false);
      setSelectedBrand(undefined);
      loadBrands();
    } catch (error) {
      console.error('Error al actualizar marca:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await showConfirm(
      '¿Estás seguro de eliminar esta marca?',
      'Esta acción no eliminará la marca permanentemente, pero la desactivará.'
    );
    if (!isConfirmed) return;

    try {
      await brandApi.delete(id);
      loadBrands();
    } catch (error) {
      console.error('Error al eliminar marca:', error);
    }
  };

  const handleRestore = async (id: string) => {
    const isConfirmed = await showConfirm(
      '¿Estás seguro de restaurar esta marca?',
      'Esta acción volverá a activar la marca.'
    );
    if (!isConfirmed) return;

    try {
      await brandApi.restore(id);
      loadBrands();
    } catch (error) {
      console.error('Error al restaurar marca:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <Button
          onClick={() => {
            setSelectedBrand(undefined);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Nueva marca
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando...</span>
        </div>
      ) : brands.length === 0 ? (
        <p className="text-center text-gray-500">No hay marcas registradas</p>
      ) : (
        <BrandTable
          brands={brands}
          onEdit={(brand) => {
            setSelectedBrand(brand);
            setShowModal(true);
          }}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      )}

      <BrandFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedBrand(undefined);
        }}
        onSubmit={selectedBrand ? handleEdit : handleCreate}
        brand={selectedBrand}
      />
    </div>
  );
};

export default AdminBrandPage; 