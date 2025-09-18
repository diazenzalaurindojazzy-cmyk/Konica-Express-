import React, { useState } from 'react';
import { getTranslation } from '../services/geminiService';

// Icons
const TranslateIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13l4-4M19 17v-2a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2h12a2 2 0 002-2zM9 7l2 2m0 0l2-2m-2 2v4" /></svg>);
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const ClipboardCopyIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const DocumentTranslator: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [targetLanguage, setTargetLanguage] = useState('English');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (event) => {
                setInputText(event.target?.result as string);
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, carregue um ficheiro de texto (.txt) válido.');
        }
    };
    
    const handleTranslate = async () => {
        if (!inputText.trim()) {
            setError('Por favor, insira texto para traduzir.');
            return;
        }
        setIsLoading(true);
        setError('');
        setTranslatedText('');
        try {
            const result = await getTranslation(inputText, targetLanguage);
            setTranslatedText(result);
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(translatedText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="p-4 lg:p-6">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
                <h2 className="text-xl font-bold mb-4">Tradução de Documentos com IA</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Input Area */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                           <label htmlFor="input-text" className="font-semibold text-gray-700">Texto Original</label>
                            <label className="flex items-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                                <UploadIcon className="w-4 h-4 mr-1"/> Carregar .txt
                                <input type="file" accept=".txt" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                        <textarea
                            id="input-text"
                            rows={10}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Cole o seu texto aqui..."
                        />
                    </div>
                    {/* Output Area */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="output-text" className="font-semibold text-gray-700">Tradução</label>
                             {translatedText && (
                                <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                    <ClipboardCopyIcon className="w-4 h-4 mr-1"/>
                                    {copied ? 'Copiado!' : 'Copiar'}
                                </button>
                            )}
                        </div>
                        <textarea
                            id="output-text"
                            rows={10}
                            value={translatedText}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="A tradução aparecerá aqui..."
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                
                {/* Controls */}
                <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1 w-full sm:w-auto">
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Traduzir para:</label>
                        <select
                            id="language"
                            value={targetLanguage}
                            onChange={(e) => setTargetLanguage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option>English</option>
                            <option>French</option>
                            <option>Spanish</option>
                            <option>Portuguese</option>
                        </select>
                    </div>
                    <div className="w-full sm:w-auto self-end">
                        <button
                            onClick={handleTranslate}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-wait transition-colors"
                        >
                            {isLoading ? <SpinnerIcon className="w-5 h-5 mr-2" /> : <TranslateIcon className="w-5 h-5 mr-2" />}
                            {isLoading ? 'A traduzir...' : 'Traduzir'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentTranslator;