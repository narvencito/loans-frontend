import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RequestTypeEnum } from '@/shared/enums/request-type.enum';

interface Props {
  value?: RequestTypeEnum | null;
  onChange: (value: RequestTypeEnum | null) => void;
  label?: string;
  disabled?: boolean;
}

const RequestTypeSelect = ({
  value = null,
  onChange,
  label = 'Tipo de solicitud',
  disabled = false,
}: Props) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <Label className="text-sm">{label}</Label>

      <Select
        value={value ?? 'all'}
        onValueChange={(val) =>
          onChange(val === 'all' ? null : (val as RequestTypeEnum))
        }
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Seleccione..." />
        </SelectTrigger>

        <SelectContent className="bg-white">
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value={RequestTypeEnum.CASH}>Préstamo monetario</SelectItem>
          <SelectItem value={RequestTypeEnum.EQUIPMENT_LOAN}>Préstamo de equipo</SelectItem>
          <SelectItem value={RequestTypeEnum.EQUIPMENT_FINANCING}>Financiamiento de equipo</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default RequestTypeSelect;
