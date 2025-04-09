import { useState } from 'react';

export default function SimulatorCard() {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('12');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const interestRate = 0.02; // 2% mensual

  const simulate = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) return;

    const total = amountNum * Math.pow(1 + interestRate, parseInt(term));
    setMonthlyPayment(Number((total / parseInt(term)).toFixed(2)));
  };

  return (
    <div className="bg-white text-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Simulador de Préstamos</h2>

      <label className="block mb-2 font-medium">Monto a solicitar (S/)</label>
      <input
        type="number"
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Ej: 1000"
      />

      <label className="block mb-2 font-medium">Plazo (meses)</label>
      <select
        className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      >
        <option value="6">6 meses</option>
        <option value="12">12 meses</option>
        <option value="18">18 meses</option>
      </select>

      <button
        onClick={simulate}
        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
      >
        Calcular cuota mensual
      </button>

      {monthlyPayment !== null && (
        <div className="mt-6 text-center">
          <p className="text-lg">Tu cuota mensual aproximada es:</p>
          <p className="text-2xl font-bold text-primary">S/ {monthlyPayment}</p>
        </div>
      )}
    </div>
  );
}
