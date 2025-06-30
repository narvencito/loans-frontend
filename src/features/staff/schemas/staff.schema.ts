import { z } from 'zod';
import { StaffRoleEnum } from '../types/staff.types';

export const createStaffSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string()
    .min(1, 'El correo es requerido')
    .email('Ingrese un correo electrónico válido'),
  role: z.nativeEnum(StaffRoleEnum, {
    errorMap: () => ({ message: 'Seleccione un rol válido' })
  }),
  document: z.string()
    .min(1, 'El documento es requerido')
    .length(8, 'El DNI debe tener exactamente 8 dígitos')
    .regex(/^\d+$/, 'El DNI debe contener solo números'),
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .min(9, 'El teléfono debe tener al menos 9 dígitos')
    .regex(/^\d+$/, 'El teléfono debe contener solo números'),
  address: z.string()
    .min(1, 'La dirección es requerida')
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
});

export const updateStaffSchema = z.object({
  name: z.string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
  phone: z.string()
    .min(1, 'El teléfono es requerido')
    .min(9, 'El teléfono debe tener al menos 9 dígitos')
    .regex(/^\d+$/, 'El teléfono debe contener solo números'),
  address: z.string()
    .min(1, 'La dirección es requerida')
    .min(5, 'La dirección debe tener al menos 5 caracteres'),
});

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;
export type UpdateStaffFormData = z.infer<typeof updateStaffSchema>; 