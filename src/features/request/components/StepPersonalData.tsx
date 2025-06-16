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
  phone: z.string().optional(),
  address: z.string().optional(),
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
    <div className="max-w-lg mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4">Datos personales</h2>

      <form onSubmit={handleSubmit(handleContinue)} className="space-y-4">
        <input
          {...register('name')}
          placeholder="Nombre completo"
          className="w-full p-3 border rounded"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

        <input
          {...register('document')}
          placeholder="DNI (8 dígitos)"
          className="w-full p-3 border rounded"
        />
        {errors.document && <p className="text-sm text-red-500">{errors.document.message}</p>}

        <input
          {...register('email')}
          placeholder="Correo electrónico"
          className="w-full p-3 border rounded"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <input
          {...register('phone')}
          placeholder="Teléfono"
          className="w-full p-3 border rounded"
        />

        <input
          {...register('address')}
          placeholder="Dirección"
          className="w-full p-3 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700"
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
