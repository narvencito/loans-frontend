import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onDrop: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  file?: File | null;
}

const FileDropzone = ({ onDrop, accept, maxSize, file }: Props) => {
  const handleDrop = useCallback((acceptedFiles: File[]) => {
    onDrop(acceptedFiles);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: accept ? { 'application/octet-stream': [accept] } : undefined,
    maxSize,
    multiple: false
  });

  if (file) {
    return (
      <div className="p-4 border-2 border-dashed rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">{file.name}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDrop([])}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      {isDragActive ? (
        <p className="mt-2 text-sm text-gray-600">Suelte el archivo aquí...</p>
      ) : (
        <div className="mt-2 text-sm text-gray-600">
          <p>Arrastre y suelte un archivo aquí, o</p>
          <p className="text-blue-500">haga clic para seleccionar</p>
          {accept && (
            <p className="mt-1 text-xs text-gray-500">
              Tipos permitidos: {accept}
            </p>
          )}
          {maxSize && (
            <p className="text-xs text-gray-500">
              Tamaño máximo: {(maxSize / 1024 / 1024).toFixed(1)}MB
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;
