import { EquipmentStatus } from "../api/equipment-status-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  data: EquipmentStatus[];
  onEdit: (status: EquipmentStatus) => void;
  onDelete: (id: string) => void;
}

const EquipmentStatusTable = ({ data, onEdit, onDelete }: Props) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>Nombre</TableHead>
            <TableHead className="text-center">Activo</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="text-foreground">{s.name}</TableCell>
              <TableCell className="text-center">
                <span className={s.isActive ? "text-green-600" : "text-red-600"}>
                  {s.isActive ? "Sí" : "No"}
                </span>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onEdit(s)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(s.id)}
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

export default EquipmentStatusTable;
