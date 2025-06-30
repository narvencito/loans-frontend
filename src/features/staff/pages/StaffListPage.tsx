import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Staff, StaffFilters, staffApi, CreateStaffDto, UpdateStaffDto } from "../api/staff_api";
import { StaffTable } from "../components/StaffTable";
import { StaffFormModal } from "../components/StaffFormModal";
import { showGlobalDialog } from "@/shared/utils/global-dialog";
import { useLoaderStore } from "@/shared/store/loader.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StaffRoleEnum, STAFF_ROLE_LABELS } from "../types/staff.types";

const StaffListPage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const { show: showLoader, hide: hideLoader } = useLoaderStore();

  const loadStaff = async () => {
    try {
      const data = await staffApi.getAll(
        selectedRole === "all" ? undefined : { role: selectedRole as StaffRoleEnum }
      );
      setStaff(data);
    } catch (error) {
      // El manejo de errores ya está incluido en staffApi con apiRequest
    }
  };

  useEffect(() => {
    loadStaff();
  }, [selectedRole]);

  const handleSubmit = async (data: CreateStaffDto | UpdateStaffDto, isUpdate: boolean) => {
    try {
      showLoader();
      if (isUpdate && selectedStaff) {
        await staffApi.update(selectedStaff.id, data as UpdateStaffDto);
      } else {
        await staffApi.create(data as CreateStaffDto);
      }
      setIsModalOpen(false);
      setSelectedStaff(undefined);
      loadStaff();
    } catch (error) {
      // El manejo de errores ya está incluido en staffApi con apiRequest
    } finally {
      hideLoader();
    }
  };

  const handleToggleStatus = async (id: string) => {
    const person = staff.find((s) => s.id === id);
    if (!person) return;

    const action = person.isActive ? "desactivar" : "activar";

    showGlobalDialog({
      title: `¿Estás seguro de ${action} a este personal?`,
      message: `Esta acción ${action}á al personal seleccionado.`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          showLoader();
          await staffApi.toggleStatus(id);
          loadStaff();
        } catch (error) {
          // El manejo de errores ya está incluido en staffApi con apiRequest
        } finally {
          hideLoader();
        }
      },
    });
  };

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Gestión de Personal</h1>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="w-full sm:w-48">
            <Label>Filtrar por rol</Label>
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value={StaffRoleEnum.BOSS}>{STAFF_ROLE_LABELS[StaffRoleEnum.BOSS]}</SelectItem>
                <SelectItem value={StaffRoleEnum.WORKER}>{STAFF_ROLE_LABELS[StaffRoleEnum.WORKER]}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setIsModalOpen(true)}>Registrar Personal</Button>
        </div>
      </div>

      <StaffTable
        staff={staff}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
      />

      <StaffFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        staff={selectedStaff}
      />
    </div>
  );
};

export default StaffListPage; 