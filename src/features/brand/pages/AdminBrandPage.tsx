import { useEffect, useState } from 'react';
import { Brand, brandApi } from '../api/brand_api';
import BrandTable from '../components/BrandTable';
import BrandFormModal from '../components/BrandFormModal';
import { showConfirm } from '@/shared/utils/global-dialog-utils';
import { YellowButton } from '@/components/common/ColorButtons';

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

  const handleOpenCreate = () => {
    setSelectedBrand(undefined);
    setShowModal(true);
  };

  const handleSubmit = selectedBrand ? handleEdit : handleCreate;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Gestión de Marcas</h1>
        <YellowButton onClick={handleOpenCreate}>
          Registrar marca
        </YellowButton>
      </div>

      <BrandTable
        brands={brands}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />

      <BrandFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedBrand(undefined);
        }}
        onSubmit={handleSubmit}
        brand={selectedBrand}
      />
    </div>
  );
};

export default AdminBrandPage; 