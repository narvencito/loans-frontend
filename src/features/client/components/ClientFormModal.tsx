import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    document: string;
    email: string;
    phone: string;
    address: string;
  }) => void;
}

const ClientFormModal = ({ open, onClose, onCreate }: Props) => {
  const [form, setForm] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full bg-white">
        <DialogHeader>
          <DialogTitle>Registrar nuevo cliente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Nombre completo</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ej: Juan Pérez"
              value={form.name}
              onChange={handleChange}
              className="border border-primary rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="document" className="block text-sm font-medium mb-1">Documento de identidad</label>
            <input
              id="document"
              name="document"
              type="text"
              placeholder="DNI / Cédula"
              value={form.document}
              onChange={handleChange}
              className="border border-primary rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Ej: correo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              className="border border-primary rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              id="phone"
              name="phone"
              type="text"
              placeholder="Ej: 987654321"
              value={form.phone}
              onChange={handleChange}
              className="border border-primary rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1">Dirección</label>
            <input
              id="address"
              name="address"
              type="text"
              placeholder="Ej: Calle 123, Ciudad"
              value={form.address}
              onChange={handleChange}
              className="border border-primary rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={() => onCreate(form)}>
            Crear
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientFormModal;
