import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface Props {
  onNext: (data: FormData) => void;
  onPrevious?: () => void;
  showPreviousButton?: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, 'Nombre completo requerido'),
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

export const StepPersonalData = ({ onNext, onPrevious, showPreviousButton = false }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
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
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Datos personales</h2>

      <form onSubmit={handleSubmit(handleContinue)} className="space-y-6">
        <div>
          <input
            {...register('name')}
            type="text"
            placeholder="Nombre completo"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register('document')}
            type="text"
            placeholder="DNI (8 dígitos)"
            maxLength={8}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
            onKeyPress={(e) => {
              // Solo permitir números
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {errors.document && <p className="mt-1 text-sm text-red-600 font-medium">{errors.document.message}</p>}
        </div>

        <div>
          <input
            {...register('email')}
            type="email"
            placeholder="Correo electrónico"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register('phone')}
            type="tel"
            placeholder="Teléfono"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600 font-medium">{errors.phone.message}</p>}
        </div>

        <div>
          <input
            {...register('address')}
            type="text"
            placeholder="Dirección (opcional)"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600 font-medium">{errors.address.message}</p>}
        </div>

        <div className="flex gap-4">
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
