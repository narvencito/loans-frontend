import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmailConflictModal } from './EmailConflictModal';
import { useCheckEmail } from '../hooks/useCheckEmail';

interface Props {
  onNext: (data: FormData) => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  document: z
    .string()
    .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos'),
  email: z.string().email('Correo inválido'),
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field, so valid if empty
      return /^[0-9\s\-()+]{7,20}$/.test(val);
    }, 'Teléfono inválido (7-20 caracteres, puede incluir números, espacios, -, (, )).'),
  address: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field, so valid if empty
      return val.length >= 5;
    }, 'La dirección debe tener al menos 5 caracteres.'),
});

type FormData = z.infer<typeof formSchema>;

export const StepPersonalData = ({ onNext }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
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

  const checkEmail = useCheckEmail(); // ⚠️ esta es la forma correcta
  const [showConflict, setShowConflict] = useState(false);

  const handleContinue = async (data: FormData) => {
    const exists = await checkEmail(data.email);
    if (exists) {
      setShowConflict(true);
      return;
    }
    onNext(data);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Datos personales</h2>

      <form onSubmit={handleSubmit(handleContinue)} className="space-y-6">
        <div>
          <input
            {...register('name')}
            placeholder="Nombre completo"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name.message}</p>}
        </div>

        <div>
          <input
            {...register('document')}
            placeholder="DNI (8 dígitos)"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.document && <p className="mt-1 text-sm text-red-600 font-medium">{errors.document.message}</p>}
        </div>

        <div>
          <input
            {...register('email')}
            placeholder="Correo electrónico"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <input
            {...register('phone')}
            placeholder="Teléfono (opcional)"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600 font-medium">{errors.phone.message}</p>}
        </div>

        <div>
          <input
            {...register('address')}
            placeholder="Dirección (opcional)"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600 font-medium">{errors.address.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Continuar
        </button>
      </form>

      {showConflict && (
        <EmailConflictModal
          email={getValues('email')}
          onClose={() => setShowConflict(false)}
          onOpenLogin={() => {
            window.location.href = '/login';
          }}
        />
      )}
    </div>
  );
};
