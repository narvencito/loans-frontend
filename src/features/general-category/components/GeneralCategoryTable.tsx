import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GeneralCategory } from '../types/general-category.types';
import { formatDate } from '@/shared/utils/dateUtils';
import Pagination from '@/shared/components/Pagination';

interface Props {
  categories: GeneralCategory[];
  onEdit: (category: GeneralCategory) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

const GeneralCategoryTable = ({ categories, onEdit, onDelete, onRestore }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(categories.length / pageSize);
  const paginatedCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Nombre</TableHead>
            <TableHead>Fecha de creación</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCategories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.createdAt ? formatDate(category.createdAt) : '-'}</TableCell>
              <TableCell className="text-center">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  category.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {category.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onEdit(category)}
                >
                  Editar
                </Button>
                {category.isActive ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(category.id)}
                  >
                    Eliminar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => onRestore(category.id)}
                  >
                    Restaurar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        total={categories.length}
        page={currentPage}
        limit={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default GeneralCategoryTable; 