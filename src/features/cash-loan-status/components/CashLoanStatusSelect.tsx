import { useEffect, useState } from 'react';
import { CashLoanStatus, CashLoanStatusApi } from '../api/cash-loan-status-api';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Props {
  value?: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  disabled?: boolean;
}

const CashLoanStatusSelect = ({
  value = null,
  onChange,
  label = 'Estado',
  disabled = false,
}: Props) => {
  const [options, setOptions] = useState<CashLoanStatus[]>([]);

  useEffect(() => {
    CashLoanStatusApi.getAll().then(setOptions);
  }, []);

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label className="text-sm">{label}</Label>

      <Select
        value={value ?? 'all'}
        onValueChange={(val) => onChange(val === '' ? null : val)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Seleccione..." />
        </SelectTrigger>

        <SelectContent className="bg-white">
          <SelectItem value="all">Todos</SelectItem> {/* Opción para limpiar */}
          {options.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CashLoanStatusSelect;
