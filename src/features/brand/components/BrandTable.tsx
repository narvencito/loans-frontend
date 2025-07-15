import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Brand } from '../api/brand_api';
import { formatDate } from '@/shared/utils/dateUtils';
import Pagination from '@/shared/components/Pagination';
import { BlueButton, GreenButton, RedButton } from '@/components/common/ColorButtons';

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
                    <BlueButton
                      size="sm"
                      onClick={() => onEdit(brand)}
                    >
                      Editar
                    </BlueButton>
                    {brand.isActive ? (
                      <RedButton
                        size="sm"
                        onClick={() => onDelete(brand.id)}
                      >
                        Eliminar
                      </RedButton>
                    ) : (
                      <GreenButton
                        size="sm"
                        onClick={() => onRestore(brand.id)}
                      >
                        Restaurar
                      </GreenButton>
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