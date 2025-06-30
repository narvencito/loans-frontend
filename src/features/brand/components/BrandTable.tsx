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
import { Brand } from '../api/brand_api';
import { formatDate } from '@/shared/utils/dateUtils';
import Pagination from '@/shared/components/Pagination';

interface Props {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

const BrandTable = ({ brands, onEdit, onDelete, onRestore }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(brands.length / pageSize);
  const paginatedBrands = brands.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col">
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-muted-foreground">
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha de creación</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBrands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell className="text-foreground">{brand.name}</TableCell>
                  <TableCell className="text-foreground">{formatDate(brand.createdAt)}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-${brand.isActive ? 'green' : 'red'}-600`}>
                      {brand.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => onEdit(brand)}
                    >
                      Editar
                    </Button>
                    {brand.isActive ? (
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => onDelete(brand.id)}
                      >
                        Eliminar
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => onRestore(brand.id)}
                      >
                        Restaurar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default BrandTable; 