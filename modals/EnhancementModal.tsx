
import React from 'react';
import { SummaryOption } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';
import { XCircleIcon } from '../ui/Icons';

interface EnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  options: SummaryOption[];
  onSelect: (content: string) => void;
  originalSummary: string;
}

const EnhancementModal: React.FC<EnhancementModalProps> = ({ isOpen, onClose, isLoading, options, onSelect, originalSummary }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-space-dark rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-[fadeIn_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <XCircleIcon />
        </button>
        <h2 className="text-2xl font-bold mb-6 orbitron glow-text">AI Summary Enhancements</h2>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <LoadingSpinner />
            <p className="mt-4 text-gray-300">Our AI is crafting some options for you...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {options.map((option, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                <h3 className="text-lg font-bold orbitron text-indigo-400">{option.title}</h3>
                <p className="text-sm text-gray-400 mb-3 italic">{option.description}</p>
                <p className="text-gray-200 whitespace-pre-wrap bg-gray-900/50 p-3 rounded-md">{option.content}</p>
                <button 
                  onClick={() => onSelect(option.content)} 
                  className="mt-4 px-4 py-2 text-sm btn-space rounded-md w-full"
                >
                  Select this version
                </button>
              </div>
            ))}
             {options.length > 0 && (
                <div className="pt-4 mt-4 border-t border-gray-700">
                    <button 
                      onClick={() => onSelect(originalSummary)} 
                      className="px-4 py-2 text-sm bg-gray-600 rounded-md w-full hover:bg-gray-500 transition-colors"
                    >
                        Revert to my original summary
                    </button>
                </div>
            )}
            {options.length === 0 && !isLoading && (
                 <div className="text-center py-8 text-gray-400">
                    <p>Sorry, the AI couldn't generate enhancements for this summary.</p>
                    <p className="text-sm">You can try rephrasing it or adding more detail.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancementModal;
