import React from 'react';
import { useCredits } from '../contexts/CreditContext';

const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);


const ConfirmationModal: React.FC = () => {
  const { 
    isConfirmationOpen, 
    credits, 
    creditsAfterUse, 
    confirmServiceUse, 
    cancelServiceUse,
    confirmationContent 
  } = useCredits();

  if (!isConfirmationOpen) {
    return null;
  }
  
  const title = confirmationContent?.title || 'Confirmar Ação';
  const message = confirmationContent?.message || 'Esta ação irá utilizar <strong>1 crédito</strong> do seu saldo.';
  const confirmButtonText = confirmationContent?.confirmButtonText || 'Confirmar e Continuar';

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-up"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full text-center p-6">
        <QuestionMarkCircleIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2" dangerouslySetInnerHTML={{ __html: message }} />

        <div className="mt-4 text-sm bg-gray-100 p-3 rounded-md">
            <p>Saldo atual: <span className="font-semibold">{credits}</span> créditos</p>
            <p>Saldo após a ação: <span className="font-semibold">{creditsAfterUse}</span> créditos</p>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={cancelServiceUse} 
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button 
            onClick={confirmServiceUse}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow order-1 sm:order-2"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
