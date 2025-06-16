import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StepNavigation } from '../components/StepNavigation';
import { StepPersonalData } from '../components/StepPersonalData';
import { StepSelectEquipment } from '../components/StepSelectEquipment';
import { StepConfirmRequest } from '../components/StepConfirmRequest';
import { EquipmentItem } from '@/features/equipment/api/equipment_api';

export default function RequestWizardPage() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type'); // 'equipment' | 'financing' | 'cash'
  const equipmentId = searchParams.get('equipmentId');
  const amount = searchParams.get('amount');
  const term = searchParams.get('term');

  const [step, setStep] = useState(0);
  const [personalData, setPersonalData] = useState<{
    name: string;
    document: string;
    email: string;
    phone?: string;
    address?: string;
  } | null>(null);

  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | undefined>(undefined);

  const steps = useMemo(() => {
    const base = ['Datos personales'];
    if (type === 'equipment' || type === 'financing') base.push('Selección de equipo');
    base.push('Confirmar solicitud');
    return base;
  }, [type]);

  const handleSubmit = () => {
    if (!personalData) return;

    console.log('Solicitud enviada:', {
      personalData,
      equipment: selectedEquipment,
      type,
      amount,
      term,
    });

    // Aquí deberías llamar a tu servicio para registrar la solicitud
    // Por ejemplo: await createRequest({ ... })
  };

  return (
    <div className="flex min-h-screen">
      <StepNavigation currentStep={step} steps={steps} />

      <div className="flex-1 p-6">
        {step === 0 && (
          <StepPersonalData
            onNext={(data) => {
              setPersonalData(data);
              setStep(1);
            }}
          />
        )}

        {step === 1 && (type === 'equipment' || type === 'financing') && (
          <StepSelectEquipment
            onNext={(equipment) => {
              setSelectedEquipment(equipment);
              setStep(2);
            }}
            preselectedId={equipmentId}
          />
        )}

        {((type === 'cash' && step === 1) || step === 2) && personalData && (
          <StepConfirmRequest
            personalData={personalData}
            equipment={selectedEquipment}
            onSubmit={handleSubmit}
            type={type}
            amount={amount}
            term={term}
            onNext={() => {}}
          />
        )}
      </div>
    </div>
  );
}
