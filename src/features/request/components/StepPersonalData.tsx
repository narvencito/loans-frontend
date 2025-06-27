import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  onNext: (data: FormData) => void;
  onPrevious?: () => void;
  showPreviousButton?: boolean;
  initialData?: FormData;
}

const formSchema = z.object({
  firstName: z.string().min(1, 'Nombres requeridos'),
  paternalSurname: z.string().min(1, 'Apellido paterno requerido'),
  maternalSurname: z.string().min(1, 'Apellido materno requerido'),
  codeStudent: z.string()
    .min(6, 'El código de estudiante debe tener al menos 6 caracteres')
    .refine((val) => val.length >= 6, 'El código de estudiante debe tener al menos 6 caracteres'),
  document: z
    .string()
    .min(8, 'El DNI debe tener 8 dígitos')
    .max(8, 'El DNI debe tener 8 dígitos')
    .regex(/^\d+$/, 'El DNI solo debe contener números')
    .refine((val) => val.length === 8, 'El DNI debe tener exactamente 8 dígitos'),
  email: z.string().email('Correo inválido'),
  phone: z
    .string()
    .min(1, 'Teléfono requerido')
    .regex(/^[0-9\s\-()+]{7,20}$/, 'Teléfono inválido (7-20 caracteres, puede incluir números, espacios, -, (, )).'),
  address: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field, so valid if empty
      return val.length >= 5;
    }, 'La dirección debe tener al menos 5 caracteres.'),
});

type FormData = z.infer<typeof formSchema>;

export const StepPersonalData = ({ onNext, onPrevious, showPreviousButton = false, initialData }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      firstName: '',
      paternalSurname: '',
      maternalSurname: '',
      codeStudent: '',
      document: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  const handleContinue = async (data: FormData) => {
    onNext(data);
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-xl rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Datos personales</h2>

      <form onSubmit={handleSubmit(handleContinue)} className="space-y-3">
        <div>
          <input
            {...register('firstName')}
            type="text"
            placeholder="Nombres"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.firstName && <p className="mt-0.5 text-sm text-red-600 font-medium">{errors.firstName.message}</p>}
        </div>

        <div>
          <input
            {...register('paternalSurname')}
            type="text"
            placeholder="Apellido paterno"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.paternalSurname && <p className="mt-0.5 text-sm text-red-600 font-medium">{errors.paternalSurname.message}</p>}
        </div>

        <div>
          <input
            {...register('maternalSurname')}
            type="text"
            placeholder="Apellido materno"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.maternalSurname && <p className="mt-0.5 text-sm text-red-600 font-medium">{errors.maternalSurname.message}</p>}
        </div>

        <div>
          <input
            {...register('codeStudent')}
            type="text"
            placeholder="Código de estudiante"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            minLength={6}
          />
          {errors.codeStudent && <p className="mt-0.5 text-sm text-red-600 font-medium">{errors.codeStudent.message}</p>}
        </div>

        <div>
          <input
            {...register('document')}
            type="text"
            placeholder="DNI (8 dígitos)"
            maxLength={8}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            onKeyPress={(e) => {
              // Solo permitir números
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {errors.document && <p className="mt-0.5 text-sm text-red-600 font-medium">{errors.document.message}</p>}
        </div>

        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.email && <p className="mt-0.5 text-sm text-red-600 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register('phone')}
            type="tel"
            placeholder="Teléfono"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.phone && <p className="mt-0.5 text-sm text-red-600 font-medium">{errors.phone.message}</p>}
        </div>

        <div>
          <input
            {...register('address')}
            type="text"
            placeholder="Dirección (opcional)"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.address && <p className="mt-0.5 text-sm text-red-600 font-medium">{errors.address.message}</p>}
        </div>

        <div className="flex gap-4 mt-4">
          {showPreviousButton && (
            <button
              type="button"
              onClick={onPrevious}
              className="w-1/2 bg-gray-200 text-gray-800 font-semibold py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
            >
              Anterior
            </button>
          )}
          <button
            type="submit"
            className={`${showPreviousButton ? 'w-1/2' : 'w-full'} bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out`}
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};
