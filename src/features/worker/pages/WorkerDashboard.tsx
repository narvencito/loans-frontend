import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardApi, LatestLoan } from '@/features/admin/api/admin_dashboard_api';

const AdminDashboardPage = () => {
  const [totalClients, setTotalClients] = useState<number>(0);
  const [totalLoans, setTotalLoans] = useState<number>(0);
  const [totalInstallments, setTotalInstallments] = useState<number>(0);
  const [latestLoans, setLatestLoans] = useState<LatestLoan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clients, loans, installments, latest] = await Promise.all([
          dashboardApi.getClientCount(),
          dashboardApi.getLoanCount(),
          dashboardApi.getInstallmentCount(),
          dashboardApi.getLatestLoans(),
        ]);
        setTotalClients(clients);
        setTotalLoans(loans);
        setTotalInstallments(installments);
        setLatestLoans(latest);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trabajador Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard title="Clientes registrados" value={totalClients} />
            <StatCard title="Préstamos totales" value={totalLoans} />
            <StatCard title="Cuotas pendientes" value={totalInstallments} />
          </div>

          <Separator className="my-4" />

          {/* Últimos préstamos */}
          <Card>
            <CardHeader>
              <CardTitle>Últimos préstamos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {latestLoans.map((loan, index) => (
                    <TableRow key={index}>
                      <TableCell>{loan.client}</TableCell>
                      <TableCell>{loan.type}</TableCell>
                      <TableCell>S/ {loan.amount}</TableCell>
                      <TableCell>{new Date(loan.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// Card component mejorado
const StatCard = ({ title, value }: { title: string; value: number }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </CardContent>
  </Card>
);

export default AdminDashboardPage;
