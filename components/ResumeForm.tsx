
import React from 'react';
import { ResumeData } from '../types';
import ProgressBar from './ProgressBar';
import StepPersonal from './steps/StepPersonal';
import StepSkills from './steps/StepSkills';
import StepExperience from './steps/StepExperience';
import StepEducation from './steps/StepEducation';
import FormControls from './FormControls';

interface ResumeFormProps {
  currentStep: number;
  totalSteps: number;
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onNext: () => void;
  onPrev: () => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ currentStep, totalSteps, resumeData, setResumeData, onNext, onPrev }) => {
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPersonal data={resumeData.personal} setResumeData={setResumeData} />;
      case 2:
        return <StepSkills data={resumeData.skills} setResumeData={setResumeData} />;
      case 3:
        return <StepExperience data={resumeData.experience} setResumeData={setResumeData} />;
      case 4:
        return <StepEducation data={resumeData.education} setResumeData={setResumeData} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-space-dark rounded-xl p-6 shadow-xl">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      <div className="space-y-6 mt-8">
        <div>
          {renderStep()}
        </div>
        <FormControls
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>
    </div>
  );
};

export default ResumeForm;
