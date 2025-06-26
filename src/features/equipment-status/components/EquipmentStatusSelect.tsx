import { useEffect, useState } from 'react';
import { EquipmentStatus, equipmentStatusApi } from '../api/equipment-status-api';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  showAll?: boolean;
}

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

const EquipmentStatusSelect = ({
  value,
  onChange,
  label = 'Estado',
  disabled = false,
  required = false,
  showAll = false
}: Props) => {
  const [options, setOptions] = useState<EquipmentStatus[]>([]);

  useEffect(() => {
    equipmentStatusApi.getAll().then(setOptions);
  }, []);

  const getStatusTranslation = (statusName: string) => {
    // Convertir el nombre del estado a mayúsculas y reemplazar espacios con guiones bajos
    const normalizedStatus = statusName.toUpperCase().replace(/ /g, '_');
    return statusTranslations[normalizedStatus] || statusName;
  };

  return (
    <ColumnApp className='w-full'>
      <LabelApp className="text-sm">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </LabelApp>

      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Seleccione..." />
        </SelectTrigger>

        <SelectContent className="select-white">
          {showAll && (
            <SelectItem value="all">Todos</SelectItem>
          )}
          {options.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {getStatusTranslation(s.name)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </ColumnApp>
  );
};

export default EquipmentStatusSelect;
