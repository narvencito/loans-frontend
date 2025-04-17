import { EquipmentCategory } from "../api/equipment-category-api";

interface Props {
  data: EquipmentCategory[];
  onEdit: (category: EquipmentCategory) => void;
  onDelete: (id: string) => void;
}

const EquipmentCategoryTable = ({ data, onEdit, onDelete }: Props) => {
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
        {data.map((c) => (
          <tr key={c.id} className="border-t">
            <td className="p-2">{c.name}</td>
            <td className="p-2 text-center">
              <span className={c.isActive ? 'text-green-600' : 'text-red-600'}>
                {c.isActive ? 'Sí' : 'No'}
              </span>
            </td>
            <td className="p-2 text-center">
              <button className="text-blue-600 mr-2" onClick={() => onEdit(c)}>
                Editar
              </button>
              <button className="text-red-600" onClick={() => onDelete(c.id)}>
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EquipmentCategoryTable;
