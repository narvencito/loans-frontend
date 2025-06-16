import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

export default function SimulatorCard() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('12');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const interestRate = 0.02;

  const simulate = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) return;

    const total = amountNum * Math.pow(1 + interestRate, parseInt(term));
    setMonthlyPayment(Number((total / parseInt(term)).toFixed(2)));
  };

  return (
    <div className="bg-card text-card-foreground p-6 rounded-xl shadow-lg w-full max-w-md border border-muted">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">
        Simulador de Préstamos
      </h2>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium mb-1">
          Monto a solicitar (S/)
        </label>
        <input
          id="amount"
          type="number"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ej: 1000"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Plazo (meses)</label>
        <Select value={term} onValueChange={setTerm}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona plazo" />
          </SelectTrigger>
          <SelectContent className="select-white">
            <SelectItem value="6">6 meses</SelectItem>
            <SelectItem value="12">12 meses</SelectItem>
            <SelectItem value="18">18 meses</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <button
        onClick={simulate}
        className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:opacity-90 transition-colors"
      >
        Calcular cuota mensual
      </button>

       <button
        onClick={() => navigate(`/general/request-wizard?type=cash&amount=${1000}&term=${12}`)}
        className="w-full mt-4 bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition-colors"
      >
        Solicitar préstamo ahora
      </button>

      {monthlyPayment !== null && (
        <div className="mt-6 text-center">
          <p className="text-base text-muted-foreground">Tu cuota mensual aproximada es:</p>
          <p className="text-2xl font-bold text-primary mt-2">S/ {monthlyPayment}</p>
        </div>
      )}
    </div>
  );
}
