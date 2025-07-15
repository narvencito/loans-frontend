import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Staff } from "../api/staff_api";
import { BlueButton, RedButton, GreenButton } from "@/components/common/ColorButtons";

interface Props {
  staff: Staff[];
  onEdit: (staff: Staff) => void;
  onToggleStatus: (id: string) => void;
}

export const StaffTable = ({ staff, onEdit, onToggleStatus }: Props) => {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="text-muted-foreground">
              <TableHead>Nombre</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((person) => (
              <TableRow key={person.id}>
                <TableCell className="font-medium">{person.name}</TableCell>
                <TableCell>{person.staff?.document}</TableCell>
                <TableCell>{person.email}</TableCell>
                <TableCell>{person.staff?.phone}</TableCell>
                <TableCell>{person.role?.name}</TableCell>
                <TableCell>
                  <span className={`text-${person.isActive ? 'green' : 'red'}-600`}>
                    {person.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <BlueButton
                    size="sm"
                    onClick={() => onEdit(person)}
                  >
                    Editar
                  </BlueButton>
                  {person.isActive ? (
                    <RedButton
                      size="sm"
                      onClick={() => onToggleStatus(person.id)}
                    >
                      Desactivar
                    </RedButton>
                  ) : (
                    <GreenButton
                      size="sm"
                      onClick={() => onToggleStatus(person.id)}
                    >
                      Activar
                    </GreenButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}; 