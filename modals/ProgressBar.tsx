
import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const steps = ["Personal", "Skills", "Experience", "Education"];

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
    const getStepClass = (step: number) => {
        if (step === currentStep) {
            return 'bg-gradient-to-r from-purple-500 to-blue-500 text-white';
        }
        if (step < currentStep) {
            return 'bg-green-500 text-white';
        }
        return 'bg-gray-600 text-gray-300';
    };

    const getTextClass = (step: number) => {
        return step === currentStep ? 'text-white' : 'opacity-50';
    }

    return (
        <div className="flex justify-between">
            {steps.map((name, index) => {
                const stepNumber = index + 1;
                return (
                    <div key={stepNumber} className={`step-indicator flex items-center transition-opacity duration-300 ${getTextClass(stepNumber)}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold orbitron transition-colors duration-300 ${getStepClass(stepNumber)}`}>
                            {stepNumber}
                        </div>
                        <div className="ml-2 text-sm hidden sm:block">{name}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProgressBar;
