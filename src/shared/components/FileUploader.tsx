import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // en MB
  multiple?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png',
  maxSize = 5,
  multiple = false
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, curr) => {
      acc[curr] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: maxSize * 1024 * 1024,
    multiple
  });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-gray-600">Suelta los archivos aquí...</p>
      ) : (
        <div className="space-y-2">
          <p className="text-gray-600">
            Arrastra y suelta archivos aquí, o
          </p>
          <Button type="button" variant="outline">
            Seleccionar Archivo{multiple ? 's' : ''}
          </Button>
          <p className="text-sm text-gray-500">
            Tamaño máximo: {maxSize}MB
          </p>
        </div>
      )}
    </div>
  );
}; 