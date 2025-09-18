import React from 'react';
import type { ResumeData } from '../../types';

export const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  return (
    <div className="p-6 bg-white text-gray-800 text-[8px] leading-snug w-full h-full" style={{ fontFamily: "'Lora', serif" }}>
      <div className="flex items-center border-b-2 border-gray-300 pb-3 mb-3">
        {data.profilePicture && (
          <img src={data.profilePicture} alt="Foto de Perfil" className="w-20 h-20 rounded-full mr-5 object-cover" />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{data.fullName}</h1>
          <p className="text-base font-medium text-gray-600 mt-1">{data.jobTitle}</p>
          <div className="flex items-center space-x-3 mt-2 text-gray-500 text-[7px]">
            <span>{data.email}</span>
            <span className="text-gray-300">|</span>
            <span>{data.phone}</span>
            <span className="text-gray-300">|</span>
            <span>{data.location}</span>
            <span className="text-gray-300">|</span>
            <span>{data.linkedin}</span>
          </div>
        </div>
      </div>


      <div className="mb-3">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Resumo Profissional</h2>
        <p className="text-gray-700 text-justify">{data.summary}</p>
      </div>
      
      <div className="mb-3">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Competências Chave</h2>
        <p className="text-gray-700">
            {data.skills.join(' • ')}
        </p>
      </div>

      <div className="mb-3">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Experiência Profissional</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
              <span className="text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="flex justify-between items-baseline mb-1">
                <p className="font-semibold text-gray-700">{exp.company}</p>
                <p className="italic text-gray-600">{exp.location}</p>
            </div>
            <p className="text-gray-700 text-justify">{exp.description}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-widest mb-2">Formação Académica</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">{edu.degree} em {edu.fieldOfStudy}</h3>
              <span className="text-gray-600 font-medium">{edu.startDate} - {edu.endDate}</span>
            </div>
            <p className="text-gray-700">{edu.institution}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
