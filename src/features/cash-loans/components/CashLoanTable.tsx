import { CashLoanItem } from "../api/cash_loans_api";

interface Props {
    loans: CashLoanItem[];
    onDelete: (id: string) => void;
    onViewSchedule: (id: string) => void;
}

const CashLoanTable = ({ loans, onDelete, onViewSchedule }: Props) => {
    return (
        <table className="min-w-[700px] w-full border rounded shadow text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 text-left">Cliente</th>
                    <th className="p-2 text-left">Monto</th>
                    <th className="p-2 text-left">Cuotas</th>
                    <th className="p-2 text-left">Fecha Inicio</th>
                    <th className="p-2 text-center">Estado</th>
                    <th className="p-2 text-center">Acción</th>
                </tr>
            </thead>
            <tbody>
                {loans.map((l) => (
                    <tr key={l.id} className="border-t">
                        <td className="p-2">{l.clientName}</td>
                        <td className="p-2">S/ {l.amount}</td>
                        <td className="p-2">{l.term}</td>
                        <td className="p-2">{new Date(l.startDate).toLocaleDateString()}</td>
                        <td className="p-2 text-center">
                            <span className={l.isActive ? 'text-green-600' : 'text-red-600'}>
                                {l.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                        </td>
                        <td className="p-2 text-center">
                            <button
                                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 text-xs"
                                onClick={() => onViewSchedule(l.id)}
                            >
                                Cronograma
                            </button>
                            <button
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                                onClick={() => onDelete(l.id)}
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default CashLoanTable;
