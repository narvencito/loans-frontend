import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ClientItem } from '../api/client_api';

interface Props {
  clients: ClientItem[];
  onToggle: (id: string) => void;
}

const ClientTable = ({ clients, onToggle }: Props) => {
  return (
    <div className="rounded-md border overflow-hidden min-w-[600px] w-full">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>Nombre</TableHead>
            <TableHead>DNI</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="truncate max-w-[150px]">{c.name}</TableCell>
              <TableCell>{c.document}</TableCell>
              <TableCell className="truncate max-w-[180px]">{c.email}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell className="text-center">
                <span className={c.isActive ? 'text-green-600' : 'text-red-600'}>
                  {c.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  onClick={() => onToggle(c.id)}
                >
                  {c.isActive ? 'Desactivar' : 'Activar'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientTable;
