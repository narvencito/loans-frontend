import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import DialogApp from '@/shared/components/DialogApp';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';
import { Input } from '@/components/ui/input';

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
    <DialogApp
      open={open}
      onClose={onClose}
      onConfirm={() => onCreate(form)}
      maxWidth='md'
      title={"Registrar nuevo cliente"}
    >
      <ColumnApp className="overflow-y-auto px-6 py-4 px-5 space-y-4 flex-1">
        <ColumnApp>
          <LabelApp >Nombre completo</LabelApp>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Ej: Juan Pérez"
            value={form.name}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
        </ColumnApp>

        <ColumnApp>
          <LabelApp >Documento de identidad</LabelApp>
          <Input
            id="document"
            name="document"
            type="text"
            placeholder="DNI / Cédula"
            value={form.document}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
        </ColumnApp>

        <ColumnApp>
          <LabelApp >Correo electrónico</LabelApp>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Ej: correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
        </ColumnApp>

        <ColumnApp>
          <LabelApp >Teléfono</LabelApp>
          <Input
            id="phone"
            name="phone"
            type="text"
            placeholder="Ej: 987654321"
            value={form.phone}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
        </ColumnApp>

        <ColumnApp>
          <LabelApp >Dirección</LabelApp>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="Ej: Calle 123, Ciudad"
            value={form.address}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
        </ColumnApp>
      </ColumnApp>
    </DialogApp>
  );
};

export default ClientFormModal;
