import React, { useState } from 'react';
import { ResumeData } from './types';
import Background from './components/Background';
import Header from './components/Header';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import InteractiveCursor from './components/ui/InteractiveCursor';

const initialResumeData: ResumeData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    photo: '',
  },
  skills: [],
  experience: [],
  education: [],
};

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [backgroundTheme, setBackgroundTheme] = useState<number>(1);
  const totalSteps = 4;
  const totalThemes = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(step => step + 1);
      setBackgroundTheme(theme => (theme % totalThemes) + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(step => step - 1);
      setBackgroundTheme(theme => (theme === 1 ? totalThemes : theme - 1));
    }
  };

  return (
    <>
      <InteractiveCursor />
      <Background theme={backgroundTheme} />
      <div className="container mx-auto px-4 py-8 sm:py-12 relative z-10">
        <Header />
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <div className="w-full lg:w-1/2">
            <ResumeForm
              currentStep={currentStep}
              totalSteps={totalSteps}
              resumeData={resumeData}
              setResumeData={setResumeData}
              onNext={handleNext}
              onPrev={handlePrev}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <ResumePreview resumeData={resumeData} setResumeData={setResumeData} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
