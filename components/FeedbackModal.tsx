import React, { useState } from 'react';

// Icons
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const MailIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);


interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const [feedbackType, setFeedbackType] = useState('Sugerir Melhoria');
    const [userEmail, setUserEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = `[${feedbackType}] - Feedback Konica Express`;
        const body = `Tipo de Feedback: ${feedbackType}\nEmail do Utilizador (opcional): ${userEmail}\n\nMensagem:\n${message}`;
        
        const mailtoLink = `mailto:konicaexpress0@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        window.location.href = mailtoLink;
        onClose(); // Close modal after attempting to open mail client
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-up"
            aria-labelledby="feedback-modal-title"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h3 id="feedback-modal-title" className="text-xl font-bold text-gray-800">Feedback e Suporte</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full" aria-label="Fechar modal">
                        <CloseIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </header>
                
                <main className="p-6 space-y-6 overflow-y-auto">
                    <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Sobre a Konica Express</h4>
                        <p className="text-sm text-gray-600">
                            A Konica Express é uma plataforma digital multi-serviços projetada para simplificar as suas necessidades diárias, desde a criação de documentos profissionais a ferramentas de imagem. A nossa missão é fornecer soluções acessíveis, intuitivas e de alta qualidade para todos.
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                         <h4 className="font-semibold text-gray-700 border-t pt-4">Deixe o seu feedback</h4>
                         <p className="text-sm text-gray-600 -mt-3">
                            A sua opinião é muito importante para nós! Use o formulário abaixo para pedir ajuda, sugerir melhorias ou reportar um erro.
                         </p>
                        <div>
                            <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700">Tipo de Feedback</label>
                            <select
                                id="feedbackType"
                                value={feedbackType}
                                onChange={(e) => setFeedbackType(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option>Sugerir Melhoria</option>
                                <option>Pedir Ajuda</option>
                                <option>Reportar Erro</option>
                                <option>Outro</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">Seu Email (Opcional)</label>
                            <input
                                type="email"
                                id="userEmail"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder="Para podermos responder-lhe"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensagem</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                required
                                placeholder="Descreva a sua sugestão ou problema em detalhe..."
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                        </div>
                    </form>
                </main>

                <footer className="p-4 bg-gray-50 border-t flex-shrink-0 flex justify-end gap-3">
                    <button 
                        type="button"
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow"
                    >
                        <MailIcon className="w-5 h-5"/>
                        Enviar por Email
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FeedbackModal;
