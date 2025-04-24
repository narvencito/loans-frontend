import { EquipmentCategory } from "../api/equipment-category-api";
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
  data: EquipmentCategory[];
  onEdit: (category: EquipmentCategory) => void;
  onDelete: (id: string) => void;
}

const EquipmentCategoryTable = ({ data, onEdit, onDelete }: Props) => {
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
          {data.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="text-foreground">{c.name}</TableCell>
              <TableCell className="text-center">
                <span className={c.isActive ? 'text-green-600' : 'text-red-600'}>
                  {c.isActive ? 'Sí' : 'No'}
                </span>
              </TableCell>
              <TableCell className="text-center space-x-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => onEdit(c)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(c.id)}
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

export default EquipmentCategoryTable;
