
import React, { useState } from 'react';
import { Experience, ResumeData } from '../../types';
import { enhanceTextWithAI } from '../../services/geminiService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { XCircleIcon, AiSparklesIcon } from '../ui/Icons';

interface StepExperienceProps {
  data: Experience[];
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ExperienceItem: React.FC<{
    item: Experience;
    onChange: (item: Experience) => void;
    onRemove: (id: string) => void;
    onEnhance: (id: string, text: string) => Promise<void>;
    isEnhancing: boolean;
    enhancingId: string | null;
}> = ({ item, onChange, onRemove, onEnhance, isEnhancing, enhancingId }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange({ ...item, [e.target.name]: e.target.value });
    };

    const handleEnhance = () => {
        onEnhance(item.id, item.description);
    };

    const isCurrentlyEnhancing = isEnhancing && enhancingId === item.id;

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-3 animate-[fadeIn_0.3s_ease]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" name="jobTitle" value={item.jobTitle} onChange={handleChange} placeholder="Job Title" className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
                <input type="text" name="company" value={item.company} onChange={handleChange} placeholder="Company" className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-400">Start Date</label><input type="month" name="startDate" value={item.startDate} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg"/></div>
                <div><label className="text-xs text-gray-400">End Date</label><input type="month" name="endDate" value={item.endDate} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg"/></div>
            </div>
            <textarea name="description" value={item.description} onChange={handleChange} rows={4} placeholder="Key responsibilities and achievements..." className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"></textarea>
            <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
                <button type="button" onClick={handleEnhance} disabled={isCurrentlyEnhancing || !item.description} className="px-3 py-1 text-sm btn-space rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                     {isCurrentlyEnhancing ? <LoadingSpinner /> : <AiSparklesIcon />}
                     {isCurrentlyEnhancing ? 'Enhancing...' : 'Enhance'}
                </button>
                <button type="button" onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm">
                   <XCircleIcon /> Remove
                </button>
            </div>
        </div>
    )
};


const StepExperience: React.FC<StepExperienceProps> = ({ data, setResumeData }) => {
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancingId, setEnhancingId] = useState<string | null>(null);

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: `exp-${Date.now()}`,
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setResumeData(prev => ({ ...prev, experience: [newExperience, ...prev.experience] }));
  };

  const handleUpdateExperience = (updatedItem: Experience) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.map(exp => exp.id === updatedItem.id ? updatedItem : exp) }));
  };

  const handleRemoveExperience = (id: string) => {
    setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };
  
  const handleEnhanceDescription = async (id: string, text: string) => {
    if (!text) return;
    setIsEnhancing(true);
    setEnhancingId(id);
    const enhancedText = await enhanceTextWithAI(text, 'experience');
    setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map(exp => 
            exp.id === id ? { ...exp, description: enhancedText } : exp
        )
    }));
    setIsEnhancing(false);
    setEnhancingId(null);
  };

  return (
    <div className="form-step active">
      <h2 className="text-2xl font-bold mb-6 orbitron">Work Experience</h2>
      <button type="button" onClick={handleAddExperience} className="mb-6 px-4 py-2 btn-space rounded-lg w-full">
        + Add Experience
      </button>
      <div className="space-y-6">
        {data.map(exp => (
          <ExperienceItem 
            key={exp.id}
            item={exp}
            onChange={handleUpdateExperience}
            onRemove={handleRemoveExperience}
            onEnhance={handleEnhanceDescription}
            isEnhancing={isEnhancing}
            enhancingId={enhancingId}
          />
        ))}
        {data.length === 0 && <p className="text-gray-400 text-center py-4">No experience added yet.</p>}
      </div>
    </div>
  );
};

export default StepExperience;
