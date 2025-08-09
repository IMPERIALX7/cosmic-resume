
import React, { useState } from 'react';
import { Skill, ResumeData } from '../../types';
import { XCircleIcon } from '../ui/Icons';

interface StepSkillsProps {
  data: Skill[];
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const StepSkills: React.FC<StepSkillsProps> = ({ data, setResumeData }) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(5);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: newSkillName.trim(),
      level: newSkillLevel,
    };
    setResumeData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
    setNewSkillName('');
    setNewSkillLevel(5);
  };

  const handleRemoveSkill = (id: string) => {
    setResumeData(prev => ({ ...prev, skills: prev.skills.filter(skill => skill.id !== id) }));
  };

  return (
    <div className="form-step active">
      <h2 className="text-2xl font-bold mb-6 orbitron">Skills</h2>
      <div className="space-y-3 mb-4 min-h-[150px]">
        {data.map(skill => (
          <div key={skill.id} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg animate-[fadeIn_0.3s_ease]">
            <span className="font-medium">{skill.name} (Level: {skill.level}/10)</span>
            <button type="button" onClick={() => handleRemoveSkill(skill.id)} className="text-red-400 hover:text-red-300">
              <XCircleIcon />
            </button>
          </div>
        ))}
        {data.length === 0 && <p className="text-gray-400 text-center py-4">No skills added yet.</p>}
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 p-4 bg-gray-800 rounded-lg">
        <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} placeholder="Skill name (e.g., React)" className="flex-grow w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"/>
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <input type="range" value={newSkillLevel} onChange={(e) => setNewSkillLevel(parseInt(e.target.value))} min="1" max="10" className="w-full sm:w-24"/>
            <span className='w-8 text-center'>{newSkillLevel}</span>
        </div>
        <button type="button" onClick={handleAddSkill} className="px-4 py-2 btn-space rounded-lg w-full sm:w-auto">Add</button>
      </div>
    </div>
  );
};

export default StepSkills;
