import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { GeneralCategory } from '../api/general_category_api';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
  category?: GeneralCategory;
}

const GeneralCategoryFormModal = ({ open, onClose, onSubmit, category }: Props) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName('');
    }
    setError(null);
  }, [category, open]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('El nombre es requerido');
      return;
    }
    onSubmit({ name: name.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Editar perfil de uso' : 'Nuevo perfil de uso'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingrese el nombre"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {category ? 'Guardar cambios' : 'Crear'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeneralCategoryFormModal; 