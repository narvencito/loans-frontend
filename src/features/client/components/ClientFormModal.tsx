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

interface FormData {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  name: string;
  fullName: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  codeStudent: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    document: string;
    email: string;
    phone?: string;
    address?: string;
    firstName: string;
    paternalSurname: string;
    maternalSurname: string;
    fullName: string;
    codeStudent: string;
  }) => void;
}

const ClientFormModal = ({ open, onClose, onCreate }: Props) => {
  const [form, setForm] = useState<FormData>({
    firstName: '',
    paternalSurname: '',
    maternalSurname: '',
    name: '',
    fullName: '',
    document: '',
    email: '',
    phone: '',
    address: '',
    codeStudent: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    // Validaciones básicas
    if (!form.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!form.paternalSurname.trim()) newErrors.paternalSurname = 'El apellido paterno es requerido';
    if (!form.maternalSurname.trim()) newErrors.maternalSurname = 'El apellido materno es requerido';
    if (!form.document.trim()) newErrors.document = 'El documento es requerido';
    if (!form.email.trim()) newErrors.email = 'El correo es requerido';
    if (!form.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    
    // Validación específica para codeStudent
    if (!form.codeStudent.trim()) {
      newErrors.codeStudent = 'El código de estudiante es requerido';
    } else if (form.codeStudent.length < 6) {
      newErrors.codeStudent = 'El código de estudiante debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updatedForm = { ...prev, [name]: value };
      
      // Si se actualiza cualquiera de los campos de nombre, actualizar name y fullName
      if (name === 'firstName' || name === 'paternalSurname' || name === 'maternalSurname') {
        const combinedName = `${name === 'firstName' ? value : prev.firstName} ${name === 'paternalSurname' ? value : prev.paternalSurname} ${name === 'maternalSurname' ? value : prev.maternalSurname}`.trim();
        updatedForm.name = combinedName;
        updatedForm.fullName = combinedName;
      }
      
      return updatedForm;
    });

    // Limpiar error del campo cuando se modifica
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        ...form,
        name: form.fullName, // Asegurarnos que name tenga el valor correcto
      };
      onCreate(submitData);
    }
  };

  return (
    <DialogApp
      open={open}
      onClose={onClose}
      onConfirm={handleSubmit}
      maxWidth='md'
      title={"Registrar nuevo cliente"}
    >
      <ColumnApp className="overflow-y-auto px-6 py-4 px-5 space-y-4 flex-1">
        <ColumnApp>
          <LabelApp>Nombres</LabelApp>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Ej: Juan"
            value={form.firstName}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
          />
          {errors.firstName && (
            <span className="text-sm text-red-500">{errors.firstName}</span>
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
          <LabelApp>Código de Estudiante</LabelApp>
          <Input
            id="codeStudent"
            name="codeStudent"
            type="text"
            placeholder="Ej: 2024-12345"
            value={form.codeStudent}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
            required
            minLength={6}
          />
          {errors.codeStudent && (
            <span className="text-sm text-red-500">{errors.codeStudent}</span>
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
            type="text"
            placeholder="Ej: 987654321"
            value={form.phone}
            onChange={handleChange}
            className="border border-primary rounded px-3 py-2 w-full"
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
