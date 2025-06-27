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
import { Label } from "@/components/ui/label";

const EquipmentFinancingListPage = () => {
  const [financings, setFinancings] = useState<EquipmentFinancingItem[]>([]);
  const [clients, setClients] = useState<SimpleClient[]>([]);
  const [equipments, setEquipments] = useState<SimpleEquipment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<EquipmentFinancingItem | null>(null);
  const [selectedForSchedule, setSelectedForSchedule] = useState<EquipmentFinancingItem | null>(null);
  
  // Filtros visuales
  const [clienteFiltro, setClienteFiltro] = useState<string | null>(null);
  const [estadoFiltro, setEstadoFiltro] = useState<boolean | null>(null);

  const loadData = async () => {
    const [financingList, clientList, equipmentList] = await Promise.all([
      equipmentFinancingApi.getAll(),
      clientApi.searchClientsByNameDocument(''),
      equipmentApi.getAll(),
    ]);
    setFinancings(financingList);
    setClients(clientList);
    setEquipments(equipmentList);
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
    const filteredFinancings = financings.filter(f => {
      if (clienteFiltro && f.clientId !== clienteFiltro) return false;
      if (estadoFiltro !== null && f.isActive !== estadoFiltro) return false;
      return true;
    });
    setFinancings(filteredFinancings);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Financiamiento de Equipos</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <AsyncClientCombobox
              selectedClientId={clienteFiltro}
              onSelect={setClienteFiltro}
              label="Filtrar por cliente"
            />
          </div>

          <div>
            <Label>Estado</Label>
            <select
              value={estadoFiltro === null ? '' : estadoFiltro.toString()}
              onChange={(e) => setEstadoFiltro(e.target.value === '' ? null : e.target.value === 'true')}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={buscarFinanciamientos}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Buscar
            </Button>
          </div>
        </div>
      </div>

      <EquipmentFinancingTable
        items={financings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewSchedule={handleViewSchedule}
      />

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
