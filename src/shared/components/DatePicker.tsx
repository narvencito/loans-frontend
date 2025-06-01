'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

interface Props {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
}

export function DatePicker({ value, onChange, placeholder, label }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    if (date) setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'dd/MM/yyyy') : placeholder || 'Seleccionar fecha'}
        </Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-white overflow-hidden" style={{width:280}}>
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-base font-semibold">
            {label || 'Selecciona una fecha'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 pt-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            initialFocus
            className="w-full"
            modifiers={{ today: new Date() }}
            modifiersClassNames={{
              selected: 'bg-yellow-500 text-white',
              today: 'text-gray-400',
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
