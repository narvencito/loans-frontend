import { useState } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const steps = [
  'Selección de equipo',
  'Datos personales',
  'Información académica',
  'Forma de pago',
  'Confirmar solicitud',
  'Revisión y respuesta',
];

const statusIcons = {
  complete: <CheckCircle className="text-green-500" size={20} />,
  current: <Clock className="text-yellow-500" size={20} />,
  rejected: <XCircle className="text-red-500" size={20} />,
};

export default function ClientFinancingStatusPage() {
  const [currentStep, setCurrentStep] = useState(3); // 0-based index

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Estado de mi solicitud</h1>
      <p className="mb-6">Aquí verás el avance de tu financiamiento de equipos o préstamos.</p>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center space-x-2">
            {index < currentStep && statusIcons.complete}
            {index === currentStep && statusIcons.current}
            {index > currentStep && <span className="w-5 h-5 border border-gray-300 rounded-full" />}
            <span className={index === currentStep ? 'font-semibold' : ''}>{step}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 border p-4 rounded bg-white shadow-sm">
        <h2 className="text-lg font-medium mb-2">Equipo seleccionado</h2>
        <p className="text-sm text-gray-700">Laptop ASUS Vivobook - Intel i5 - 8GB RAM - SSD 512GB</p>
        <p className="text-sm text-gray-500">Precio: S/ 2,800</p>
        <p className="text-sm text-gray-500">Fecha estimada de revisión: 08/06/2025</p>
      </div>

      <div className="mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Ver resumen PDF</button>
      </div>
    </div>
  );
}