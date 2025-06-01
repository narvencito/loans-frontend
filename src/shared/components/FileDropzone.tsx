import { FileRejection, useDropzone } from 'react-dropzone';
import { useCallback, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, X } from 'lucide-react';
import { ImageApp } from '@/features/equipment-feature/api/equipment-feature-api';

interface Props {
  existingImages?: ImageApp[];
  onChange: (files: File[], keptImages: ImageApp[]) => void;
}

const MAX_IMAGES = 5;

const FileDropzone = ({ existingImages = [], onChange }: Props) => {
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [existing, setExisting] = useState<ImageApp[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setExisting(existingImages);
  }, [existingImages]);

  useEffect(() => {
    const objectUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFiles]);

  useEffect(() => {
    onChange(newFiles, existing);
  }, [newFiles, existing, onChange]);

const onDrop = useCallback(
  (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    const validImages = acceptedFiles.filter(file =>
      file.type.startsWith('image/')
    );

    const totalCurrent = existing.length + newFiles.length;
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
      setNewFiles(prev => [...prev, ...imagesToAdd]);
    }
  },
  [existing, newFiles]
);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
    //maxFiles: MAX_IMAGES,
  });

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id: string) => {
    setExisting((prev) => prev.filter((img) => img.id !== id));
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
        {existing.map((img) => (
          <div key={img.id} className="relative">
            <img src={img.url} alt="imagen" className="h-24 w-full object-cover rounded" />
            <button
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              onClick={() => removeExistingImage(img.id)}
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
              onClick={() => removeNewFile(idx)}
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
