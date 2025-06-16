import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from 'lucide-react';

// Simulación de préstamos del cliente
interface Loan {
  id: string;
  amount: number;
  status: 'Aprobado' | 'Pendiente' | 'Rechazado';
  createdAt: string;
}

export default function ClientLoansPage() {
  const [loans, setLoans] = useState<Loan[] | null>(null);

  useEffect(() => {
    // Simula una llamada a API
    setTimeout(() => {
      setLoans([
        {
          id: 'LN-001',
          amount: 3500,
          status: 'Aprobado',
          createdAt: '2025-05-10',
        },
        {
          id: 'LN-002',
          amount: 2000,
          status: 'Pendiente',
          createdAt: '2025-06-01',
        },
      ]);
    }, 1000);
  }, []);

  const renderStatus = (status: Loan['status']) => {
    switch (status) {
      case 'Aprobado':
        return <Badge className="bg-green-600">Aprobado</Badge>;
      case 'Pendiente':
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      case 'Rechazado':
        return <Badge className="bg-red-600">Rechazado</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Mis Préstamos</h2>

      {loans === null ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded" />
          <Skeleton className="h-24 w-full rounded" />
        </div>
      ) : loans.length === 0 ? (
        <p className="text-muted-foreground">No tienes préstamos registrados.</p>
      ) : (
        loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader>
              <CardTitle>Préstamo {loan.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>Monto: <strong>S/ {loan.amount.toFixed(2)}</strong></p>
              <p>Fecha de solicitud: {loan.createdAt}</p>
              <div>Estado: {renderStatus(loan.status)}</div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
