export default function SidebarFilters() {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Filtros</h2>
      {['Promociones', 'Tipo', 'Rendimiento', 'Cuota Mensual', 'Cuota Inicial', 'Marca', 'Procesador', 'Memoria RAM', 'Almacenamiento', 'Pantalla'].map(filter => (
        <details key={filter} className="mb-2">
          <summary className="cursor-pointer font-medium">{filter}</summary>
          <div className="pl-2 text-sm text-gray-700">
            <label><input type="checkbox" /> Opción 1</label><br />
            <label><input type="checkbox" /> Opción 2</label>
          </div>
        </details>
      ))}
    </div>
  );
}