import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EquipmentLoanItem, equipmentLoanApi } from '../api/equipment_loan_api';
import { formatDate } from '@/shared/utils/dateUtils';
import EquipmentLoanScheduleModal from '../components/EquipmentLoanScheduleModal';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

const EquipmentLoanDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<EquipmentLoanItem | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLoan = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await equipmentLoanApi.getById(id);
        setLoan(data);
      } catch (error) {
        console.error('Error al cargar préstamo:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLoan();
  }, [id]);

  const handleDeliverEquipment = async () => {
    if (!loan || !id) return;

    const isConfirmed = await showConfirm(
      '¿Confirmar entrega de equipo?',
      'Se registrará la entrega del equipo y se iniciará el préstamo.'
    );

    if (!isConfirmed) return;

    try {
      const data = {
        deliveryDate: new Date().toISOString().split('T')[0],
        initialPayment: loan.initialPayment
      };
      await equipmentLoanApi.deliver(id, data);
      // Recargar datos
      const updatedLoan = await equipmentLoanApi.getById(id);
      setLoan(updatedLoan);
    } catch (error) {
      console.error('Error al entregar equipo:', error);
    }
  };

  const handleReturnEquipment = async () => {
    if (!loan || !id) return;

    const isConfirmed = await showConfirm(
      '¿Confirmar devolución de equipo?',
      'Se registrará la devolución del equipo y se finalizará el préstamo.'
    );

    if (!isConfirmed) return;

    try {
      const data = {
        returnDate: new Date().toISOString().split('T')[0]
      };
      await equipmentLoanApi.returnEquipment(id, data);
      // Recargar datos
      const updatedLoan = await equipmentLoanApi.getById(id);
      setLoan(updatedLoan);
    } catch (error) {
      console.error('Error al devolver equipo:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">No se encontró el préstamo</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalle de Préstamo</h1>
        <div className="space-x-2">
          {loan.status.toLowerCase() === 'pendiente' && (
            <Button
              onClick={handleDeliverEquipment}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Entregar Equipo
            </Button>
          )}
          {loan.status.toLowerCase() === 'activo' && (
            <Button
              onClick={handleReturnEquipment}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Devolver Equipo
            </Button>
          )}
          <Button
            onClick={() => setShowScheduleModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Ver Cronograma
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Información del Préstamo</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Estado:</span> <span className={`px-2 py-0.5 rounded text-sm font-semibold ${
                loan.status.toLowerCase() === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                loan.status.toLowerCase() === 'activo' ? 'bg-green-100 text-green-700' :
                loan.status.toLowerCase() === 'completado' ? 'bg-blue-100 text-blue-700' :
                loan.status.toLowerCase() === 'vencido' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>{loan.status}</span></p>
              <p><span className="font-medium">Equipo:</span> {loan.equipmentName}</p>
              <p><span className="font-medium">Cliente:</span> {loan.clientName}</p>
              <p><span className="font-medium">Fecha Inicio:</span> {formatDate(loan.startDate)}</p>
              <p><span className="font-medium">Fecha Fin:</span> {formatDate(loan.endDate)}</p>
              {loan.deliveryDate && (
                <p><span className="font-medium">Fecha Entrega:</span> {formatDate(loan.deliveryDate)}</p>
              )}
              {loan.returnDate && (
                <p><span className="font-medium">Fecha Devolución:</span> {formatDate(loan.returnDate)}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Información de Pagos</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Monto Total</p>
                  <p className="text-xl font-bold">S/ {loan.totalAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tarifa Diaria</p>
                  <p className="text-xl font-bold">S/ {loan.dailyRate.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monto Pagado</p>
                  <p className="text-xl font-bold text-green-600">S/ {loan.paidAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monto Pendiente</p>
                  <p className="text-xl font-bold text-red-600">S/ {loan.pendingAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EquipmentLoanScheduleModal
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        loan={loan}
        onUpdate={() => {
          // Recargar datos
          if (id) {
            equipmentLoanApi.getById(id).then(setLoan);
          }
        }}
      />
    </div>
  );
};

export default EquipmentLoanDetailPage;