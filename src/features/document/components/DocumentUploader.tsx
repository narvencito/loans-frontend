import { useState } from 'react';
import FileDropzone from '@/shared/components/FileDropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentEntityType, UploadDocumentDto } from '../types/document.types';
import { documentApi } from '../api/document_api';
import { Loader2, Upload } from 'lucide-react';

interface Props {
  entityType: DocumentEntityType;
  entityId: string;
  onUploadComplete: () => void;
  maxFileSize?: number; // en bytes
  allowedFileTypes?: string[]; // array de mime types
}

export const DocumentUploader = ({
  entityType,
  entityId,
  onUploadComplete,
  maxFileSize = 5 * 1024 * 1024, // 5MB por defecto
  allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileDrop = (files: File[]) => {
    setError(null);
    const selectedFile = files[0];

    // Validar tipo de archivo
    if (!allowedFileTypes.includes(selectedFile.type)) {
      setError('Tipo de archivo no permitido');
      return;
    }

    // Validar tamaño
    if (selectedFile.size > maxFileSize) {
      setError(`El archivo excede el tamaño máximo permitido (${maxFileSize / 1024 / 1024}MB)`);
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);

      const uploadData: UploadDocumentDto = {
        file,
        entityType,
        entityId,
        description: description.trim() || undefined
      };

      await documentApi.upload(uploadData);
      
      // Limpiar el formulario
      setFile(null);
      setDescription('');
      
      // Notificar que la carga se completó
      onUploadComplete();
    } catch (error) {
      console.error('Error al subir el documento:', error);
      setError('Error al subir el documento. Por favor, intente nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="space-y-2">
        <Label>Documento</Label>
        <FileDropzone
          onDrop={handleFileDrop}
          accept={allowedFileTypes.join(',')}
          maxSize={maxFileSize}
          file={file}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ingrese una descripción para el documento"
          disabled={isUploading}
        />
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subiendo...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Subir Documento
          </>
        )}
      </Button>
    </div>
  );
}; 