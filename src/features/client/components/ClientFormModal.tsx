import React, { useState } from 'react';
import DialogApp from '@/shared/components/DialogApp';
import ColumnApp from '@/shared/components/ColumnApp';
import LabelApp from '@/shared/components/LabelApp';
import { Input } from '@/components/ui/input';
import { CreateClientDto } from '../api/client_api';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreateClientDto) => void;
}

const ClientFormModal = ({ open, onClose, onCreate }: Props) => {
  const [form, setForm] = useState<CreateClientDto>({
    name: '',
    paternalSurname: '',
    maternalSurname: '',
    document: '',
    email: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateClientDto, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CreateClientDto, string>> = {};

    // Validaciones básicas
    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!form.paternalSurname.trim()) {
      newErrors.paternalSurname = 'El apellido paterno es requerido';
    }
    if (!form.maternalSurname.trim()) {
      newErrors.maternalSurname = 'El apellido materno es requerido';
    }
    if (!form.document.trim()) {
      newErrors.document = 'El documento es requerido';
    } else if (!/^\d{8,12}$/.test(form.document.trim())) {
      newErrors.document = 'El documento debe tener entre 8 y 12 dígitos';
    }
    if (!form.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'El correo no tiene un formato válido';
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{9}$/.test(form.phone.trim())) {
      newErrors.phone = 'El teléfono debe tener 9 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando se modifica
    if (errors[name as keyof CreateClientDto]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onCreate(form);
    }
  };

  const handleReset = () => {
    setForm({
      name: '',
      paternalSurname: '',
      maternalSurname: '',
      document: '',
      email: '',
      phone: '',
      address: '',
    });
    setErrors({});
  };

  return (
    <DialogApp
      open={open}
      onClose={() => {
        handleReset();
        onClose();
      }}
      onConfirm={handleSubmit}
      maxWidth='md'
      title="Registrar nuevo cliente"
    >
      <ColumnApp className="overflow-y-auto px-6 py-4 space-y-4 flex-1">
        <ColumnApp>
          <LabelApp>Nombres</LabelApp>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Ej: Juan"
            value={form.name}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name}</span>
          )}
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Apellido Paterno</LabelApp>
          <Input
            id="paternalSurname"
            name="paternalSurname"
            type="text"
            placeholder="Ej: Pérez"
            value={form.paternalSurname}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
          {errors.paternalSurname && (
            <span className="text-sm text-red-500">{errors.paternalSurname}</span>
          )}
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Apellido Materno</LabelApp>
          <Input
            id="maternalSurname"
            name="maternalSurname"
            type="text"
            placeholder="Ej: García"
            value={form.maternalSurname}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
          {errors.maternalSurname && (
            <span className="text-sm text-red-500">{errors.maternalSurname}</span>
          )}
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Documento de identidad</LabelApp>
          <Input
            id="document"
            name="document"
            type="text"
            placeholder="DNI / Cédula"
            value={form.document}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
            maxLength={12}
          />
          {errors.document && (
            <span className="text-sm text-red-500">{errors.document}</span>
          )}
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Correo electrónico</LabelApp>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Ej: correo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Teléfono</LabelApp>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Ej: 987654321"
            value={form.phone}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
            maxLength={9}
          />
          {errors.phone && (
            <span className="text-sm text-red-500">{errors.phone}</span>
          )}
        </ColumnApp>

        <ColumnApp>
          <LabelApp>Dirección</LabelApp>
          <Input
            id="address"
            name="address"
            type="text"
            placeholder="Ej: Calle 123, Ciudad"
            value={form.address}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
          {errors.address && (
            <span className="text-sm text-red-500">{errors.address}</span>
          )}
        </ColumnApp>
      </ColumnApp>
    </DialogApp>
  );
};

export default ClientFormModal;
