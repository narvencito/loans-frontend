import { InstallmentItem } from '@/features/cash-loans/api/cash_loans_api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './dateUtils';

export const generateSchedulePDF = (
  cliente: string,
  loanId: string,
  amount: number,
  rate: number,
  term: number,
  startDate: string,
  cuotas: InstallmentItem[]
) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text('Cronograma de Pagos', 14, 20);

  doc.setFontSize(10);
  doc.text(`Cliente: ${cliente}`, 14, 28);
  doc.text(`Fecha de Préstamo: ${formatDate(startDate)}`, 14, 34);
  doc.text(`Monto: S/ ${amount} | Tasa: ${rate}% | Cuotas: ${term}`, 14, 40);

  autoTable(doc, {
    startY: 50,
    head: [['#', 'Fecha', 'Interés', 'Capital', 'Saldo', 'Cuota','Estado']],
    body: cuotas.map((c) => [
      c.nro,
      c.fecha,
      `S/ ${c.interes}`,
      `S/ ${c.capital}`,
      `S/ ${c.saldo.toFixed(2)}`,
      `S/ ${c.cuota}`,
      `${c.status}`,
    ]),
  });

  doc.save(`cronograma_${cliente}.pdf`);
};
