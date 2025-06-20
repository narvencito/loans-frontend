import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RequestItem } from '../api/request_api';

interface Props {
  requests: RequestItem[];
  onView?: (request: RequestItem) => void;
}

const RequestTable = ({ requests, onView }: Props) => {
  return (
    <div className="rounded-md border overflow-hidden min-w-[600px] w-full">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground">
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-center">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.clientId}</TableCell>
              <TableCell>{r.requestType.name}</TableCell>
              <TableCell className="text-center">
                <span className="capitalize font-medium">
                  {r.requestStatus.code.replace('-', ' ')}
                </span>
              </TableCell>
              <TableCell>{r.equipmentId ? r.equipmentId : '-'}</TableCell>
              <TableCell>{new Date(r.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-center">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  onClick={() => onView?.(r)}
                >
                  Ver Detalle
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestTable;
