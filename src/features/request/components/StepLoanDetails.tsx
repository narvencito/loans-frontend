import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EquipmentItem } from '@/features/equipment/api/equipment_api';
import { useEffect } from 'react';

// Schema for form validation
const loanDetailsSchema = z.object({
  amount: z.number().optional(),
  term: z.number().min(1, 'El plazo es requerido'),
  downPayment: z.number().min(0, 'El pago inicial no puede ser negativo').optional(),
});

// Type for form data
type LoanFormData = z.infer<typeof loanDetailsSchema>;

interface Props {
  onNext: (data: LoanFormData) => void;
  onPrevious: () => void;
  isFinancing: boolean;
  selectedEquipment?: EquipmentItem;
  initialData?: LoanFormData;
}

export const StepLoanDetails = ({ onNext, onPrevious, isFinancing, selectedEquipment, initialData }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: initialData || {
      amount: isFinancing && selectedEquipment ? selectedEquipment.salePrice : undefined,
      term: undefined,
      downPayment: 0,
    },
  });

  const amount = watch('amount');

  useEffect(() => {
    if (isFinancing && selectedEquipment && !amount) {
      setValue('amount', selectedEquipment.salePrice);
    }
  }, [isFinancing, selectedEquipment, setValue, amount]);

  const handleContinue = (data: LoanFormData) => {
    onNext(data);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Detalles del {isFinancing ? 'Financiamiento' : 'Préstamo'}
      </h2>

      <form onSubmit={handleSubmit(handleContinue)} className="space-y-6">
        {isFinancing && (
          <>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Monto del financiamiento
              </label>
              <input
                id="amount"
                type="number"
                step="any"
                {...register('amount', { valueAsNumber: true })}
                placeholder="Ej: 1000"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
                disabled={true}
              />
              <p className="mt-1 text-sm text-gray-600">
                El monto corresponde al precio del equipo seleccionado
              </p>
              {errors.amount && <p className="mt-1 text-sm text-red-600 font-medium">{errors.amount.message}</p>}
            </div>

            <div>
              <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-1">
                Pago inicial (S/)
              </label>
              <input
                id="downPayment"
                type="number"
                step="any"
                min="0"
                {...register('downPayment', { valueAsNumber: true })}
                placeholder="Ej: 500"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
              />
              <p className="mt-1 text-sm text-gray-600">
                Monto que desea dar como pago inicial (opcional)
              </p>
              {errors.downPayment && <p className="mt-1 text-sm text-red-600 font-medium">{errors.downPayment.message}</p>}
            </div>
          </>
        )}

        <div>
          <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
            {isFinancing ? 'Plazo del financiamiento (meses)' : 'Plazo del préstamo (días)'}
          </label>
          <input
            id="term"
            type="number"
            step="1"
            min="1"
            {...register('term', { valueAsNumber: true })}
            placeholder={isFinancing ? "Ej: 12" : "Ej: 30"}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out"
          />
          {errors.term && <p className="mt-1 text-sm text-red-600 font-medium">{errors.term.message}</p>}
          {!isFinancing && (
            <p className="mt-1 text-sm text-gray-600">
              Ingrese el número de días que necesita el equipo
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onPrevious}
            className="w-1/2 bg-gray-200 text-gray-800 font-semibold py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Anterior
          </button>
          <button
            type="submit"
            className="w-1/2 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};
