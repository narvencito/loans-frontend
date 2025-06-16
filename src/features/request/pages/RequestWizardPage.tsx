import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StepNavigation } from '../components/StepNavigation';
import { StepPersonalData } from '../components/StepPersonalData';
import { StepSelectEquipment } from '../components/StepSelectEquipment';
import { StepConfirmRequest } from '../components/StepConfirmRequest';
import { StepLoanDetails } from '../components/StepLoanDetails';
import { EquipmentItem } from '@/features/equipment/api/equipment_api';

// Define SubmissionStatus type
type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function RequestWizardPage() {
  const [searchParams, setSearchParams] = useSearchParams(); // Added setSearchParams for potential reset
  const type = searchParams.get('type'); // 'equipment' | 'financing' | 'cash'
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

  const steps = useMemo(() => {
    if (type === 'cash') {
      return ['Datos personales', 'Detalles del préstamo', 'Confirmar solicitud'];
    } else if (type === 'equipment') {
      return ['Datos personales', 'Selección de equipo', 'Confirmar solicitud'];
    } else if (type === 'financing') {
      return ['Datos personales', 'Selección de equipo', 'Detalles del préstamo', 'Confirmar solicitud'];
    }
    return ['Datos personales', 'Confirmar solicitud']; // Default or error case for robustness
  }, [type]);

  const resetWizard = () => {
    setStep(0);
    setPersonalData(null);
    setSelectedEquipment(undefined);
    setLoanDetailsData(null);
    setSubmissionStatus('idle');
    setSubmittedData(null);
    // Optionally clear search params by navigating or using setSearchParams
    // setSearchParams({}); // Example: Clears all search params
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

    // Simulate API call
    setTimeout(() => {
      setSubmissionStatus('success'); // Simulate success
      // To simulate error in the future:
      // if (Math.random() > 0.5) setSubmissionStatus('success');
      // else setSubmissionStatus('error');
    }, 1500);
  };

  if (submissionStatus === 'submitting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="text-2xl font-semibold text-gray-700">Enviando solicitud...</div>
        {/* Optional: Add a spinner animation here */}
      </div>
    );
  }

  if (submissionStatus === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg w-full">
          <h2 className="text-3xl font-bold text-green-600 mb-4">¡Solicitud enviada con éxito!</h2>
          <p className="text-gray-700 mb-6">
            Hemos recibido tu solicitud y nos pondremos en contacto contigo pronto.
          </p>
          {submittedData && (
            <div className="text-left bg-gray-50 p-4 rounded-md my-4">
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Resumen de la Solicitud:</h3>
              <p className="text-sm text-gray-600 break-words"><strong>Tipo:</strong> {submittedData.type}</p>
              <p className="text-sm text-gray-600 break-words"><strong>Nombre:</strong> {submittedData.personalData.name}</p>
              <p className="text-sm text-gray-600 break-words"><strong>Email:</strong> {submittedData.personalData.email}</p>
              {submittedData.personalData.phone && (
                <p className="text-sm text-gray-600 break-words"><strong>Teléfono:</strong> {submittedData.personalData.phone}</p>
              )}
              {submittedData.equipment && (
                <p className="text-sm text-gray-600 break-words"><strong>Equipo:</strong> {submittedData.equipment.name} ({submittedData.equipment.code})</p>
              )}
              {submittedData.loanDetails && (
                <>
                  <p className="text-sm text-gray-600">
                    <strong>Monto Solicitado:</strong>
                    {new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(submittedData.loanDetails.amount)}
                  </p>
                  <p className="text-sm text-gray-600"><strong>Plazo:</strong> {submittedData.loanDetails.term} meses</p>
                </>
              )}
            </div>
          )}
          <button
            onClick={resetWizard}
            className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Realizar otra solicitud
          </button>
        </div>
      </div>
    );
  }

  if (submissionStatus === 'error') {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
        <div className="bg-white p-10 rounded-lg shadow-xl max-w-lg w-full">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Error al enviar la solicitud</h2>
          <p className="text-gray-700 mb-6">
            Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.
          </p>
          <button
            onClick={resetWizard} // Allows user to go back to step 0 (or first step of form)
            className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Volver a intentarlo
          </button>
        </div>
      </div>
    );
  }

  // Render the wizard steps if status is 'idle'
  return (
    <div className="flex min-h-screen">
      <StepNavigation currentStep={step} steps={steps} />

      <div className="flex-1 p-6">
        {/* Step 0: Personal Data */}
        {step === 0 && (
          <StepPersonalData
            onNext={(data) => {
              setPersonalData(data);
              setStep(1);
            }}
          />
        )}

        {/* Step 1: Equipment Selection (for 'equipment' or 'financing') */}
        {step === 1 && (type === 'equipment' || type === 'financing') && (
          <StepSelectEquipment
            onNext={(equipment) => {
              setSelectedEquipment(equipment);
              setStep(2); // Next step is 2 for these types
            }}
            preselectedId={equipmentId}
          />
        )}

        {/* Step 1: Loan Details (for 'cash') */}
        {step === 1 && type === 'cash' && (
          <StepLoanDetails
            onNext={(data) => {
              setLoanDetailsData(data);
              setStep(2); // Next step is 2 for 'cash'
            }}
          />
        )}

        {/* Step 2: Loan Details (for 'financing' - after equipment selection) */}
        {step === 2 && type === 'financing' && (
          <StepLoanDetails
            onNext={(data) => {
              setLoanDetailsData(data);
              setStep(3); // Next step is 3 for 'financing'
            }}
          />
        )}

        {/* Step 2 (for 'cash' or 'equipment') or Step 3 (for 'financing'): Confirmation */}
        {personalData && (
          <>
            {type === 'cash' && step === 2 && (
              <StepConfirmRequest
                personalData={personalData}
                equipment={undefined} // No equipment for 'cash'
                loanDetails={loanDetailsData}
                onSubmit={handleSubmit}
                type={type}
                onNext={() => {}} // Not used in confirm step
              />
            )}
            {type === 'equipment' && step === 2 && (
              <StepConfirmRequest
                personalData={personalData}
                equipment={selectedEquipment}
                loanDetails={null} // No loan details for 'equipment'
                onSubmit={handleSubmit}
                type={type}
                onNext={() => {}}
              />
            )}
            {type === 'financing' && step === 3 && (
              <StepConfirmRequest
                personalData={personalData}
                equipment={selectedEquipment}
                loanDetails={loanDetailsData}
                onSubmit={handleSubmit}
                type={type}
                onNext={() => {}}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
