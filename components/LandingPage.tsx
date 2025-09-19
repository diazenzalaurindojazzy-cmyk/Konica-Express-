import React from 'react';
import type { Service } from '../App';

interface LandingPageProps {
  onNavigate: (service: Service) => void;
}

const services = [
    { id: 'resume', name: 'Construtor de Currículos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', description: 'Crie um CV profissional e moderno em minutos.' },
    { id: 'scanner', name: 'Scannear Documentos', icon: 'M3 8V7C3 5.34315 4.34315 4 6 4H8M3 8V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H16M3 8L7.5 12.5M21 8L16.5 12.5M12 16H12.01', description: 'Digitalize e organize os seus documentos com a câmara.' },
    { id: 'documents', name: 'Fazer Documentos', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', description: 'Gere cartas, requerimentos e outros documentos formais.' },
    { id: 'photoStudio', name: 'Estúdio de Foto', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', description: 'Tire fotos tipo passe e retratos com as dimensões corretas.' },
    { id: 'invitation', name: 'Criador de Convites', icon: 'M16 12V8m0 4h-4m4 0l-4-4m6 10H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z', description: 'Desenhe convites elegantes para qualquer ocasião especial.' },
    { id: 'businessCard', name: 'Cartões de Visita', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-4M9 4h6a2 2 0 012 2v2H7V6a2 2 0 012-2z', description: 'Crie cartões de visita profissionais e memoráveis.' },
];

const FeatureCard: React.FC<{
  service: typeof services[0];
  onNavigate: (service: Service) => void;
}> = ({ service, onNavigate }) => (
    <button 
        onClick={() => onNavigate(service.id as Service)}
        className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 text-left hover:shadow-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
    >
        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg inline-block mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
            </svg>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">{service.name}</h3>
        <p className="text-sm text-gray-600">{service.description}</p>
    </button>
);


const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full min-h-full bg-gray-50">
        {/* Hero Section */}
        <div className="text-center bg-white py-16 px-4 lg:py-24">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                Suas Ferramentas Digitais, <span className="text-blue-600">Simplificadas.</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Crie currículos, digitalize documentos, desenhe convites e muito mais. A Konica Express é a sua solução completa para produtividade e design em Angola.
            </p>
            <button 
                onClick={() => onNavigate('resume')}
                className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors transform hover:scale-105"
            >
                Começar a Criar
            </button>
        </div>

        {/* Features Section */}
        <div className="py-16 px-4 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Explore os Nossos Serviços</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => (
                        <FeatureCard key={service.id} service={service} onNavigate={onNavigate} />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

export default LandingPage;
