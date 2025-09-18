import React from 'react';
import { useCredits } from '../contexts/CreditContext';

const NoCreditsModal: React.FC = () => {
  const { isModalOpen, closeNoCreditsModal, navigateToPurchase } = useCredits();

  if (!isModalOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-up"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full text-center p-6">
        <h3 id="modal-title" className="text-xl font-bold text-gray-800">Créditos Esgotados</h3>
        <p className="text-gray-600 mt-2">
          As suas utilizações gratuitas e créditos terminaram. Para continuar a usar este serviço, por favor, adquira mais créditos.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={closeNoCreditsModal} 
            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors order-2 sm:order-1"
          >
            Fechar
          </button>
          <button 
            onClick={navigateToPurchase}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow order-1 sm:order-2"
          >
            Comprar Créditos
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoCreditsModal;
