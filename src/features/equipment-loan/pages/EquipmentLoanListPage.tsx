import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { EquipmentLoanItem, equipmentLoanApi } from '../api/equipment_loan_api';
import EquipmentLoanTable from '../components/EquipmentLoanTable';
import EquipmentLoanScheduleModal from '../components/EquipmentLoanScheduleModal';
import AsyncClientCombobox from '@/features/client/components/AsyncClientCombobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const EquipmentLoanListPage = () => {
  const [loans, setLoans] = useState<EquipmentLoanItem[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<EquipmentLoanItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<EquipmentLoanItem | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const loadLoans = async () => {
    setLoading(true);
    try {
      const data = await equipmentLoanApi.getByFilter({});
      setLoans(data);
      setFilteredLoans(data);
    } catch (error) {
      console.error('Error al cargar préstamos:', error);
      setFilteredLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters: {
        clientId?: string;
        status?: string;
      } = {};
      
      if (selectedClientId) {
        filters.clientId = selectedClientId;
      }
      
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus;
      }

      const data = await equipmentLoanApi.getByFilter(filters);
      setFilteredLoans(data);
    } catch (error) {
      console.error('Error al buscar préstamos:', error);
      setFilteredLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSchedule = (loan: EquipmentLoanItem) => {
    setSelectedLoan(loan);
  };

  const handleClearFilters = () => {
    setSelectedClientId(null);
    setSelectedStatus('all');
    loadLoans();
  };

  useEffect(() => {
    loadLoans();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Préstamos de Equipos</h1>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label></Label>
            <AsyncClientCombobox
              selectedClientId={selectedClientId}
              onSelect={setSelectedClientId}
              placeholder="Buscar cliente..."
            />
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button 
              onClick={handleSearch}
              className="flex-1"
            >
              Buscar
            </Button>
            <Button 
              onClick={handleClearFilters}
              variant="outline"
            >
              Limpiar
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando...</span>
        </div>
      ) : filteredLoans.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>No hay préstamos que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <EquipmentLoanTable
            loans={filteredLoans}
            onEditSchedule={handleEditSchedule}
          />
        </div>
      )}

      <EquipmentLoanScheduleModal
        open={!!selectedLoan}
        onClose={() => setSelectedLoan(null)}
        loan={selectedLoan}
        onUpdate={loadLoans}
      />
    </div>
  );
};

export default EquipmentLoanListPage; 