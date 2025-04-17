import React, { useEffect, useState } from 'react';
import { dashboardApi, LatestLoan } from '../api/admin_dashboard_api';


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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {loading ? (
        <p>Cargando datos...</p>
      ) : (
        <>
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card title="Clientes registrados" value={totalClients} />
            <Card title="Préstamos totales" value={totalLoans} />
            <Card title="Cuotas pendientes" value={totalInstallments} />
          </div>

          {/* Últimos préstamos */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Últimos préstamos</h2>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b font-medium">
                  <th className="text-left py-2">Cliente</th>
                  <th className="text-left py-2">Tipo</th>
                  <th className="text-left py-2">Monto</th>
                  <th className="text-left py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {latestLoans.map((loan, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{loan.client}</td>
                    <td className="py-2">{loan.type}</td>
                    <td className="py-2">S/ {loan.amount}</td>
                    <td className="py-2">{new Date(loan.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// Card component
const Card = ({ title, value }: { title: string; value: number }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-xl font-bold text-blue-600">{value}</p>
  </div>
);

export default AdminDashboardPage;
