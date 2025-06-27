import { useNavigate } from 'react-router-dom';
import { showConfirm } from '@/shared/utils/global-dialog-utils';

interface Props {
  currentStep: number;
  steps: string[];
  title: string;
}

export const StepNavigation = ({ currentStep, steps, title }: Props) => {
  const navigate = useNavigate();
  
  const handleCancelRequest = async () => {
    const confirmed = await showConfirm(
      'Cancelar solicitud',
      '¿Estás seguro que deseas cancelar la solicitud? Los datos ingresados se perderán.'
    );

    if (confirmed) {
      navigate('/');
    }
  };
  
  return (
    <>
      {/* Versión móvil - Barra superior */}
      <div className="md:hidden bg-[#4c0326] text-white p-4 relative z-20">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={handleCancelRequest}
            className="text-gray-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center px-2">
          {steps.map((label, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 text-sm
                ${index === currentStep ? 'bg-yellow-300 text-[#4c0326]' : 
                  index < currentStep ? 'bg-green-500' : 'bg-white/20'}`}>
                {index < currentStep ? '✓' : index + 1}
              </div>
              <div className={`text-xs text-center ${index === currentStep ? 'text-yellow-300' : ''}`}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Versión desktop - Barra lateral */}
      <aside className="hidden md:block w-64 bg-[#4c0326] text-white p-6 relative z-20">
        <div className="flex flex-col h-full">
          <div>
            <h2 className="text-xl font-bold mb-6">{title}</h2>
          </div>
          
          <ol className="space-y-4 mb-auto">
            {steps.map((label, index) => (
              <li key={index} className={`flex items-center gap-2 ${index === currentStep ? 'font-bold text-yellow-300' : 'text-white'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center
                  ${index === currentStep ? 'bg-yellow-300 text-[#4c0326]' : 
                    index < currentStep ? 'bg-green-500' : 'bg-white/20'}`}>
                  {index < currentStep ? '✓' : index + 1}
                </span>
                {label}
              </li>
            ))}
          </ol>

          <div className="pt-6 mt-auto border-t border-white/10">
            <button
              onClick={handleCancelRequest}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200 w-full justify-center py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Cancelar solicitud
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};