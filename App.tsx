import React, { useState, useMemo } from 'react';
import ResumeBuilder from './components/ResumeBuilder';
import DocumentScanner from './components/DocumentScanner';
// FIX: Use lowercase filename to resolve casing ambiguity with a deprecated file.
import InvitationCreator from './components/invitationCreator.tsx';
import BusinessCardCreator from './components/BusinessCardCreator';
import PassCreator from './components/PassCreator';
import PhotoStudio from './components/PhotoEnhancer';
import OtherServices from './components/OtherServices';
import DocumentGenerator from './components/DocumentGenerator';
import Monetization from './components/Monetization';
import { CreditProvider, useCredits } from './contexts/CreditContext';
import NoCreditsModal from './components/NoCreditsModal';
import ConfirmationModal from './components/ConfirmationModal';
import SuccessMessage from './components/SuccessMessage';
import FeedbackModal from './components/FeedbackModal';


export type Service = 'resume' | 'scanner' | 'invitation' | 'businessCard' | 'pass' | 'photoStudio' | 'other' | 'documents' | 'monetization';

const HamburgerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const navItems = [
    { id: 'resume', name: 'Construtor de Currículos', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'scanner', name: 'Scannear Documentos', icon: 'M3 8V7C3 5.34315 4.34315 4 6 4H8M3 8V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H16M3 8L7.5 12.5M21 8L16.5 12.5M12 16H12.01' },
    { id: 'documents', name: 'Fazer Documentos', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'invitation', name: 'Criador de Convites', icon: 'M16 12V8m0 4h-4m4 0l-4-4m6 10H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z' },
    { id: 'businessCard', name: 'Cartões de Visita', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-4M9 4h6a2 2 0 012 2v2H7V6a2 2 0 012-2z' },
    { id: 'pass', name: 'Criador de Passes', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
    { id: 'photoStudio', name: 'Tirar Foto', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
    { id: 'other', name: 'Outros Serviços', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'monetization', name: 'Comprar Créditos', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
];

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const RestrictedAccess: React.FC<{ onNavigateToPurchase: () => void }> = ({ onNavigateToPurchase }) => (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <StarIcon className="w-16 h-16 mx-auto text-yellow-400" />
            <h2 className="text-2xl font-bold mt-4 text-gray-800">Acesso Exclusivo para Patrocinadores</h2>
            <p className="mt-2 text-gray-600">
                Esta secção contém ferramentas avançadas disponíveis apenas para os nossos Patrocinadores.
                Apoie o nosso projeto para desbloquear acesso ilimitado a todos os serviços!
            </p>
            <button
                onClick={onNavigateToPurchase}
                className="mt-6 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition-colors"
            >
                Tornar-se Patrocinador
            </button>
        </div>
    </div>
);


const CreditStatus: React.FC<{ activeService: Service }> = ({ activeService }) => {
    const { credits, isSupporter, getFreeUsesLeft, getTotalFreeUses } = useCredits();

    const creditStatus = useMemo(() => {
        if (isSupporter) {
            return {
                percentage: 100,
                text: 'Ilimitado ✨',
                barColor: 'bg-yellow-400',
                textColor: 'text-yellow-600',
            };
        }
        if (credits > 0) {
            return {
                percentage: 100,
                text: `${credits} Crédito${credits > 1 ? 's' : ''}`,
                barColor: 'bg-blue-600',
                textColor: 'text-blue-700',
            };
        }
        const freeUsesLeft = getFreeUsesLeft(activeService);
        const totalFreeUses = getTotalFreeUses(activeService);
        return {
            percentage: totalFreeUses > 0 ? (freeUsesLeft / totalFreeUses) * 100 : 0,
            text: `${freeUsesLeft}/${totalFreeUses} Usos Gratuitos`,
            barColor: 'bg-green-500',
            textColor: 'text-green-700',
        };
    }, [credits, isSupporter, activeService, getFreeUsesLeft, getTotalFreeUses]);

    return (
        <div className="px-4 py-3 border-b">
            <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-gray-700">Saldo Disponível</span>
                <span className={creditStatus.textColor}>{creditStatus.text}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                    className={`${creditStatus.barColor} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${creditStatus.percentage}%` }}
                ></div>
            </div>
        </div>
    );
};


// Main UI component, wrapped by CreditProvider
const AppContent: React.FC<{
    activeService: Service;
    isSidebarOpen: boolean;
    handleServiceChange: (serviceId: Service) => void;
    setIsSidebarOpen: (isOpen: boolean) => void;
}> = ({ activeService, isSidebarOpen, handleServiceChange, setIsSidebarOpen }) => {
  const { isSupporter } = useCredits();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  const handleNavigateToPurchase = () => {
    handleServiceChange('monetization');
  };

  const renderService = () => {
    switch (activeService) {
      case 'resume':
        return <ResumeBuilder />;
      case 'scanner':
        return <DocumentScanner />;
      case 'documents':
        return <DocumentGenerator onNavigateToService={handleServiceChange} />;
      case 'invitation':
        return <InvitationCreator />;
      case 'businessCard':
        return <BusinessCardCreator />;
      case 'pass':
        return <PassCreator />;
      case 'photoStudio':
        return <PhotoStudio />;
      case 'other':
        return isSupporter ? <OtherServices /> : <RestrictedAccess onNavigateToPurchase={handleNavigateToPurchase} />;
       case 'monetization':
        return <Monetization />;
      default:
        return <ResumeBuilder />;
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 text-gray-800">
        <FeedbackModal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} />
        <NoCreditsModal />
        <ConfirmationModal />
        <SuccessMessage />
        {isSidebarOpen && (
            <div 
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
            ></div>
        )}

      <aside 
        id="sidebar-navigation"
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md
          flex flex-col 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-blue-600">
            Konica<span className="text-yellow-500">Express</span>
          </h1>
        </div>
        <CreditStatus activeService={activeService} />
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(item => {
            const isOtherServices = item.id === 'other';
            const isDisabled = isOtherServices && !isSupporter;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && handleServiceChange(item.id as Service)}
                disabled={isDisabled}
                className={`w-full flex items-center px-4 py-2 text-left text-sm font-medium rounded-lg transition-colors duration-150 relative ${
                  activeService === item.id
                    ? 'bg-blue-600 text-white shadow'
                    : isDisabled
                    ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                    : `text-gray-600 hover:bg-gray-100 hover:text-blue-600 ${item.id === 'monetization' ? 'bg-blue-50 text-blue-700 font-semibold' : ''}`
                }`}
              >
                <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span>{item.name}</span>
                {isDisabled && (
                    <span className="ml-auto text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                        Patrocinador
                    </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t flex justify-between items-center">
            <p className="text-xs text-gray-500">© 2025- Atualmente KonicaExpress</p>
            <button 
                onClick={() => setIsFeedbackModalOpen(true)}
                className="text-xs text-blue-600 hover:underline font-medium"
                aria-label="Abrir modal de feedback e suporte"
            >
                Feedback e Suporte
            </button>
        </div>
      </aside>

      <div className="lg:ml-64 flex flex-col min-h-screen">
          <header className="lg:hidden bg-white shadow-md z-10 grid grid-cols-[auto_1fr_auto] items-center gap-x-4 p-4 flex-shrink-0 sticky top-0">
            <div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Abrir menu"
                aria-controls="sidebar-navigation"
                aria-expanded={isSidebarOpen}
                className="p-2 -ml-2 text-gray-800 rounded-md hover:bg-gray-100"
              >
                <HamburgerIcon className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            <h2 className="text-base font-semibold text-gray-700 text-center truncate">
              {navItems.find(item => item.id === activeService)?.name}
            </h2>
            <div>
              <h1 className="text-lg font-bold text-blue-600 whitespace-nowrap">
                Konica<span className="text-yellow-500">Express</span>
              </h1>
            </div>
          </header>
          
          <main className="flex-1">
            {renderService()}
          </main>
      </div>
    </div>
  );
};

// Stateful container component that provides context
const App: React.FC = () => {
    const [activeService, setActiveService] = useState<Service>('resume');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const handleServiceChange = (serviceId: Service) => {
      setActiveService(serviceId);
      setIsSidebarOpen(false);
    };

    return (
        <CreditProvider onNavigate={(serviceId) => handleServiceChange(serviceId as Service)}>
            <AppContent
                activeService={activeService}
                isSidebarOpen={isSidebarOpen}
                handleServiceChange={handleServiceChange}
                setIsSidebarOpen={setIsSidebarOpen}
            />
        </CreditProvider>
    );
}

export default App;