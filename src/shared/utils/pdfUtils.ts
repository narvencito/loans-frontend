import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from './dateUtils';

// Extender el tipo jsPDF para incluir autoTable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => void;
}

export interface ScheduleInstallmentItem {
  nro: number;
  fecha: string;
  cuota: number;
  status: string;
  interes?: number;
  capital?: number;
  saldo?: number;
}

export const generateSchedulePDF = (
  cliente: string,
  loanId: string,
  amount: number,
  rate: number,
  term: number,
  startDate: string,
  cuotas: ScheduleInstallmentItem[]
) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;

  doc.setFontSize(14);
  doc.text('Cronograma de Pagos', 14, 20);

  doc.setFontSize(10);
  doc.text(`Cliente: ${cliente}`, 14, 28);
  doc.text(`Fecha de Préstamo: ${formatDate(startDate)}`, 14, 34);
  doc.text(`Monto: S/ ${amount} | Tasa: ${rate}% | Cuotas: ${term}`, 14, 40);

  // Determinar las columnas basadas en si hay información de interés y capital
  const hasInterestAndCapital = cuotas.some(c => c.interes !== undefined && c.capital !== undefined);
  
  const headers = hasInterestAndCapital 
    ? ['#', 'Fecha', 'Interés', 'Capital', 'Saldo', 'Cuota', 'Estado']
    : ['#', 'Fecha', 'Cuota', 'Estado'];

  const body = cuotas.map((c) => {
    if (hasInterestAndCapital) {
      return [
        c.nro,
        c.fecha,
        c.interes ? `S/ ${c.interes}` : '-',
        c.capital ? `S/ ${c.capital}` : '-',
        c.saldo ? `S/ ${c.saldo.toFixed(2)}` : '-',
        `S/ ${c.cuota}`,
        c.status === 'PAID' ? 'Pagado' :
        c.status === 'PENDING' ? 'Pendiente' :
        c.status === 'OVERDUE' ? 'Vencido' : c.status,
      ];
    }
    return [
      c.nro,
      c.fecha,
      `S/ ${c.cuota}`,
      c.status === 'PAID' ? 'Pagado' :
      c.status === 'PENDING' ? 'Pendiente' :
      c.status === 'OVERDUE' ? 'Vencido' : c.status,
    ];
  });

  doc.autoTable({
    startY: 50,
    head: [headers],
    body: body,
  });

  doc.save(`cronograma_${cliente}.pdf`);
};

interface GeneratePDFParams {
  title: string;
  subtitle?: string;
  headers: string[];
  data: string[][];
  filename: string;
}

export const generatePDF = async ({
  title,
  subtitle,
  headers,
  data,
  filename
}: GeneratePDFParams) => {
  // Crear nuevo documento PDF
  const doc = new jsPDF() as jsPDFWithAutoTable;

  // Configurar fuente y tamaño
  doc.setFont('helvetica');
  
  // Agregar título
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Agregar subtítulo si existe
  if (subtitle) {
    doc.setFontSize(12);
    doc.text(subtitle, 14, 30);
  }

  // Agregar tabla
  doc.autoTable({
    head: [headers],
    body: data,
    startY: subtitle ? 35 : 25,
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 10,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 10 }
  });

  // Guardar el PDF
  doc.save(filename);
};

const downloadBlob = (blob: Blob, filename: string) => {
  // Crear URL del blob
  const url = window.URL.createObjectURL(blob);
  
  // Crear un elemento <a> temporal
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Agregar el link al documento
  document.body.appendChild(link);
  
  // Simular click para descargar
  link.click();
  
  // Limpiar
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const pdfUtils = {
  generatePDF,
  generateSchedulePDF,
  downloadBlob
};
