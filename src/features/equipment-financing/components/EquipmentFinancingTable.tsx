// components/EquipmentFinancingTable.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Pagination from '@/shared/components/Pagination';
import { EquipmentFinancingItem } from '../api/equipment-financing-api';

interface Props {
  items: EquipmentFinancingItem[];
  onEdit: (item: EquipmentFinancingItem) => void;
  onDelete: (id: string) => void;
}

const EquipmentFinancingTable = ({ items, onEdit, onDelete }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginated = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead>Precio total</TableHead>
            <TableHead>Inicial</TableHead>
            <TableHead className="text-center">Activo</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.clientName}</TableCell>
              <TableCell>{item.equipmentName}</TableCell>
              <TableCell>S/ {item.totalPrice}</TableCell>
              <TableCell>S/ {item.downPayment}</TableCell>
              <TableCell className="text-center">
                <span className={item.isActive ? 'text-green-600' : 'text-red-600'}>
                  {item.isActive ? 'Sí' : 'No'}
                </span>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button size="sm" className="bg-blue-600 text-white" onClick={() => onEdit(item)}>
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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

export default EquipmentFinancingTable;
