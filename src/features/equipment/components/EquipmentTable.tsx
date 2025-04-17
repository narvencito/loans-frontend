import { EquipmentItem } from "../api/equipment_api";

interface Props {
  equipos: EquipmentItem[];
  onDelete: (id: string) => void;
  onEdit: (item: EquipmentItem) => void;
}

const EquipmentTable = ({ equipos, onDelete, onEdit }: Props) => {
  return (
    <table className="min-w-[800px] w-full border rounded shadow text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Código</th>
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-left">Categoría</th>
          <th className="p-2 text-left">Estado</th>
          <th className="p-2 text-left">Ubicación</th>
          <th className="p-2 text-center">Activo</th>
          <th className="p-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {equipos.map((eq) => (
          <tr key={eq.id} className="border-t">
            <td className="p-2">{eq.code}</td>
            <td className="p-2">{eq.name}</td>
            <td className="p-2">{eq.categoryName}</td>
            <td className="p-2">{eq.statusName}</td>
            <td className="p-2">{eq.location || '-'}</td>
            <td className="p-2 text-center">
              <span className={eq.isActive ? 'text-green-600' : 'text-red-600'}>
                {eq.isActive ? 'Sí' : 'No'}
              </span>
            </td>
            <td className="p-2 text-center">
            <button
                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                onClick={() => onEdit(eq)}
              >
                Editar
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                onClick={() => onDelete(eq.id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EquipmentTable;
