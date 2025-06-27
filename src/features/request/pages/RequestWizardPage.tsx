import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBlocker } from 'react-router-dom';
import { StepPersonalData } from '../components/StepPersonalData';
import { StepSelectEquipment } from '../components/StepSelectEquipment';
import { StepLoanDetails } from '../components/StepLoanDetails';
import { StepConfirmRequest } from '../components/StepConfirmRequest';
import { requestApi } from '../api/request_api';
import { EquipmentItem } from '@/features/equipment/api/equipment_api';
import { showConfirm } from '@/shared/utils/global-dialog-utils';
import { StepNavigation } from '../components/StepNavigation';
import { EmailConflictModal } from '../components/EmailConflictModal';
import { RequestTypeEnum } from '@/shared/enums/request-type.enum';

interface PersonalData {
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  document: string;
  email: string;
  phone: string;
  address: string;
  codeStudent: string;
}

interface LoanDetails {
  amount?: number;
  term: number;
  downPayment?: number;
}

type SubmissionStatus = 'idle' | 'submitting' | 'success' | 'error';

export const RequestWizardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as RequestTypeEnum;
  const equipmentId = searchParams.get('equipmentId');
  const [currentStep, setCurrentStep] = useState(0);
  const [personalData, setPersonalData] = useState<PersonalData | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [loanDetails, setLoanDetails] = useState<LoanDetails | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>('idle');
  const [showEmailConflict, setShowEmailConflict] = useState(false);

  const steps = ['Datos personales', 'Seleccionar equipo', 'Detalles del préstamo', 'Confirmar solicitud'];

  const getRequestTitle = () => {
    switch (type) {
      case RequestTypeEnum.EQUIPMENT_FINANCING:
        return 'Financiamiento de Equipo';
      case RequestTypeEnum.EQUIPMENT_LOAN:
        return 'Préstamo de Equipo';
      case RequestTypeEnum.CASH:
        return 'Préstamo de Efectivo';
      default:
        return 'Solicitud';
    }
  };

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => 
      hasChanges && currentLocation.pathname !== nextLocation.pathname && submissionStatus !== 'success'
  );

  if (blocker.state === "blocked") {
    showConfirm(
      'Salir del formulario',
      '¿Estás seguro que deseas salir? Los datos ingresados se perderán.'
    ).then((confirmed) => {
      if (confirmed) {
        blocker.proceed();
      } else {
        blocker.reset();
      }
    });
  }

  const handlePersonalDataSubmit = (data: Omit<PersonalData, 'address'> & { address?: string }) => {
    setPersonalData({
      ...data,
      address: data.address || ''
    });
    setHasChanges(true);
    setCurrentStep(1);
  };

  const handleEquipmentSelect = (equipment: EquipmentItem) => {
    setSelectedEquipment(equipment);
    setHasChanges(true);
    setCurrentStep(2);
  };

  const handleLoanDetailsSubmit = (data: LoanDetails) => {
    setLoanDetails(data);
    setHasChanges(true);
    setCurrentStep(3);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!personalData || !selectedEquipment || !loanDetails || !type) return;

    try {
      setSubmissionStatus('submitting');

      const fullName = `${personalData.firstName} ${personalData.paternalSurname} ${personalData.maternalSurname}`;
      const isFinancing = type === RequestTypeEnum.EQUIPMENT_FINANCING;
      const message = isFinancing 
        ? `Solicitud de financiamiento de equipo por S/ ${selectedEquipment.salePrice.toFixed(2)} a ${loanDetails.term} meses`
        : `Solicitud de préstamo de equipo por ${loanDetails.term} días`;

      await requestApi.createPublic({
        name: personalData.firstName,
        paternalSurname: personalData.paternalSurname,
        maternalSurname: personalData.maternalSurname,
        documentNumber: personalData.document,
        email: personalData.email,
        phone: personalData.phone,
        codeStudent: personalData.codeStudent,
        fullName: fullName,
        requestTypeId: type,
        equipmentId: selectedEquipment.id,
        message: message,
        ...(isFinancing 
          ? { 
              termInMonths: loanDetails.term,
              interestRate: 0.15,
              downPayment: loanDetails.downPayment || 0
            }
          : { 
              termInDays: loanDetails.term 
            }
        )
      });

      setSubmissionStatus('success');
      setHasChanges(false);
      navigate('/');
    } catch (error: any) {
      setSubmissionStatus('error');
      if (error?.response?.status === 409) {
        setShowEmailConflict(true);
      }
    }
  };

  if (!type || !Object.values(RequestTypeEnum).includes(type)) {
    navigate('/');
    return null;
  }

  useEffect(() => {
    if (equipmentId) {
      setCurrentStep(0);
    }
  }, [equipmentId]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <StepNavigation 
        currentStep={currentStep} 
        steps={steps}
        title={getRequestTitle()}
      />
      
      <div className="flex-1 p-4 md:p-8">
        {currentStep === 0 && (
          <StepPersonalData
            onNext={handlePersonalDataSubmit}
            initialData={personalData || undefined}
          />
        )}

        {currentStep === 1 && (
          <StepSelectEquipment
            onNext={handleEquipmentSelect}
            onPrevious={handlePrevious}
            preselectedId={equipmentId}
          />
        )}

        {currentStep === 2 && (
          <StepLoanDetails
            onNext={handleLoanDetailsSubmit}
            onPrevious={handlePrevious}
            isFinancing={type === RequestTypeEnum.EQUIPMENT_FINANCING}
            selectedEquipment={selectedEquipment || undefined}
            initialData={loanDetails || undefined}
          />
        )}

        {currentStep === 3 && personalData && (
          <StepConfirmRequest
            personalData={{
              ...personalData,
              name: personalData.firstName,
              fullName: `${personalData.firstName} ${personalData.paternalSurname} ${personalData.maternalSurname}`
            }}
            equipment={selectedEquipment!}
            loanDetails={loanDetails}
            requestType={type}
            onConfirm={handleSubmit}
            onPrevious={handlePrevious}
          />
        )}

        {showEmailConflict && personalData && (
          <EmailConflictModal
            onClose={() => setShowEmailConflict(false)}
            email={personalData.email}
          />
        )}
      </div>
    </div>
  );
};
