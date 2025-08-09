
import React, { useState } from 'react';
import { PersonalData, ResumeData, SummaryOption } from '../../types';
import { getEnhancedSummaryOptions } from '../../services/geminiService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { AiSparklesIcon } from '../ui/Icons';
import EnhancementModal from '../modals/EnhancementModal';

interface StepPersonalProps {
  data: PersonalData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const StepPersonal: React.FC<StepPersonalProps> = ({ data, setResumeData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [summaryOptions, setSummaryOptions] = useState<SummaryOption[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };
  
  const handleEnhanceClick = async () => {
      if (!data.summary || !data.summary.trim()) return;
      setIsModalOpen(true);
      setIsEnhancing(true);
      setSummaryOptions([]); // Clear old options
      const options = await getEnhancedSummaryOptions(data.summary);
      setSummaryOptions(options);
      setIsEnhancing(false);
  };

  const handleSelectSummary = (selectedContent: string) => {
    setResumeData(prev => ({...prev, personal: {...prev.personal, summary: selectedContent}}));
    setIsModalOpen(false);
  };

  return (
    <>
      <EnhancementModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isEnhancing}
        options={summaryOptions}
        onSelect={handleSelectSummary}
        originalSummary={data.summary}
      />
      <div className="form-step active">
        <h2 className="text-2xl font-bold mb-6 orbitron">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm mb-1 text-gray-400">Full Name</label><input type="text" name="name" value={data.name} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/></div>
          <div><label className="block text-sm mb-1 text-gray-400">Job Title</label><input type="text" name="title" value={data.title} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/></div>
          <div><label className="block text-sm mb-1 text-gray-400">Email</label><input type="email" name="email" value={data.email} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/></div>
          <div><label className="block text-sm mb-1 text-gray-400">Phone</label><input type="tel" name="phone" value={data.phone} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/></div>
          <div><label className="block text-sm mb-1 text-gray-400">Location</label><input type="text" name="location" value={data.location} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/></div>
          <div><label className="block text-sm mb-1 text-gray-400">LinkedIn Profile URL</label><input type="url" name="linkedin" value={data.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/></div>
          <div className="md:col-span-2">
              <label className="block text-sm mb-1 text-gray-400">Professional Summary</label>
              <textarea name="summary" rows={4} value={data.summary} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"></textarea>
              <button type="button" onClick={handleEnhanceClick} disabled={isEnhancing || !data.summary || !data.summary.trim()} className="mt-2 px-4 py-2 text-sm btn-space rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isEnhancing && isModalOpen ? <LoadingSpinner/> : <AiSparklesIcon />}
                  {isEnhancing && isModalOpen ? 'Enhancing...' : 'Enhance with AI'}
              </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepPersonal;
