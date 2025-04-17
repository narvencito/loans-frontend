import React, { useEffect, useState } from 'react';
import { CashLoanItem, cashLoanApi, InstallmentItem } from '../api/cash_loans_api';
import { generateSchedulePDF } from '@/shared/utils/pdfUtils';
import { formatDate } from '@/shared/utils/dateUtils';

interface Props {
    open: boolean;
    onClose: () => void;
    loan: CashLoanItem | null;
}

const CashLoanScheduleModal = ({ open, onClose, loan }: Props) => {
    const [cuotas, setCuotas] = useState<InstallmentItem[]>([]);

    useEffect(() => {
        if (open && loan) {
            cashLoanApi.getSchedule(loan.id).then(setCuotas);
        }
    }, [open, loan]);

    if (!open || !loan) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white rounded w-full max-w-2xl h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold">Cronograma de Pagos</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-red-500">✕</button>
                    </div>
                    <p className="text-sm">
                        Cliente: <strong>{loan.clientName}</strong> <br />
                        Fecha de Préstamo: <strong>{formatDate(loan.startDate)}</strong> <br />
                        Monto: <strong>S/ {loan.amount}</strong> | Tasa: {loan.rate}% | Cuotas: {loan.term} 
                    </p>
                </div>

                {/* Tabla scrollable */}
                <div className="flex-1 overflow-y-auto px-6">
                    <table className="w-full text-sm border mt-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">#</th>
                                <th className="p-2 text-left">Fecha</th>
                                <th className="p-2 text-left">Interés</th>
                                <th className="p-2 text-left">Capital</th>
                                <th className="p-2 text-left">Saldo</th>
                                <th className="p-2 text-left">Cuota</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cuotas.map((c) => (
                                <tr key={c.nro} className="border-t">
                                    <td className="p-2">{c.nro}</td>
                                    <td className="p-2">{c.fecha}</td>
                                    <td className="p-2">S/ {c.interes}</td>
                                    <td className="p-2">S/ {c.capital}</td>
                                    <td className="p-2">S/ {c.saldo.toFixed(2)}</td>
                                    <td className="p-2 font-semibold">S/ {c.cuota}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer fijo */}
                <div className="p-4 border-t flex justify-between">
                    <button
                        onClick={() =>
                            generateSchedulePDF(
                                loan.clientName,
                                loan.id,
                                loan.amount,
                                loan.rate,
                                loan.term,
                                loan.startDate,
                                cuotas
                            )
                        }
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        Descargar PDF
                    </button>

                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CashLoanScheduleModal;
