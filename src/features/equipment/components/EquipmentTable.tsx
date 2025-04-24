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

interface Props {
  equipos: EquipmentItem[];
  onDelete: (id: string) => void;
  onEdit: (item: EquipmentItem) => void;
}

const EquipmentTable = ({ equipos, onDelete, onEdit }: Props) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
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
    </div>
  );
};

export default EquipmentTable;
