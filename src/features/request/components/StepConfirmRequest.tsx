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
  type: string | null;
  amount: string | null;
  term: string | null;
  onNext: () => void;
}

export const StepConfirmRequest = ({ personalData, equipment, onSubmit }: Props) => {
  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded p-6">
      <h2 className="text-xl font-bold mb-4">Confirmar solicitud</h2>

      <div className="space-y-3">
        <p><strong>Nombre:</strong> {personalData.name}</p>
        <p><strong>Documento:</strong> {personalData.document}</p>
        <p><strong>Correo:</strong> {personalData.email}</p>
        {personalData.phone && <p><strong>Teléfono:</strong> {personalData.phone}</p>}
        {personalData.address && <p><strong>Dirección:</strong> {personalData.address}</p>}

        {equipment && (
          <>
            <hr className="my-4" />
            <p><strong>Equipo:</strong> {equipment.name}</p>
            <p><strong>Código:</strong> {equipment.code}</p>
            <p><strong>Serie:</strong> {equipment.serial}</p>
          </>
        )}
      </div>

      <button
        onClick={onSubmit}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Enviar solicitud
      </button>
    </div>
  );
};
