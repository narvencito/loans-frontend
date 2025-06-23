import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { StepNavigation } from '../components/StepNavigation';
import { StepPersonalData } from '../components/StepPersonalData';
import { StepSelectEquipment } from '../components/StepSelectEquipment';
import { StepConfirmRequest } from '../components/StepConfirmRequest';
import { StepLoanDetails } from '../components/StepLoanDetails';
import { EquipmentItem, equipmentApi } from '@/features/equipment/api/equipment_api';
import { requestApi } from '../api/request_api';
import { RequestTypeEnum } from '@/shared/enums/request-type.enum';
import { showError, showConfirm, showSuccess } from '@/shared/utils/global-dialog-utils';
import { EmailConflictModal } from '../components/EmailConflictModal';

type SubmissionStatus = 'idle' | 'submitting' | 'success';
type RequestUrlType = 'cash' | 'equipment' | 'financing';

interface PersonalDataState {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  name: string;
  fullName: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  codeStudent: string;
}

export default function RequestWizardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlType = searchParams.get('type') as RequestUrlType | null;
  const equipmentId = searchParams.get('equipmentId');

  // Validar y convertir el tipo de solicitud
  const type = urlType === 'cash' || urlType === 'equipment' || urlType === 'financing' 
    ? urlType 
    : null;

  const [step, setStep] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalDataState | null>(null);

  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | undefined>(undefined);
  const [loanDetailsData, setLoanDetailsData] = useState<{ amount: number; term: number } | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [isLoadingEquipment, setIsLoadingEquipment] = useState(false);
  const [showEmailConflict, setShowEmailConflict] = useState(false);

  useEffect(() => {
    if (equipmentId && (type === 'equipment' || type === 'financing')) {
      setIsLoadingEquipment(true);
      equipmentApi.getById(equipmentId)
        .then(data => setSelectedEquipment(data))
        .catch(error => {
          console.error("Error fetching equipment by ID:", error);
          setSelectedEquipment(undefined);
          showError(
            'Error al Cargar Equipo',
            'No se pudo cargar el equipo seleccionado'
          );
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
    navigate('/general/equipment');
  };

  const getRequestTypeFromUrlType = (urlType: RequestUrlType): RequestTypeEnum => {
    switch (urlType) {
      case 'cash':
        return RequestTypeEnum.CASH;
      case 'equipment':
        return RequestTypeEnum.EQUIPMENT_LOAN;
      case 'financing':
        return RequestTypeEnum.EQUIPMENT_FINANCING;
    }
  };

  const handleSubmit = async () => {
    if (!personalData || !type) return;

    // Confirmar el correo electrónico antes de enviar
    const confirmed = await showConfirm(
      'Confirmar datos de registro',
      `El correo **${personalData.email}** será asociado a su DNI **${personalData.document}**. Esta información será utilizada para gestionar su solicitud y futuras comunicaciones.`
    );

    if (!confirmed) return;

    setSubmissionStatus('submitting');
    try {
      const requestType = getRequestTypeFromUrlType(type);

      const requestData = {
        firstName: personalData.firstName,
        paternalSurname: personalData.paternalSurname,
        maternalSurname: personalData.maternalSurname,
        document: personalData.document,
        email: personalData.email,
        phone: personalData.phone,
        address: personalData.address,
        codeStudent: personalData.codeStudent,
        type: requestType,
        equipmentId: selectedEquipment?.id,
        message: `Solicitud de ${type === 'cash' ? 'préstamo monetario' : type === 'equipment' ? 'préstamo de equipo' : 'financiamiento de equipo'}${loanDetailsData ? ` por S/ ${loanDetailsData.amount} a ${loanDetailsData.term} meses` : ''}`
      };

      // apiRequest manejará los mensajes de loading, success y error
      await requestApi.createPublic(requestData);
      setSubmissionStatus('success');
      navigate('/'); // Redirigir después de que el usuario vea el mensaje de éxito
      
    } catch (error: any) {
      console.error('Error al enviar la solicitud:', error);
      
      // Solo manejamos el caso especial de correo existente
      if (error.response?.status === 409) {
        setShowEmailConflict(true);
      }
      // Los demás errores ya son manejados por apiRequest
      setSubmissionStatus('idle');
    }
  };

  if (submissionStatus === 'submitting') {
    return (
      <div className="flex min-h-screen w-full">
        <StepNavigation currentStep={step} steps={steps} />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Enviando solicitud...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <StepNavigation currentStep={step} steps={steps} />
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="w-full">
          {steps[step] === 'Datos personales' && (
            <StepPersonalData 
              onNext={(data) => { 
                // Asegurarnos de que todos los campos requeridos estén presentes
                const fullData: PersonalDataState = {
                  ...data,
                  name: `${data.firstName} ${data.paternalSurname} ${data.maternalSurname}`.trim(),
                  fullName: `${data.firstName} ${data.paternalSurname} ${data.maternalSurname}`.trim(),
                  address: data.address || '', // Asegurarnos de que address sea string
                };
                setPersonalData(fullData);
                setStep(step + 1);
              }}
              onPrevious={() => setStep(step - 1)}
              showPreviousButton={step > 0}
            />
          )}
          {steps[step] === 'Selección de equipo' && !selectedEquipment && (
            <StepSelectEquipment
              onNext={(equipment) => { setSelectedEquipment(equipment); setStep(step + 1); }}
              onPrevious={() => setStep(step - 1)}
              preselectedId={equipmentId}
            />
          )}
          {steps[step] === 'Detalles del préstamo' && (
            <StepLoanDetails 
              onNext={(data) => { setLoanDetailsData(data); setStep(step + 1); }}
              onPrevious={() => setStep(step - 1)}
            />
          )}
          {steps[step] === 'Confirmar solicitud' && personalData && (
            <StepConfirmRequest
              personalData={personalData}
              equipment={selectedEquipment}
              loanDetails={loanDetailsData}
              onSubmit={handleSubmit}
              onPrevious={() => setStep(step - 1)}
              type={type}
            />
          )}
        </div>
      </div>

      {showEmailConflict && personalData && (
        <EmailConflictModal
          email={personalData.email}
          onClose={() => {
            setShowEmailConflict(false);
            setStep(0); // Volver al paso de datos personales
          }}
          onOpenLogin={() => navigate('/login')}
        />
      )}
    </div>
  );
}
