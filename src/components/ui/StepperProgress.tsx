import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
}

interface StepperProgressProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  onClick?: (stepIndex: number) => void;
  allowStepNavigation?: boolean;
}

export const StepperProgress: React.FC<StepperProgressProps> = ({
  steps,
  currentStep,
  completedSteps = [],
  onClick,
  allowStepNavigation = false
}) => {
  const isStepCompleted = (stepIndex: number) => completedSteps.includes(stepIndex);
  const isStepCurrent = (stepIndex: number) => stepIndex === currentStep;
  const isStepClickable = (stepIndex: number) => allowStepNavigation && (isStepCompleted(stepIndex) || stepIndex <= currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex items-center">
              <button
                onClick={() => isStepClickable(index) && onClick?.(index)}
                disabled={!isStepClickable(index)}
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${isStepCompleted(index)
                    ? 'bg-primary text-white hover:bg-primary-dark focus:ring-primary'
                    : isStepCurrent(index)
                    ? 'bg-primary text-white shadow-lg focus:ring-primary'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }
                  ${isStepClickable(index) 
                    ? 'cursor-pointer' 
                    : 'cursor-default'
                  }
                `}
              >
                {isStepCompleted(index) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              
              {/* Step Label */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                <div className={`text-sm font-medium ${
                  isStepCurrent(index) || isStepCompleted(index)
                    ? 'text-primary'
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-400 mt-1">
                    {step.description}
                  </div>
                )}
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 mb-6">
                <div className={`h-full transition-colors duration-300 ${
                  isStepCompleted(index) || (isStepCompleted(index + 1))
                    ? 'bg-primary'
                    : 'bg-gray-200'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress Bar Alternative (Mobile) */}
      <div className="mt-8 md:hidden">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Paso {currentStep + 1} de {steps.length}</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-gray-900">
            {steps[currentStep]?.title}
          </span>
          {steps[currentStep]?.description && (
            <div className="text-xs text-gray-500 mt-1">
              {steps[currentStep].description}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepperProgress; 