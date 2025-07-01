import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { clientLoansApi } from '../api/client_loans_api';
import { EquipmentFinancing } from '@/features/equipment-financing/types/equipment-financing.types';
import EquipmentFinancingDetailModal from '@/features/equipment-financing/components/EquipmentFinancingDetailModal';

const RequestStatusColors: Record<string, string> = {
  'PENDIENTE': 'bg-yellow-500',
  'APROBADO': 'bg-green-500',
  'RECHAZADO': 'bg-red-500',
  'EN_PROCESO': 'bg-blue-500',
  'COMPLETADO': 'bg-gray-500'
};

export default function EquipmentFinancingListPage() {
  const [financings, setFinancings] = useState<EquipmentFinancing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinancing, setSelectedFinancing] = useState<EquipmentFinancing | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    loadFinancings();
  }, []);

  const loadFinancings = async () => {
    try {
      const response = await clientLoansApi.getMyEquipmentFinancing();
      setFinancings(response);
    } catch (error) {
      console.error('Error loading financings:', error);
      setFinancings([]);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const handleViewDetail = (financing: EquipmentFinancing) => {
    setSelectedFinancing(financing);
    setIsDetailModalOpen(true);
  };

  const handleFinancingUpdate = async () => {
    await loadFinancings();
    // Actualizar el financiamiento seleccionado con los datos nuevos
    if (selectedFinancing) {
      const updatedFinancing = financings.find(f => f.id === selectedFinancing.id);
      setSelectedFinancing(updatedFinancing || null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financiamiento de Equipo</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Monto Total</TableHead>
                <TableHead>Cuota Inicial</TableHead>
                <TableHead>Monto Financiado</TableHead>
                <TableHead>Tasa Anual</TableHead>
                <TableHead>Plazo (meses)</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {financings.map((financing) => (
                <TableRow 
                  key={financing.id}
                  className="hover:bg-gray-100"
                >
                  <TableCell>{financing.equipment?.code || 'N/A'}</TableCell>
                  <TableCell>{financing.equipment?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge className={RequestStatusColors[financing.status.name]}>
                      {financing.status.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatAmount(financing.totalAmount)}</TableCell>
                  <TableCell>{formatAmount(financing.downPayment)}</TableCell>
                  <TableCell>{formatAmount(financing.financedAmount)}</TableCell>
                  <TableCell>{financing.annualRate}%</TableCell>
                  <TableCell>{financing.term}</TableCell>
                  <TableCell>
                    {format(new Date(financing.startDate), 'dd/MM/yyyy', { locale: es })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetail(financing)}
                      className="hover:bg-gray-200"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {financings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    <p className="text-gray-500">No tienes financiamientos de equipo</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EquipmentFinancingDetailModal
        financing={selectedFinancing}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedFinancing(null);
        }}
        onUpdate={handleFinancingUpdate}
      />
    </div>
  );
} 