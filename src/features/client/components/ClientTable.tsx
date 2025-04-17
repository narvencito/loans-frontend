import { ClientItem } from "../api/client_api";

interface Props {
  clients: ClientItem[];
  onToggle: (id: string) => void;
}

const ClientTable = ({ clients, onToggle }: Props) => {
  return (
    <table className="min-w-[600px] w-full border rounded shadow text-sm">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-2 text-left">Nombre</th>
      <th className="p-2 text-left">DNI</th>
      <th className="p-2 text-left">Correo</th>
      <th className="p-2 text-left">Teléfono</th>
      <th className="p-2 text-center">Estado</th>
      <th className="p-2 text-center">Acción</th>
    </tr>
  </thead>
  <tbody>
    {clients.map((c) => (
      <tr key={c.id} className="border-t">
        <td className="p-2 truncate max-w-[150px]">{c.name}</td>
        <td className="p-2">{c.document}</td>
        <td className="p-2 truncate max-w-[180px]">{c.email}</td>
        <td className="p-2">{c.phone}</td>
        <td className="p-2 text-center">
          <span className={c.isActive ? 'text-green-600' : 'text-red-600'}>
            {c.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </td>
        <td className="p-2 text-center">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
            onClick={() => onToggle(c.id)}
          >
            {c.isActive ? 'Desactivar' : 'Activar'}
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

  );
};

export default ClientTable;
