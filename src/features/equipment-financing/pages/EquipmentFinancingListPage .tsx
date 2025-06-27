import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EquipmentFinancingFormModal from "../components/EquipmentFinancingFormModal";
import EquipmentFinancingTable from "../components/EquipmentFinancingTable";
import EquipmentFinancingScheduleModal from "../components/EquipmentFinancingScheduleModal";
import { showConfirm } from "@/shared/utils/global-dialog-utils";
import { SimpleEquipment } from "@/features/equipment/components/EquipmentSelect";
import { equipmentApi } from "@/features/equipment/api/equipment_api";
import { CreateEquipmentFinancingDto, equipmentFinancingApi, EquipmentFinancingItem } from "../api/equipment-financing-api";
import { SimpleClient } from "@/features/client/components/ClientSearchInput";
import { clientApi } from "@/features/client/api/client_api";
import AsyncClientCombobox from "@/features/client/components/AsyncClientCombobox";

const FINANCING_STATUSES = {
  PAID: 'Pagado',
  PENDING: 'Pendiente',
  OVERDUE: 'Vencido'
} as const;

const EquipmentFinancingListPage = () => {
  const [financings, setFinancings] = useState<EquipmentFinancingItem[]>([]);
  const [clients, setClients] = useState<SimpleClient[]>([]);
  const [equipments, setEquipments] = useState<SimpleEquipment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<EquipmentFinancingItem | null>(null);
  const [selectedForSchedule, setSelectedForSchedule] = useState<EquipmentFinancingItem | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Filtros visuales
  const [clienteFiltro, setClienteFiltro] = useState<string | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [financingList, clientList, equipmentList] = await Promise.all([
      equipmentFinancingApi.getAll(),
      clientApi.searchClientsByNameDocument(''),
      equipmentApi.getAll(),
    ]);
    setFinancings(financingList);
    setClients(clientList);
    setEquipments(equipmentList);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("Eliminar financiamiento", "¿Deseas eliminar este financiamiento?");
    if (!confirmed) return;
    await equipmentFinancingApi.delete(id);
    loadData();
  };

  const handleEdit = (item: EquipmentFinancingItem) => {
    setSelected(item);
    setShowModal(true);
  };

  const handleViewSchedule = (id: string) => {
    const financing = financings.find((f) => f.id === id);
    if (financing) setSelectedForSchedule(financing);
  };

  const handleSubmit = async (data: CreateEquipmentFinancingDto) => {
    if (selected) {
      await equipmentFinancingApi.update(selected.id, {...data, id: selected.id});
    } else {
      await equipmentFinancingApi.create(data);
    }
    setShowModal(false);
    setSelected(null);
    loadData();
  };

  const buscarFinanciamientos = async () => {
    setLoading(true);
    const filteredFinancings = financings.filter(f => {
      if (clienteFiltro && f.clientId !== clienteFiltro) return false;
      if (estadoFiltro && f.status.name !== estadoFiltro) return false;
      return true;
    });
    setFinancings(filteredFinancings);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold px-2 py-1">Financiamiento de Equipos</h1>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap justify-between items-end gap-4 mb-6">
        {/* Filtros a la izquierda */}
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">
          <div className="w-full sm:w-64">
            <AsyncClientCombobox
              selectedClientId={clienteFiltro}
              onSelect={setClienteFiltro}
              label="Filtrar por cliente"
            />
          </div>

          <div className="w-full sm:w-48">
            <select
              value={estadoFiltro || ''}
              onChange={(e) => setEstadoFiltro(e.target.value || null)}
              className="w-full p-2 border rounded"
            >
              <option value="">Todos los estados</option>
              {Object.entries(FINANCING_STATUSES).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botones a la derecha */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={buscarFinanciamientos}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            Buscar
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <EquipmentFinancingTable
            items={financings}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewSchedule={handleViewSchedule}
          />
        </div>
      )}

      <EquipmentFinancingFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setSelected(null);
        }}
        onSubmit={handleSubmit}
        defaultValues={selected}
      />

      <EquipmentFinancingScheduleModal
        open={!!selectedForSchedule}
        onClose={() => setSelectedForSchedule(null)}
        financing={selectedForSchedule}
      />
    </div>
  );
};

export default EquipmentFinancingListPage;
