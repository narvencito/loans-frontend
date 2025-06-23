import { useNavigate } from 'react-router-dom';

interface Props {
  currentStep: number;
  steps: string[];
}

export const StepNavigation = ({ currentStep, steps }: Props) => {
  const navigate = useNavigate();
  
  return (
    <aside className="w-64 bg-[#4c0326] text-white p-6 hidden md:block">
      <div className="flex flex-col h-full">
        <div>
          <h2 className="text-xl font-bold mb-6">Solicita tu {steps.length === 2 ? 'Préstamo' : 'Financiamiento'}</h2>
        </div>
        
        <ol className="space-y-4 mb-auto">
          {steps.map((label, index) => (
            <li key={index} className={index === currentStep ? 'font-bold text-yellow-300' : 'text-white'}>
              {index <= currentStep ? '✓' : index + 1}. {label}
            </li>
          ))}
        </ol>

        <div className="pt-6 mt-auto border-t border-white/10">
          <button
            onClick={() => navigate('/')}
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
  );
};