import { FileRejection, useDropzone } from 'react-dropzone';
import { useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { ImageApp } from '@/features/equipment-feature/api/equipment-feature-api';
import { showConfirm } from '../utils/global-dialog-utils';
import { equipmentApi } from '@/features/equipment/api/equipment_api';

interface Props {
  existingFiles?: ImageApp[];
  onDrop: (files: File[]) => void;
  onRemoveExisting: (url: string) => void;
  onRemoveNew: (file: File) => void;
}

const MAX_IMAGES = 5;

const FileDropzone = ({ existingFiles = [], onDrop, onRemoveExisting, onRemoveNew }: Props) => {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const objectUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFiles]);

  const handleDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const validImages = acceptedFiles.filter(file =>
        file.type.startsWith('image/')
      );

      const totalCurrent = existingFiles.length + newFiles.length;
      const remainingSlots = MAX_IMAGES - totalCurrent;
   
      // ⚠️ Caso 1: no hay espacio para más imágenes
      if (remainingSlots <= 0) {
        setError(`Solo se permiten hasta ${MAX_IMAGES} imágenes en total.`);
        return;
      }
      const imagesToAdd = validImages.slice(0, remainingSlots);

      if (fileRejections.length > 0 || validImages.length > imagesToAdd.length) {
        setError(
          `Algunas imágenes fueron omitidas. Solo se permiten archivos de imagen y hasta ${MAX_IMAGES} en total.`
        );
      } else {
        setError(null);
      }

      // ✅ Agregar solo las válidas y permitidas
      if (imagesToAdd.length > 0) {
        setNewFiles(prev => {
          const updatedFiles = [...prev, ...imagesToAdd];
          return updatedFiles;
        });
        onDrop(imagesToAdd);
      }
    },
    [existingFiles, newFiles, onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const handleRemoveNew = (index: number) => {
    const fileToRemove = newFiles[index];
    setNewFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      onRemoveNew(fileToRemove);
      return updated;
    });
  };

  const handleRemoveExisting = async (id: string, url: string) => {
    const isConfirmed = await showConfirm('Eliminar imagen', '¿Estás seguro de que deseas eliminar esta imagen?');
    if (!isConfirmed) return;

    try {
      await equipmentApi.deleteImageByUrl(url);
      onRemoveExisting(url);
    } catch (err) {
      console.error(err);
      setError('Error al eliminar la imagen. Intenta nuevamente.');
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}

      <Card
        {...getRootProps()}
        className={`p-2 flex items-center justify-center border-dashed border-2 rounded-md text-center cursor-pointer 
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-muted'}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Label className="text-sm text-center">Arrastra imágenes aquí o haz clic para subir (máx. {MAX_IMAGES})</Label>
          <Button variant="secondary">Seleccionar imágenes</Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {existingFiles.map((img) => (
          <div key={img.id} className="relative">
            <img src={img.url} alt="imagen" className="h-24 w-full object-cover rounded" />
            <button
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              onClick={() => handleRemoveExisting(img.id, img.url)}
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {newFiles.map((file, idx) => (
          <div key={idx} className="relative">
            <img src={previews[idx]} alt={file.name} className="h-24 w-full object-cover rounded" />
            <button
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              onClick={() => handleRemoveNew(idx)}
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDropzone;
