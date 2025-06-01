import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EquipmentItem } from "../api/equipment_api";
import TruncatedWithTooltip from "@/components/common/TruncatedWithTooltip";
import Pagination from "@/shared/components/Pagination";
import { useState } from "react";

interface Props {
  equipos: EquipmentItem[];
  onDelete: (id: string) => void;
  onEdit: (item: EquipmentItem) => void;
}



const EquipmentTable = ({ equipos, onDelete, onEdit }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(equipos.length / pageSize);
  const paginated = equipos.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Características</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead className="text-center">Activo</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        
        <TableBody>
          {equipos.map((eq) => (
            <TableRow key={eq.id}>
              <TableCell>{eq.code}</TableCell>
              <TableCell>{eq.name}</TableCell>
              <TruncatedWithTooltip text={eq.features.map(f => f.name).join(" / ")} />
              <TableCell>{eq.categoryName}</TableCell>
              <TableCell>{eq.statusName}</TableCell>
              <TableCell>{eq.location || '-'}</TableCell>
              <TableCell className="text-center">
                <span className={eq.isActive ? 'text-green-600' : 'text-red-600'}>
                  {eq.isActive ? 'Sí' : 'No'}
                </span>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onEdit(eq)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(eq.id)}
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

export default EquipmentTable;
