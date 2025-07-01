import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { clientLoansApi } from '../api/client_loans_api';
import { EquipmentFinancingItem } from '@/features/equipment-financing/api/equipment-financing-api';
import EquipmentFinancingDetailModal from '@/features/equipment-financing/components/EquipmentFinancingDetailModal';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import RowApp from '@/shared/components/RowApp';
import ColumnApp from '@/shared/components/ColumnApp';
import { EquipmentFinancingStatusCode, EquipmentFinancingStatusLabel } from '@/features/equipment-financing/enums/equipment-financing-status.enum';

const RequestStatusColors: Record<EquipmentFinancingStatusCode, string> = {
  [EquipmentFinancingStatusCode.PENDING]: 'bg-yellow-500',
  [EquipmentFinancingStatusCode.IN_PROGRESS]: 'bg-blue-500',
  [EquipmentFinancingStatusCode.CANCELLED]: 'bg-red-500',
  [EquipmentFinancingStatusCode.VOIDED]: 'bg-gray-500',
  [EquipmentFinancingStatusCode.COMPLETED]: 'bg-green-500'
};

const statusOptions = [
  { value: '', label: 'Todos' },
  ...Object.entries(EquipmentFinancingStatusLabel).map(([code, label]) => ({
    value: code,
    label
  }))
];

export default function EquipmentFinancingListPage() {
  const [financings, setFinancings] = useState<EquipmentFinancingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFinancing, setSelectedFinancing] = useState<EquipmentFinancingItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });

  useEffect(() => {
    loadFinancings();
  }, [filters]);

  const loadFinancings = async () => {
    try {
      const response = await clientLoansApi.getMyEquipmentFinancing();
      let filteredFinancings = response || [];

      // Aplicar filtros
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredFinancings = filteredFinancings.filter(financing => 
          financing.equipment?.code?.toLowerCase().includes(searchTerm) ||
          financing.equipment?.name?.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.status) {
        filteredFinancings = filteredFinancings.filter(financing => 
          financing.status?.name === filters.status
        );
      }

      setFinancings(filteredFinancings);
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

  const handleViewDetail = (financing: EquipmentFinancingItem) => {
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
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

      <Card className="mb-6">
        <CardContent className="pt-6">
          <RowApp>
            <ColumnApp className="w-1/2">
              <Label htmlFor="search">Buscar por código o nombre de equipo</Label>
              <Input
                id="search"
                placeholder="Buscar..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </ColumnApp>
            <ColumnApp className="w-1/2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ColumnApp>
          </RowApp>
        </CardContent>
      </Card>

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
                    <Badge className={RequestStatusColors[financing.status?.name as EquipmentFinancingStatusCode] || 'bg-gray-500'}>
                      {EquipmentFinancingStatusLabel[financing.status?.name as EquipmentFinancingStatusCode] || 'Desconocido'}
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