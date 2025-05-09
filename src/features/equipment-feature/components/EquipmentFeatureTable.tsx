import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EquipmentFeature } from '../api/equipment-feature-api';
import Pagination from '@/shared/components/Pagination';

interface Props {
  data: EquipmentFeature[];
  onEdit: (feature: EquipmentFeature) => void;
  onDelete: (id: string) => void;
}

const EquipmentFeatureTable = ({ data, onEdit, onDelete }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>Nombre</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((feature) => (
            <TableRow key={feature.id} className="border-t">
              <TableCell>{feature.name}</TableCell>
              <TableCell>
                <span
                  className={`font-semibold text-sm ${feature.isActive ? 'text-green-600' : 'text-red-600'}`}
                >
                  {feature.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onEdit(feature)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  className={`${
                    feature.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                  } text-white`}
                  onClick={() => onDelete(feature.id)}
                >
                  {feature.isActive ? 'Inactivar' : 'Activar'}
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

export default EquipmentFeatureTable;
