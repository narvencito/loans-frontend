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
  onViewSchedule: (id: string) => void;
}

const EquipmentFinancingTable = ({ items, onEdit, onDelete, onViewSchedule }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginatedItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>Cliente</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead>Precio Total</TableHead>
            <TableHead>Inicial</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="text-foreground">{item.clientName}</TableCell>
              <TableCell className="text-foreground">{item.equipmentName}</TableCell>
              <TableCell className="text-foreground">S/ {item.totalPrice}</TableCell>
              <TableCell className="text-foreground">S/ {item.downPayment}</TableCell>
              <TableCell className="text-foreground">
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-center">
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  item.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onViewSchedule(item.id)}
                >
                  Cronograma
                </Button>
                <Button
                  size="sm"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  onClick={() => onEdit(item)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => onDelete(item.id)}
                >
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
