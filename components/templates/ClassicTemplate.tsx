import React from 'react';
import type { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="bg-white text-gray-900 w-full h-full text-[8px] leading-snug flex">
      {/* Left Column */}
      <div className="w-1/3 bg-gray-100 p-4 flex flex-col items-center">
        {data.profilePicture && (
            <img src={data.profilePicture} alt="Foto de Perfil" className="w-20 h-20 rounded-full mb-3 object-cover shadow-md" />
        )}
        <div className="text-center w-full">
            <h1 className="text-xl font-bold uppercase">{data.fullName}</h1>
            <p className="text-sm mb-4">{data.jobTitle}</p>
        </div>

        <div className="w-full text-left">
            <div className="mb-3">
              <h2 className="font-bold border-b border-gray-400 pb-1 mb-2 uppercase text-xs">Contacto</h2>
              <ul className="space-y-1 text-[7px]">
                <li>{data.phone}</li>
                <li>{data.email}</li>
                <li>{data.location}</li>
                <li>{data.linkedin}</li>
                <li>{data.portfolio}</li>
              </ul>
            </div>
            
            <div className="mb-3">
              <h2 className="font-bold border-b border-gray-400 pb-1 mb-2 uppercase text-xs">Competências</h2>
              <ul className="list-disc list-inside text-[7px] space-y-1">
                 {data.skills.map((skill, index) => <li key={index}>{skill}</li>)}
              </ul>
            </div>

            <div>
                <h2 className="font-bold border-b border-gray-400 pb-1 mb-2 uppercase text-xs">Formação Académica</h2>
                {data.education.map(edu => (
                    <div key={edu.id} className="mb-2">
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-gray-700 text-[7px]">{edu.institution}</p>
                        <p className="text-gray-600 text-[7px]">{edu.startDate} - {edu.endDate}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-2/3 p-4">
        <div className="mb-3">
          <h2 className="font-bold text-base border-b-2 border-gray-300 pb-1 mb-2 uppercase">Resumo</h2>
          <p className="text-justify">{data.summary}</p>
        </div>

        <div>
          <h2 className="font-bold text-base border-b-2 border-gray-300 pb-1 mb-2 uppercase">Experiência</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-2">
                <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-sm">{exp.jobTitle}</h3>
                    <span className="text-gray-600 font-medium text-[7px]">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-baseline mb-1">
                    <p className="italic text-gray-800">{exp.company}</p>
                    <p className="text-gray-600 text-[7px]">{exp.location}</p>
                </div>
                <p className="text-justify text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
