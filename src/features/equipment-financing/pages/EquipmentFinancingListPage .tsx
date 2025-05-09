import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import EquipmentFinancingFormModal from "../components/EquipmentFinancingFormModal";
import EquipmentFinancingTable from "../components/EquipmentFinancingTable";
import { showConfirm } from "@/shared/utils/global-dialog-utils";
import { SimpleEquipment } from "@/features/equipment/components/EquipmentSelect";
import { equipmentApi } from "@/features/equipment/api/equipment_api";
import { CreateEquipmentFinancingDto, equipmentFinancingApi, EquipmentFinancingItem } from "../api/equipment-financing-api";
import { SimpleClient } from "@/features/client/components/ClientSearchInput";
import { clientApi } from "@/features/client/api/client_api";

const EquipmentFinancingListPage = () => {
  const [financings, setFinancings] = useState<EquipmentFinancingItem[]>([]);
  const [clients, setClients] = useState<SimpleClient[]>([]);
  const [equipments, setEquipments] = useState<SimpleEquipment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<EquipmentFinancingItem | null>(null);

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
    const confirmed = await showConfirm("¿Deseas eliminar este financiamiento?");
    if (!confirmed) return;
    await equipmentFinancingApi.delete(id);
    loadData();
  };

  const handleEdit = (item: EquipmentFinancingItem) => {
    setSelected(item);
    setShowModal(true);
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

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Financiamiento de Equipos</h1>
        <Button className="w-full sm:w-auto" onClick={() => setShowModal(true)}>
          Registrar financiamiento
        </Button>
      </div>

      <EquipmentFinancingTable
        items={financings}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
    </div>
  );
};

export default EquipmentFinancingListPage;
