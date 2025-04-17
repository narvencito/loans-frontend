import { EquipmentStatus } from "../api/equipment-status-api";

interface Props {
  data: EquipmentStatus[];
  onEdit: (status: EquipmentStatus) => void;
  onDelete: (id: string) => void;
}

const EquipmentStatusTable = ({ data, onEdit, onDelete }: Props) => {
  return (
    <table className="min-w-[500px] w-full border rounded shadow text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 text-left">Nombre</th>
          <th className="p-2 text-center">Activo</th>
          <th className="p-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((s) => (
          <tr key={s.id} className="border-t">
            <td className="p-2">{s.name}</td>
            <td className="p-2 text-center">
              <span className={s.isActive ? 'text-green-600' : 'text-red-600'}>
                {s.isActive ? 'Sí' : 'No'}
              </span>
            </td>
            <td className="p-2 text-center">
              <button className="text-blue-600 mr-2" onClick={() => onEdit(s)}>
                Editar
              </button>
              <button className="text-red-600" onClick={() => onDelete(s.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EquipmentStatusTable;
