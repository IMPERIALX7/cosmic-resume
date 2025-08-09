
import React from 'react';

interface FormControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}

const FormControls: React.FC<FormControlsProps> = ({ currentStep, totalSteps, onPrev, onNext }) => {
    const handleFinish = () => {
        alert("Your resume is finalized! You can now download it as a PDF from the preview pane.");
    };

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-gray-700/50">
      {currentStep > 1 ? (
        <button type="button" onClick={onPrev} className="px-6 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors">
          &larr; Previous
        </button>
      ) : <div />}
      
      {currentStep < totalSteps ? (
        <button type="button" onClick={onNext} className="px-6 py-2 btn-space rounded-lg ml-auto">
          Next &rarr;
        </button>
      ) : (
        <button 
          type="button" 
          onClick={handleFinish} 
          className="px-6 py-2 bg-green-600 hover:bg-green-500 transition-colors rounded-lg ml-auto flex items-center justify-center gap-2"
        >
          🚀 Finalize Resume
        </button>
      )}
    </div>
  );
};

export default FormControls;
