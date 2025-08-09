
import React from 'react';
import { Education, ResumeData } from '../../types';
import { XCircleIcon } from '../ui/Icons';

interface StepEducationProps {
  data: Education[];
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const EducationItem: React.FC<{
    item: Education;
    onChange: (item: Education) => void;
    onRemove: (id: string) => void;
}> = ({ item, onChange, onRemove }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...item, [e.target.name]: e.target.value });
    };

    return (
         <div className="bg-gray-800 p-4 rounded-lg space-y-3 animate-[fadeIn_0.3s_ease]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="text" name="degree" value={item.degree} onChange={handleChange} placeholder="Degree (e.g., B.S. in Computer Science)" className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
                <input type="text" name="institution" value={item.institution} onChange={handleChange} placeholder="Institution" className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-400">Start Date</label><input type="month" name="startDate" value={item.startDate} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg"/></div>
                <div><label className="text-xs text-gray-400">End Date</label><input type="month" name="endDate" value={item.endDate} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg"/></div>
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={() => onRemove(item.id)} className="text-red-400 hover:text-red-300 flex items-center gap-1 text-sm">
                    <XCircleIcon /> Remove
                </button>
            </div>
        </div>
    )
}

const StepEducation: React.FC<StepEducationProps> = ({ data, setResumeData }) => {
  const handleAddEducation = () => {
    const newEducation: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      startDate: '',
      endDate: ''
    };
    setResumeData(prev => ({ ...prev, education: [newEducation, ...prev.education] }));
  };
  
  const handleUpdateEducation = (updatedItem: Education) => {
    setResumeData(prev => ({ ...prev, education: prev.education.map(edu => edu.id === updatedItem.id ? updatedItem : edu) }));
  };

  const handleRemoveEducation = (id: string) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  };

  return (
    <div className="form-step active">
      <h2 className="text-2xl font-bold mb-6 orbitron">Education</h2>
       <button type="button" onClick={handleAddEducation} className="mb-6 px-4 py-2 btn-space rounded-lg w-full">
        + Add Education
      </button>
      <div className="space-y-6">
        {data.map(edu => (
          <EducationItem key={edu.id} item={edu} onChange={handleUpdateEducation} onRemove={handleRemoveEducation} />
        ))}
        {data.length === 0 && <p className="text-gray-400 text-center py-4">No education history added yet.</p>}
      </div>
    </div>
  );
};

export default StepEducation;
