import { EquipmentItem } from "@/features/equipment/api/equipment_api";

interface Props {
  personalData: {
    name: string;
    document: string;
    email: string;
    phone?: string;
    address?: string;
  };
  equipment?: EquipmentItem;
  onSubmit: () => void;
  onPrevious: () => void;
  type: string | null;
  loanDetails?: { amount: number; term: number } | null;
}

export const StepConfirmRequest = ({ personalData, equipment, loanDetails, type, onSubmit, onPrevious }: Props) => {
  const DetailItem = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null;
    return (
      <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-gray-200 last:border-b-0">
        <dt className="text-sm font-semibold text-gray-600">{label}:</dt>
        <dd className="mt-1 text-sm text-gray-800 sm:mt-0 sm:col-span-2">{value}</dd>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Confirmar solicitud</h2>

      <div className="space-y-6">
        {/* Personal Data Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Datos Personales</h3>
          <dl className="space-y-2">
            <DetailItem label="Nombre completo" value={personalData.name} />
            <DetailItem label="Documento (DNI)" value={personalData.document} />
            <DetailItem label="Correo electrónico" value={personalData.email} />
            <DetailItem label="Teléfono" value={personalData.phone} />
            <DetailItem label="Dirección" value={personalData.address} />
          </dl>
        </div>

        {/* Equipment Section */}
        {equipment && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Equipo Seleccionado</h3>
            <dl className="space-y-2">
              <DetailItem label="Nombre del equipo" value={equipment.name} />
              <DetailItem label="Código" value={equipment.code} />
              <DetailItem label="Serie" value={equipment.serial} />
              {/* Add other equipment details if needed */}
            </dl>
          </div>
        )}

        {/* Loan/Financing Details Section */}
        {loanDetails && (type === 'cash' || type === 'financing') && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
              {type === 'cash' ? 'Detalles del Préstamo' : 'Detalles del Financiamiento'}
            </h3>
            <dl className="space-y-2">
              <DetailItem
                label="Monto Solicitado"
                value={
                  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' })
                    .format(loanDetails.amount)
                }
              />
              <DetailItem label="Plazo" value={`${loanDetails.term} meses`} />
            </dl>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-8">
        <button
          onClick={onPrevious}
          className="w-1/2 bg-gray-200 text-gray-800 font-semibold py-3 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Anterior
        </button>
        <button
          onClick={onSubmit}
          className="w-1/2 bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Enviar solicitud
        </button>
      </div>
    </div>
  );
};
