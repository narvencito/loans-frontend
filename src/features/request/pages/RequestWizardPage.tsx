import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StepNavigation } from '../components/StepNavigation';
import { StepPersonalData } from '../components/StepPersonalData';
import { StepSelectEquipment } from '../components/StepSelectEquipment';
import { StepConfirmRequest } from '../components/StepConfirmRequest';
import { StepLoanDetails } from '../components/StepLoanDetails';
import { EquipmentItem, equipmentApi } from '@/features/equipment/api/equipment_api';

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function RequestWizardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type');
  const equipmentId = searchParams.get('equipmentId');

  const [step, setStep] = useState(0);
  const [personalData, setPersonalData] = useState<{
    name: string;
    document: string;
    email: string;
    phone?: string;
    address?: string;
  } | null>(null);

  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | undefined>(undefined);
  const [loanDetailsData, setLoanDetailsData] = useState<{ amount: number; term: number } | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);

  useEffect(() => {
    if (equipmentId && (type === 'equipment' || type === 'financing')) {
      setIsLoadingEquipment(true);
      equipmentApi.getById(equipmentId)
        .then(data => setSelectedEquipment(data))
        .catch(error => {
          console.error("Error fetching equipment by ID:", error);
          setSelectedEquipment(undefined);
        })
        .finally(() => setIsLoadingEquipment(false));
    } else {
      setSelectedEquipment(undefined);
    }
  }, [equipmentId, type]);

  const steps = useMemo(() => {
    const hasPreselectedEquipment = !!selectedEquipment && (type === 'equipment' || type === 'financing');
    if (type === 'cash') {
      return ['Datos personales', 'Detalles del préstamo', 'Confirmar solicitud'];
    } else if (type === 'equipment') {
      return hasPreselectedEquipment
        ? ['Datos personales', 'Confirmar solicitud']
        : ['Datos personales', 'Selección de equipo', 'Confirmar solicitud'];
    } else if (type === 'financing') {
      return hasPreselectedEquipment
        ? ['Datos personales', 'Detalles del préstamo', 'Confirmar solicitud']
        : ['Datos personales', 'Selección de equipo', 'Detalles del préstamo', 'Confirmar solicitud'];
    }
    return ['Datos personales', 'Confirmar solicitud'];
  }, [type, selectedEquipment]);

  const resetWizard = () => {
    setStep(0);
    setPersonalData(null);
    setSelectedEquipment(undefined);
    setLoanDetailsData(null);
    setSubmissionStatus('idle');
    setSubmittedData(null);
  };

  const handleSubmit = () => {
    if (!personalData) return;
    const currentSubmittedData = {
      personalData,
      equipment: selectedEquipment,
      loanDetails: loanDetailsData,
      type,
    };
    console.log('Solicitud enviada:', currentSubmittedData);
    setSubmittedData(currentSubmittedData);
    setSubmissionStatus('submitting');
    setTimeout(() => setSubmissionStatus('success'), 1500);
  };

  if (submissionStatus === 'submitting') {
    return <div className="flex justify-center items-center min-h-screen">Enviando solicitud...</div>;
  }
  if (submissionStatus === 'success') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-8 bg-white rounded shadow">
          <h2 className="text-2xl text-green-600 font-bold mb-4">¡Solicitud enviada con éxito!</h2>
          <button onClick={resetWizard} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Nueva solicitud</button>
        </div>
      </div>
    );
  }
  if (submissionStatus === 'error') {
    return <div className="text-red-500 text-center p-8">Error al enviar la solicitud. Inténtalo nuevamente.</div>;
  }
  if (isLoadingEquipment) {
    return <div className="flex justify-center items-center min-h-screen">Cargando equipo...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <StepNavigation currentStep={step} steps={steps} />
      <div className="flex-1 p-6">
        {steps[step] === 'Datos personales' && (
          <StepPersonalData onNext={(data) => { setPersonalData(data); setStep(step + 1); }} />
        )}
        {steps[step] === 'Selección de equipo' && !selectedEquipment && (
          <StepSelectEquipment
            onNext={(equipment) => { setSelectedEquipment(equipment); setStep(step + 1); }}
            preselectedId={equipmentId}
          />
        )}
        {steps[step] === 'Detalles del préstamo' && (
          <StepLoanDetails onNext={(data) => { setLoanDetailsData(data); setStep(step + 1); }} />
        )}
        {steps[step] === 'Confirmar solicitud' && personalData && (
          <StepConfirmRequest
            personalData={personalData}
            equipment={selectedEquipment}
            loanDetails={loanDetailsData}
            onSubmit={handleSubmit}
            type={type}
            onNext={() => {}}
          />
        )}
      </div>
    </div>
  );
}
