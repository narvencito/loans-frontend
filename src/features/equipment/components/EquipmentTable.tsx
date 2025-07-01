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
import { Edit, Trash2 } from "lucide-react";
import TruncatedWithTooltip from "@/components/common/TruncatedWithTooltip";
import Pagination from "@/shared/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { EQUIPMENT_USAGE_TYPE_LABELS } from "../model/equipment.types";

interface Props {
  equipos: EquipmentItem[];
  onDelete: (id: string) => void;
  onEdit: (item: EquipmentItem) => void;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(price);
};

const formatNumber = (num: string | number | undefined) => {
  if (!num) return '-';
  const numStr = String(num);
  return numStr.length >= 6 ? numStr : '0'.repeat(6 - numStr.length) + numStr;
};

// Mapa de traducción de estados
const statusTranslations: { [key: string]: string } = {
  'AVAILABLE': 'Disponible',
  'IN_USE': 'En Uso',
  'UNDER_MAINTENANCE': 'En Mantenimiento',
  'OUT_OF_SERVICE': 'Fuera de Servicio',
  'RESERVED': 'Reservado',
  'PENDING_RETURN': 'Pendiente de Devolución',
  'LOST': 'Perdido',
  'DAMAGED': 'Dañado',
  'NEW': 'Nuevo',
  'USED': 'Usado',
  'REFURBISHED': 'Reacondicionado'
};

const getStatusTranslation = (statusName: string) => {
  const normalizedStatus = statusName.toUpperCase().replace(/ /g, '_');
  return statusTranslations[normalizedStatus] || statusName;
};

const EquipmentTable = ({ 
  equipos = [], 
  onDelete, 
  onEdit,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange
}: Props) => {
  return (
    <div className="flex flex-col">
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="text-muted-foreground">
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Perfil de uso</TableHead>
                <TableHead>Tipo de uso</TableHead>
                <TableHead className="text-right">Precio venta</TableHead>
                <TableHead className="text-right">Tarifa diaria</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-foreground">{item.code}</TableCell>
                  <TableCell className="text-foreground">
                    <TruncatedWithTooltip text={item.name}  />
                  </TableCell>
                  <TableCell className="text-foreground">{item.brandRelation?.name || '-'}</TableCell>
                  <TableCell className="text-foreground">{item.category?.name || '-'}</TableCell>
                  <TableCell className="text-foreground">{item.generalCategory?.name || '-'}</TableCell>
                  <TableCell className="text-foreground">{item.usageTypeName || '-'}</TableCell>
                  <TableCell className="text-foreground text-right">{formatPrice(item.salePrice)}</TableCell>
                  <TableCell className="text-foreground text-right">{formatPrice(item.rentalDailyRate)}</TableCell>
                  <TableCell className="text-center">
                    <span className={`text-green-600`}>
                      {getStatusTranslation(item.statusName)}
                    </span>
                  </TableCell>
                  <TableCell className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {equipos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No hay equipos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      {equipos.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
};

export default EquipmentTable;
