import React from 'react';
import { useCredits } from '../contexts/CreditContext';

const CheckIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);

const SuccessMessage: React.FC = () => {
    const { isSuccessMessageVisible } = useCredits();

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 text-white font-semibold px-6 py-3 rounded-lg shadow-xl transition-all duration-300 ${isSuccessMessageVisible ? 'transform translate-y-0 opacity-100' : 'transform translate-y-4 opacity-0 pointer-events-none'}`}>
            <CheckIcon className="w-6 h-6" />
            Ação Confirmada!
        </div>
    );
};

export default SuccessMessage;
