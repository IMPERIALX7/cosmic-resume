import React, { useState, useRef } from 'react';
import { ResumeData } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DownloadIcon, UploadCloudIcon, XIcon } from './ui/Icons';
import LoadingSpinner from './ui/LoadingSpinner';


interface ResumePreviewProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, setResumeData }) => {
  const { personal, skills, experience, education } = resumeData;
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    const [year, month] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setResumeData(prev => ({
          ...prev,
          personal: { ...prev.personal, photo: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeData(prev => ({
        ...prev,
        personal: { ...prev.personal, photo: '' }
    }));
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSaveAsPdf = () => {
    const resumeElement = document.getElementById('resumeOutput');
    if (!resumeElement) {
        console.error("Resume element not found!");
        return;
    }

    setIsSaving(true);
    
    const photoPlaceholder = document.getElementById('photo-upload-placeholder');
    if (photoPlaceholder) {
        photoPlaceholder.style.display = 'none';
    }

    const originalStyles = {
        maxHeight: resumeElement.style.maxHeight,
        overflowY: resumeElement.style.overflowY,
        boxShadow: resumeElement.style.boxShadow,
        border: resumeElement.style.border,
        borderRadius: resumeElement.style.borderRadius
    };

    resumeElement.style.maxHeight = 'none';
    resumeElement.style.overflowY = 'visible';
    resumeElement.style.boxShadow = 'none';
    resumeElement.style.border = 'none';
    resumeElement.style.borderRadius = '0';

    setTimeout(() => {
        html2canvas(resumeElement, {
            scale: 2.5,
            useCORS: true,
            backgroundColor: '#ffffff',
            windowWidth: resumeElement.scrollWidth,
            windowHeight: resumeElement.scrollHeight,
            logging: false,
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const imgWidth = pdfWidth;
            const imgHeight = pdfWidth / ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = position - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            const fileName = (personal.name || 'cosmic-resume').replace(/\s+/g, '_').toLowerCase();
            pdf.save(`${fileName}.pdf`);
        }).catch(error => {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error creating the PDF. Please try again.");
        }).finally(() => {
            resumeElement.style.maxHeight = originalStyles.maxHeight;
            resumeElement.style.overflowY = originalStyles.overflowY;
            resumeElement.style.boxShadow = originalStyles.boxShadow;
            resumeElement.style.border = originalStyles.border;
            resumeElement.style.borderRadius = originalStyles.borderRadius;

            if (photoPlaceholder) {
                photoPlaceholder.style.display = 'flex';
            }
            setIsSaving(false);
        });
    }, 150);
  };

  const displayName = personal.name || 'Your Name';
  const displayTitle = personal.title || 'Professional Title';

  return (
    <div className="bg-space-dark rounded-xl p-6 shadow-xl lg:sticky top-8">
      <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
      <div className="flex flex-wrap justify-between items-center gap-y-4 mb-6">
        <h2 className="text-2xl orbitron">Resume Preview</h2>
        <button
            onClick={handleSaveAsPdf}
            disabled={isSaving}
            className="px-4 py-2 text-sm btn-space rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isSaving ? <LoadingSpinner /> : <DownloadIcon />}
            {isSaving ? 'Saving PDF...' : 'Save as PDF'}
        </button>
      </div>
      <div id="resumeOutput" className="resume-output bg-white text-gray-800 p-6 sm:p-8 rounded-lg font-sans lg:overflow-y-auto lg:max-h-[calc(100vh-16rem)]">
        <header className="flex flex-col-reverse sm:flex-row items-center gap-6 mb-6 border-b border-gray-200 pb-4">
          <div className="flex-grow text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 orbitron text-gray-900">{displayName}</h1>
            <h2 className="text-lg sm:text-xl text-indigo-600 mb-3">{displayTitle}</h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2 text-sm text-gray-600">
              {personal.email && <div>{personal.email}</div>}
              {personal.phone && <div>{personal.phone}</div>}
              {personal.location && <div>{personal.location}</div>}
              {personal.linkedin && <div><a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn Profile</a></div>}
            </div>
          </div>
          <div className="flex-shrink-0">
            {personal.photo ? (
                 <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img src={personal.photo} alt="Profile" className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-white shadow-lg" />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 rounded-full flex items-center justify-center transition-opacity duration-300">
                         <button onClick={handleRemovePhoto} className="absolute top-1 right-1 text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full p-1">
                           <XIcon />
                        </button>
                    </div>
                </div>
            ) : (
                <button id="photo-upload-placeholder" onClick={() => fileInputRef.current?.click()} className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-200 hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <UploadCloudIcon />
                    <span className="text-xs mt-1 font-semibold">Upload Photo</span>
                </button>
            )}
          </div>
        </header>
        
        {personal.summary && (
          <section className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-2 border-b pb-1 orbitron">Summary</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{personal.summary}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-2 border-b pb-1 orbitron">Skills</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {skills.map(s => (
                <div key={s.id}>
                  <p className="font-medium text-gray-800">{s.name}</p>
                  <div className="skill-bar mt-1">
                    <div className="skill-progress" style={{ width: `${s.level * 10}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-2 border-b pb-1 orbitron">Experience</h3>
            {experience.map(e => (
              <div key={e.id} className="mb-4">
                <h4 className="font-bold text-base sm:text-lg text-gray-800">{e.jobTitle || 'Job Title'}</h4>
                <p className="text-gray-600 font-medium">{e.company || 'Company'}</p>
                <p className="text-sm text-gray-500 mb-1">{formatDate(e.startDate)} - {formatDate(e.endDate)}</p>
                <p className="mt-1 text-gray-700 whitespace-pre-wrap">{e.description}</p>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h3 className="text-lg sm:text-xl font-bold mb-2 border-b pb-1 orbitron">Education</h3>
            {education.map(e => (
              <div key={e.id} className="mb-2">
                <h4 className="font-bold text-base sm:text-lg text-gray-800">{e.degree || 'Degree'}</h4>
                <p className="text-gray-600 font-medium">{e.institution || 'Institution'}</p>
                <p className="text-sm text-gray-500">{formatDate(e.startDate)} - {formatDate(e.endDate)}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
