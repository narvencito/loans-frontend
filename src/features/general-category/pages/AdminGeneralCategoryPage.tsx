import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { GeneralCategory, generalCategoryApi } from '../api/general_category_api';
import GeneralCategoryTable from '../components/GeneralCategoryTable';
import GeneralCategoryFormModal from '../components/GeneralCategoryFormModal';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

const AdminGeneralCategoryPage = () => {
  const [categories, setCategories] = useState<GeneralCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GeneralCategory | undefined>();

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await generalCategoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (data: { name: string }) => {
    try {
      await generalCategoryApi.create(data);
      setShowModal(false);
      loadCategories();
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  const handleEdit = async (data: { name: string }) => {
    if (!selectedCategory) return;
    try {
      await generalCategoryApi.update(selectedCategory.id, data);
      setShowModal(false);
      setSelectedCategory(undefined);
      loadCategories();
    } catch (error) {
      console.error('Error al actualizar categoría:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await showConfirm(
      '¿Estás seguro de eliminar este perfil de uso?',
      'Esta acción no eliminará el perfil permanentemente, pero lo desactivará.'
    );
    if (!isConfirmed) return;

    try {
      await generalCategoryApi.delete(id);
      loadCategories();
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  const handleRestore = async (id: string) => {
    const isConfirmed = await showConfirm(
      '¿Estás seguro de restaurar este perfil de uso?',
      'Esta acción volverá a activar el perfil.'
    );
    if (!isConfirmed) return;

    try {
      await generalCategoryApi.restore(id);
      loadCategories();
    } catch (error) {
      console.error('Error al restaurar categoría:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Perfiles de uso</h1>
        <Button
          onClick={() => {
            setSelectedCategory(undefined);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Nuevo perfil de uso
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando...</span>
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">No hay perfiles de uso registrados</p>
      ) : (
        <GeneralCategoryTable
          categories={categories}
          onEdit={(category) => {
            setSelectedCategory(category);
            setShowModal(true);
          }}
          onDelete={handleDelete}
          onRestore={handleRestore}
        />
      )}

      <GeneralCategoryFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedCategory(undefined);
        }}
        onSubmit={selectedCategory ? handleEdit : handleCreate}
        category={selectedCategory}
      />
    </div>
  );
};

export default AdminGeneralCategoryPage; 