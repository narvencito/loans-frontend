import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema for form validation
const loanDetailsSchema = z.object({
  amount: z
    .number({
      required_error: 'Monto requerido',
      invalid_type_error: 'Monto debe ser un número',
    })
    .positive('El monto debe ser positivo')
    .min(1, 'El monto debe ser al menos 1'),
  term: z
    .number({
      required_error: 'Plazo requerido',
      invalid_type_error: 'Plazo debe ser un número',
    })
    .positive('El plazo debe ser positivo')
    .int('El plazo debe ser un número entero (meses)')
    .min(1, 'El plazo debe ser al menos 1 mes'),
});

// Type for form data
type LoanFormData = z.infer<typeof loanDetailsSchema>;

interface Props {
  onNext: (data: LoanFormData) => void;
  // We can add preselectedData here later if needed
  // preselectedData?: Partial<LoanFormData>;
}

export const StepLoanDetails = ({ onNext }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: {
      // amount: preselectedData?.amount || undefined,
      // term: preselectedData?.term || undefined,
    },
  });

  const handleContinue = (data: LoanFormData) => {
    onNext(data);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Detalles del Préstamo</h2>

      <form onSubmit={handleSubmit(handleContinue)} className="space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto del préstamo
          </label>
          <input
            id="amount"
            type="number"
            step="any" // Allows decimals
            {...register('amount', { valueAsNumber: true })}
            placeholder="Ej: 1000"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.amount && <p className="mt-1 text-sm text-red-600 font-medium">{errors.amount.message}</p>}
        </div>

        <div>
          <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
            Plazo del préstamo (meses)
          </label>
          <input
            id="term"
            type="number"
            step="1" // Only integers
            {...register('term', { valueAsNumber: true })}
            placeholder="Ej: 12"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.term && <p className="mt-1 text-sm text-red-600 font-medium">{errors.term.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Continuar
        </button>
      </form>
    </div>
  );
};
