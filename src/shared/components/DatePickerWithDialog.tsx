import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DatePickerWithDialogProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const DatePickerWithDialog = ({
  value,
  onChange,
  placeholder = 'DD/MM/YYYY'
}: DatePickerWithDialogProps) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | undefined>(value ? new Date(value) : undefined);

  const handleSelect = (date: Date | undefined) => {
    setTempDate(date);
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          value={value ? format(new Date(value), 'dd/MM/yyyy') : ''}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-3 pr-10" // Espacio para el icono
          onFocus={() => setOpen(true)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setOpen(true)}
        >
          <CalendarIcon className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-white">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={handleSelect}
            locale={es}
            className="rounded-md"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DatePickerWithDialog; 