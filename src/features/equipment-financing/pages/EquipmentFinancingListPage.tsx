import { useState } from 'react';
import { EquipmentFinancingTable } from '../components/EquipmentFinancingTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EquipmentFinancingListPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financiamiento de Equipos</h1>
        <Button>Nuevo Financiamiento</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Financiamientos</CardTitle>
        </CardHeader>
        <CardContent>
          <EquipmentFinancingTable isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
} 