interface Props {
  currentStep: number;
  steps: string[];
}

export const StepNavigation = ({ currentStep, steps }: Props) => (
  <aside className="w-64 bg-[#4c0326] text-white p-6 hidden md:block">
    <h2 className="text-xl font-bold mb-6">Solicita tu {steps.length === 2 ? 'Préstamo' : 'Financiamiento'}</h2>
    <ol className="space-y-4">
      {steps.map((label, index) => (
        <li key={index} className={index === currentStep ? 'font-bold text-yellow-300' : 'text-white'}>
          {index <= currentStep ? '✓' : index + 1}. {label}
        </li>
      ))}
    </ol>
  </aside>
);