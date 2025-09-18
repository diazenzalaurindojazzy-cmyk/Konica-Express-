import React, { useState, useEffect } from 'react';
// FIX: The import for CertificateGenerator is a default import, and the component has a default export. The previous comment was incorrect.
import CertificateGenerator from './CertificateGenerator';
import DigitalSignature from './DigitalSignature';
import DocumentTranslator from './DocumentTranslator';

// Icons
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const FileIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);

// Accordion Component
const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden">
            <button
                type="button"
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="font-semibold text-gray-800 text-lg text-left">{title}</h3>
                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    <div className="bg-gray-50 p-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const QrCodeGenerator: React.FC = () => {
    const [text, setText] = useState('https://konica.express');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        if (text) {
            setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`);
        } else {
            setQrCodeUrl('');
        }
    }, [text]);

    return (
        <div className="p-4 lg:p-6">
             <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                    <label htmlFor="qr-text" className="block text-sm font-medium text-gray-700 mb-1">Texto ou Link</label>
                    <textarea 
                        id="qr-text"
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div className="p-2 bg-white border rounded-md">
                    {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" className="w-36 h-36" /> : <div className="w-36 h-36 flex items-center justify-center bg-gray-100 text-sm text-gray-500">...</div>}
                </div>
            </div>
        </div>
    );
}

// Local File Storage Component
interface StoredFile { id: number; name: string; type: string; size: number; date: string; dataUrl: string; }
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const FileCloud: React.FC = () => {
    const [files, setFiles] = useState<StoredFile[]>([]);
    
    useEffect(() => {
        const storedFiles = localStorage.getItem('konicaFileCloud');
        if (storedFiles) {
            setFiles(JSON.parse(storedFiles));
        }
    }, []);

    const saveFilesToLocalStorage = (updatedFiles: StoredFile[]) => {
        localStorage.setItem('konicaFileCloud', JSON.stringify(updatedFiles));
        setFiles(updatedFiles);
    };

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newFile: StoredFile = {
                    id: Date.now(),
                    name: uploadedFile.name,
                    type: uploadedFile.type,
                    size: uploadedFile.size,
                    date: new Date().toLocaleDateString(),
                    dataUrl: event.target?.result as string,
                };
                saveFilesToLocalStorage([...files, newFile]);
            };
            reader.readAsDataURL(uploadedFile);
        }
        e.target.value = ''; // Reset input
    };
    
    const handleDelete = (fileId: number) => {
        if (window.confirm("Tem a certeza que deseja apagar este ficheiro?")) {
            const updatedFiles = files.filter(f => f.id !== fileId);
            saveFilesToLocalStorage(updatedFiles);
        }
    };
    
    const handleDownload = (file: StoredFile) => {
        const link = document.createElement('a');
        link.href = file.dataUrl;
        link.download = file.name;
        link.click();
    };

    return (
        <div className="p-4 lg:p-6">
            <div className="p-3 bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 text-sm rounded-r-lg mb-4">
                <strong>Atenção:</strong> Os ficheiros são guardados localmente no seu navegador. Não são uma cópia de segurança na nuvem e só estarão disponíveis neste dispositivo.
            </div>
            <label className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 cursor-pointer transition-colors mb-4">
                <UploadIcon className="w-5 h-5 mr-2" /> Carregar Ficheiro
                <input type="file" className="hidden" onChange={handleUpload} />
            </label>
            
            <div className="space-y-2">
                {files.length > 0 ? files.map(file => (
                     <div key={file.id} className="bg-white p-3 rounded-md shadow-sm flex items-center justify-between gap-3 animate-fade-in-up">
                        <div className="flex items-center gap-3 overflow-hidden">
                             <FileIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
                             <div className="overflow-hidden">
                                 <p className="font-medium text-gray-800 truncate" title={file.name}>{file.name}</p>
                                 <p className="text-xs text-gray-500">{formatBytes(file.size)} - {file.date}</p>
                             </div>
                        </div>
                         <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => handleDownload(file)} title="Descarregar" className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><DownloadIcon className="w-5 h-5"/></button>
                            <button onClick={() => handleDelete(file.id)} title="Apagar" className="p-2 text-red-600 hover:bg-red-100 rounded-full"><TrashIcon className="w-5 h-5"/></button>
                         </div>
                     </div>
                )) : (
                    <p className="text-center text-gray-500 py-8">Nenhum ficheiro guardado.</p>
                )}
            </div>
        </div>
    );
};

const OtherServices: React.FC = () => {
    return (
        <div className="p-4 lg:p-8 bg-gray-100 min-h-full">
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Outros Serviços</h1>
                    <p className="text-gray-600 mt-2">Explore as nossas ferramentas adicionais para simplificar as suas tarefas digitais.</p>
                </div>
                <div className="space-y-3">
                    <Accordion title="Certificados e Diplomas">
                        <CertificateGenerator />
                    </Accordion>
                    <Accordion title="Tradução de Documentos">
                        <DocumentTranslator />
                    </Accordion>
                     <Accordion title="Assinatura Digital">
                        <DigitalSignature />
                    </Accordion>
                     <Accordion title="Nuvem de Ficheiros">
                        <FileCloud />
                    </Accordion>
                    <Accordion title="Gerador de QR Code">
                        <QrCodeGenerator />
                    </Accordion>
                    <Accordion title="Ferramentas de PDF (Em Breve)">
                        <div className="p-8 text-center text-gray-600">
                           Em breve: Conversor de PDF, Compressor de Ficheiros e muito mais.
                        </div>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default OtherServices;