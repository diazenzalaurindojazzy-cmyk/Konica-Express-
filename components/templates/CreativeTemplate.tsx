import React from 'react';
import type { ResumeData } from '../../types';

// Simple SVG icons for contact details
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1.5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1.5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1.5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 mr-1.5 inline-block" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>;

export const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="bg-white w-full h-full text-[8px] leading-snug flex font-sans">
      <div className="w-1/3 bg-teal-700 text-white p-5 flex flex-col">
        {data.profilePicture && (
            <img src={data.profilePicture} alt="Foto de Perfil" className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-teal-500" />
        )}
        <h1 className="text-2xl font-bold leading-none">{data.fullName}</h1>
        <p className="text-base font-light text-teal-200 mt-1">{data.jobTitle}</p>
        
        <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-300 border-b border-teal-500 pb-1 mb-2">Contacto</h2>
            <ul className="space-y-1.5 text-[7px] text-teal-100">
                <li><MailIcon />{data.email}</li>
                <li><PhoneIcon />{data.phone}</li>
                <li><LocationIcon />{data.location}</li>
                <li><LinkIcon />{data.linkedin}</li>
                <li><LinkIcon />{data.portfolio}</li>
            </ul>
        </div>

        <div className="mt-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-300 border-b border-teal-500 pb-1 mb-2">Competências</h2>
            <ul className="space-y-1 list-disc list-inside text-[7px] text-teal-100">
                {data.skills.map((skill, index) => <li key={index}>{skill}</li>)}
            </ul>
        </div>
        <div className="mt-auto"> {/* Pushes content to bottom */}
             <h2 className="text-sm font-semibold uppercase tracking-wider text-teal-300 border-b border-teal-500 pb-1 mb-2">Formação</h2>
            {data.education.map(edu => (
                <div key={edu.id} className="mb-2">
                    <h3 className="font-bold text-teal-100">{edu.degree}</h3>
                    <p className="text-[7px] text-teal-200">{edu.institution}</p>
                    <p className="text-[7px] text-teal-300">{edu.startDate} - {edu.endDate}</p>
                </div>
            ))}
        </div>
      </div>
      <div className="w-2/3 p-5 text-gray-800">
         <div className="mb-3">
          <h2 className="font-bold text-base text-teal-800 border-b-2 border-teal-200 pb-1 mb-2 uppercase tracking-wider">Resumo</h2>
          <p className="text-justify">{data.summary}</p>
        </div>
        
        <div>
          <h2 className="font-bold text-base text-teal-800 border-b-2 border-teal-200 pb-1 mb-2 uppercase tracking-wider">Experiência</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-sm">{exp.jobTitle} em <span className="font-bold text-teal-700">{exp.company}</span></h3>
                    <span className="text-gray-600 font-medium text-[7px]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-gray-600 text-[7px] italic mb-1">{exp.location}</p>
                <p className="text-justify text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
