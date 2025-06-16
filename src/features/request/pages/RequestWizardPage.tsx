import { useState, useMemo, useEffect } from 'react'; // Added useEffect
import { useSearchParams } from 'react-router-dom';
import { StepNavigation } from '../components/StepNavigation';
import { StepPersonalData } from '../components/StepPersonalData';
import { StepSelectEquipment } from '../components/StepSelectEquipment';
import { StepConfirmRequest } from '../components/StepConfirmRequest';
import { StepLoanDetails } from '../components/StepLoanDetails';
import { EquipmentItem, equipmentApi } from '@/features/equipment/api/equipment_api'; // Added equipmentApi

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
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(false); // For loading indicator

  // Effect to fetch equipment if equipmentId is present in URL
  useEffect(() => {
    if (equipmentId && (type === 'equipment' || type === 'financing')) {
      setIsLoadingEquipment(true);
      equipmentApi.getById(equipmentId)
        .then(data => {
          setSelectedEquipment(data);
        })
        .catch(error => {
          console.error("Error fetching equipment by ID:", error);
          setSelectedEquipment(undefined); // Clear if error
          // Optionally, remove equipmentId from URL if not found or redirect
          // setSearchParams(prev => { prev.delete('equipmentId'); return prev; });
        })
        .finally(() => {
          setIsLoadingEquipment(false);
        });
    } else {
      // Clear selectedEquipment if equipmentId is not present or type is not relevant
      setSelectedEquipment(undefined);
    }
  }, [equipmentId, type, setSearchParams]); // Added setSearchParams to dependencies

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
    return ['Datos personales', 'Confirmar solicitud']; // Default or error case for robustness
  }, [type, selectedEquipment]);

  const resetWizard = () => {
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

  // handleSubmit remains the same for now

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

  // Render loading indicator for equipment fetching
  if (isLoadingEquipment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="text-2xl font-semibold text-gray-700">Cargando equipo...</div>
        {/* Optional: Add a spinner animation here */}
      </div>
    );
  }

  // Submission status messages (submitting, success, error) remain unchanged from previous step
  // ... (assuming these are already correctly placed before this return statement)

  // Render the wizard steps if status is 'idle'
  return (
    <div className="flex min-h-screen">
      <StepNavigation currentStep={step} steps={steps} />

      <div className="flex-1 p-6 flex flex-col items-center pt-10">
        {submissionStatus === 'idle' && (
          <>
            {steps[step] === 'Datos personales' && (
              <StepPersonalData
                onNext={(data) => {
                  setPersonalData(data);
                  setStep(step + 1);
                }}
              />
            )}

            {steps[step] === 'Selección de equipo' && !selectedEquipment && ( // Ensure not to show if already selected via URL
              <StepSelectEquipment
                onNext={(equipment) => {
                  setSelectedEquipment(equipment);
                  setStep(step + 1);
                }}
                preselectedId={equipmentId} // This might be redundant if selectedEquipment is already loaded
              />
            )}

            {steps[step] === 'Detalles del préstamo' && (
              <StepLoanDetails
                onNext={(data) => {
                  setLoanDetailsData(data);
                  setStep(step + 1);
                }}
              />
            )}

            {steps[step] === 'Confirmar solicitud' && personalData && (
              <StepConfirmRequest
                personalData={personalData}
                equipment={selectedEquipment} // This will be correctly undefined or set
                loanDetails={loanDetailsData}
                onSubmit={handleSubmit}
                type={type}
                // amount and term props on StepConfirmRequest were originally for the direct values,
                // but loanDetails object is now the primary source.
                // Keep them if StepConfirmRequest still uses them, otherwise they can be removed from there.
                // For now, mirror the previous logic for these specific props.
                amount={(type === 'cash' || type === 'financing') ? loanDetailsData?.amount?.toString() ?? null : null}
                term={(type === 'cash' || type === 'financing') ? loanDetailsData?.term?.toString() ?? null : null}
                onNext={() => {}}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
