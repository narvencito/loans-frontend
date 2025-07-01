import { useEffect, useRef, useState } from 'react';
import { Document, DocumentEntityType } from '../types/document.types';
import { documentApi } from '../api/document_api';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2, Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/shared/utils/dateUtils';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

interface Props {
  entityType: DocumentEntityType;
  entityId: string;
  onDelete?: () => void;
}

export const DocumentList = ({
  entityType,
  entityId,
  onDelete
}: Props) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  // Refs para el scroll infinito
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const loadDocuments = async (page: number) => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const response = await documentApi.getByFilter({
        entityType,
        entityId,
        search: search || undefined,
        page,
        limit
      });

      if (page === 1) {
        setDocuments(response.items);
      } else {
        setDocuments(prev => [...prev, ...response.items]);
      }

      setHasMore(response.items.length === limit);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Configurar el observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          loadDocuments(currentPage + 1);
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
  }, [documents]);

  // Cargar documentos inicialmente y cuando cambie la búsqueda
  useEffect(() => {
    setDocuments([]);
    setCurrentPage(1);
    setHasMore(true);
    loadDocuments(1);
  }, [search, entityType, entityId]);

  const handleDownload = async (document: Document) => {
    try {
      const blob = await documentApi.download(document.id);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.fileName;
      window.document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el documento:', error);
    }
  };

  const handleDelete = async (document: Document) => {
    const isConfirmed = await showConfirm(
      'Eliminar documento',
      '¿Está seguro que desea eliminar este documento?'
    );

    if (!isConfirmed) return;

    try {
      await documentApi.delete(document.id);
      setDocuments(prev => prev.filter(d => d.id !== document.id));
      onDelete?.();
    } catch (error) {
      console.error('Error al eliminar el documento:', error);
    }
  };

  const handleView = (document: Document) => {
    window.open(document.fileUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar documentos..."
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <FileText className="h-6 w-6 text-blue-500" />
              <div>
                <h4 className="font-medium">{doc.fileName}</h4>
                <p className="text-sm text-gray-500">
                  {doc.description || 'Sin descripción'}
                </p>
                <p className="text-xs text-gray-400">
                  Subido el {formatDate(doc.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleView(doc)}
              >
                Ver
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(doc)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(doc)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}

        {/* Elemento para el scroll infinito */}
        <div ref={loadingRef} className="w-full py-4 flex justify-center">
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando más documentos...</span>
            </div>
          )}
        </div>

        {/* Mensaje cuando no hay documentos */}
        {documents.length === 0 && !isLoading && (
          <div className="text-center text-gray-500 py-8">
            No se encontraron documentos.
          </div>
        )}
      </div>
    </div>
  );
}; 