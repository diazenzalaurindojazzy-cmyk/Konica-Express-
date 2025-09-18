import React from 'react';
import type { ResumeData } from '../../types';

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  return (
    <div className="p-6 bg-white text-gray-800 text-[8px] leading-snug w-full h-full">
      <div className="text-center mb-4">
        {data.profilePicture && (
            <img src={data.profilePicture} alt="Foto de Perfil" className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-blue-200" />
        )}
        <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-wider">{data.fullName}</h1>
        <p className="text-base font-medium text-gray-600">{data.jobTitle}</p>
        <div className="flex justify-center items-center space-x-4 mt-2 text-gray-500 text-[7px]">
          <span>{data.email}</span>
          <span>|</span>
          <span>{data.phone}</span>
          <span>|</span>
          <span>{data.location}</span>
          <span>|</span>
          <span>{data.linkedin}</span>
          <span>|</span>
          <span>{data.portfolio}</span>
        </div>
      </div>

      <div className="mb-3">
        <h2 className="text-xs font-bold text-blue-700 border-b-2 border-blue-200 pb-1 mb-2 uppercase">Resumo</h2>
        <p className="text-gray-700">{data.summary}</p>
      </div>

      <div className="mb-3">
        <h2 className="text-xs font-bold text-blue-700 border-b-2 border-blue-200 pb-1 mb-2 uppercase">Competências</h2>
        <div className="flex flex-wrap">
          {data.skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-[7px] font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full">{skill}</span>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <h2 className="text-xs font-bold text-blue-700 border-b-2 border-blue-200 pb-1 mb-2 uppercase">Experiência</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
              <span className="text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline mb-1">
                <p className="italic text-gray-700">{exp.company}</p>
                <p className="text-gray-600">{exp.location}</p>
            </div>
            <p className="text-gray-700 text-justify">{exp.description}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-bold text-blue-700 border-b-2 border-blue-200 pb-1 mb-2 uppercase">Formação Académica</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">{edu.institution}</h3>
              <span className="text-gray-600 font-medium">{edu.startDate} - {edu.endDate}</span>
            </div>
            <p className="text-gray-700">{edu.degree}, {edu.fieldOfStudy}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
