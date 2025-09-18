import React, { useState, useMemo, useCallback, useRef } from 'react';
import { useCredits } from '../contexts/CreditContext';
import ProofUploader from './ProofUploader';

// --- ICONS ---
const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const FileIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>);
const EyeIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>);
const ClipboardCopyIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>);
const SaveIcon: React.FC<{className?: string}> = ({className}) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);


// --- CONFIGURATION ---
const CREDIT_RATE = 0.05; // 5 credits per 100 Kz -> 0.05 credits per 1 Kz
const packages = [
    { credits: 10, kz: 200 },
    { credits: 50, kz: 1000 },
    { credits: 100, kz: 2000 },
    { credits: 500, kz: 10000 },
    { credits: 1000, kz: 20000 },
    { credits: 10000, kz: 200000 },
];
const MIN_CUSTOM_KZ = 200; // Minimum custom amount in Kz
const SUPPORTER_THRESHOLD_KZ = 500000;
const SUPPORTER_THRESHOLD_CREDITS = SUPPORTER_THRESHOLD_KZ * CREDIT_RATE;

const BANK_DETAILS = {
    beneficiary: 'Dianzenza j.f Laurindo',
    express: '930739285',
    iban: 'AO06004000006964108310137'
};

type OcrStatus = 'pending' | 'success' | 'failure';
interface OcrResult {
    status: OcrStatus;
    detectedAmount: number | null;
    message: string;
}

// --- HELPER COMPONENTS ---

const StepCard: React.FC<{ step: number, title: string, children: React.ReactNode, enabled?: boolean }> = ({ step, title, children, enabled = true }) => (
    <div className={`bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 transition-opacity duration-500 ${!enabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <h3 className="text-xl font-bold text-gray-800 mb-4">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-3">{step}</span>
            {title}
        </h3>
        <div className={`pl-11 ${!enabled ? 'pointer-events-none' : ''}`}>{children}</div>
    </div>
);

const PackageCard: React.FC<{ credits: number, kz: number, onSelect: () => void, isSelected: boolean }> = ({ credits, kz, onSelect, isSelected }) => (
     <button onClick={onSelect} className={`w-full p-4 text-center rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${isSelected ? 'border-blue-500 bg-blue-100 ring-2 ring-blue-500' : 'bg-blue-50 border-transparent hover:border-blue-400'}`}>
        <p className="text-3xl font-bold text-blue-800">{credits}</p>
        <p className="text-sm text-blue-600">Créditos</p>
        <p className="mt-2 text-sm font-semibold text-gray-700">{kz.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 })}</p>
    </button>
);

const TutorialModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-up">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <header className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">Como Pagar e Ativar Créditos</h3>
                <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><CloseIcon className="w-5 h-5"/></button>
            </header>
            <main className="p-6 space-y-6 overflow-y-auto">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold text-lg text-gray-800">Opção 1: PayPal (Automático)</h4>
                    <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-gray-600">
                        <li>Após selecionar um pacote, clique no botão "Pagar com PayPal".</li>
                        <li>Será redirecionado para o site do PayPal para concluir o pagamento de forma segura.</li>
                        <li>Após o pagamento, o PayPal mostrar-lhe-á um **ID da Transação** (Transaction ID). Copie este código.</li>
                        <li>Volte a esta página e, no **Passo 3**, cole o ID da Transação no campo apropriado.</li>
                        <li>Clique em "Confirmar Pagamento". Após a verificação automática (que pode levar alguns segundos), os seus créditos serão adicionados.</li>
                    </ol>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-bold text-lg text-gray-800">Opção 2: Transferência (Express / IBAN) (Análise Automática)</h4>
                     <ol className="list-decimal list-inside space-y-2 mt-2 text-sm text-gray-600">
                        <li>Clique em "Mostrar Dados" para ver as informações da conta para a transferência.</li>
                        <li>Transfira o valor exato do pacote escolhido para a conta Express ou IBAN indicada.</li>
                        <li>No **Passo 3**, clique em "Carregar Comprovativo".</li>
                        <li>Pode **capturar uma foto** do talão com a sua câmara ou **carregar um ficheiro** (imagem/PDF) do seu dispositivo.</li>
                        <li>O nosso sistema tentará **ler o valor automaticamente**. Se for bem-sucedido e o valor corresponder, os créditos serão adicionados após clicar em "Confirmar".</li>
                        <li>Se a leitura falhar, pode tentar com uma foto mais nítida ou enviar o comprovativo para uma **validação manual** pela nossa equipa.</li>
                    </ol>
                </div>
            </main>
        </div>
    </div>
);

const BackupRestoreCard: React.FC<{ setMessage: (msg: any) => void }> = ({ setMessage }) => {
    const { exportData, importData } = useCredits();
    const [backupCode, setBackupCode] = useState('');
    const [restoreCode, setRestoreCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = () => {
        const code = exportData();
        setBackupCode(code);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(backupCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([backupCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `konica_express_backup_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleRestore = () => {
        if (!restoreCode.trim()) {
            setMessage({ type: 'error', text: 'Por favor, insira um código de backup para restaurar.' });
            return;
        }
        const success = importData(restoreCode);
        if (success) {
            setMessage({ type: 'success', text: 'Os seus dados foram restaurados com sucesso!' });
            setRestoreCode('');
        } else {
            setMessage({ type: 'error', text: 'O código de backup é inválido ou está corrompido.' });
        }
    };
    
    const handleFileTrigger = () => {
        fileInputRef.current?.click();
    };
    
    const handleFileRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const code = event.target?.result as string;
                setRestoreCode(code);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                <SaveIcon className="w-6 h-6 mr-3 text-gray-500" />
                Backup e Restauro de Dados
            </h3>
            <p className="text-sm text-gray-600 mb-4">Guarde um código para recuperar os seus créditos se limpar os dados do navegador ou trocar de dispositivo. <strong className="text-yellow-700">Guarde este código num local seguro!</strong></p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Backup Section */}
                <div className="space-y-3 p-3 sm:p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-gray-800">1. Fazer Backup</h4>
                    <button onClick={handleGenerate} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Gerar Código de Backup</button>
                    {backupCode && (
                        <div className="space-y-2 animate-fade-in-up">
                            <textarea value={backupCode} readOnly className="w-full text-xs p-2 border rounded-md h-24 bg-gray-100 font-mono" />
                            <div className="flex gap-2">
                                <button onClick={handleCopy} className="flex-1 px-3 py-1.5 bg-gray-200 text-sm text-gray-800 rounded-md hover:bg-gray-300">{isCopied ? 'Copiado!' : 'Copiar'}</button>
                                <button onClick={handleDownload} className="flex-1 px-3 py-1.5 bg-gray-200 text-sm text-gray-800 rounded-md hover:bg-gray-300 flex items-center justify-center gap-2"> <DownloadIcon className="w-4 h-4" /> Baixar</button>
                            </div>
                        </div>
                    )}
                </div>
                {/* Restore Section */}
                <div className="space-y-3 p-3 sm:p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold text-gray-800">2. Restaurar Backup</h4>
                    <textarea value={restoreCode} onChange={(e) => setRestoreCode(e.target.value)} placeholder="Cole o seu código de backup aqui..." className="w-full p-2 border rounded-md h-24" />
                     <button onClick={handleFileTrigger} className="w-full text-sm text-blue-600 hover:underline">ou Carregar Ficheiro de Backup</button>
                    <input type="file" ref={fileInputRef} onChange={handleFileRestore} className="hidden" accept=".txt" />
                    <button onClick={handleRestore} className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">Restaurar Dados</button>
                </div>
            </div>
        </div>
    );
};


const Monetization: React.FC = () => {
    const { credits, isSupporter, addCredits, setAsSupporter, exportData } = useCredits();
    
    const [selectedPackage, setSelectedPackage] = useState<{ credits: number, kz: number } | null>(null);
    const [customKz, setCustomKz] = useState('');
    
    const [transactionId, setTransactionId] = useState('');
    const [sponsorTransactionId, setSponsorTransactionId] = useState('');
    const [capturedProof, setCapturedProof] = useState<string | null>(null);
    const [isProcessingProof, setIsProcessingProof] = useState(false);
    const [ocrResult, setOcrResult] = useState<OcrResult | null>(null);
    
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [isTutorialOpen, setIsTutorialOpen] = useState(false);
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const downloadBackupFile = useCallback(() => {
        const backupCode = exportData();
        const userMessage = "IMPORTANTE: Guarde este documento para recuperar seus créditos caso mude de dispositivo, ou limpe a memória do seu navegador.\n\nO SEU CÓDIGO DE RESTAURO:\n\n";
        const fileContent = userMessage + backupCode;
        
        const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const today = new Date().toISOString().split('T')[0];
        a.download = `konica_express_backup_${today}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [exportData]);


    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
    };

    const handleSelectPackage = (pkg: { credits: number, kz: number }) => {
        setSelectedPackage(pkg);
        setCustomKz('');
        setMessage(null);
    };
    
    const handleSelectCustom = () => {
        const kz = parseInt(customKz, 10);
        if (!isNaN(kz) && kz >= MIN_CUSTOM_KZ) {
            setSelectedPackage({ kz, credits: Math.floor(kz * CREDIT_RATE) });
             setMessage(null);
        } else {
            setMessage({ type: 'error', text: `O valor personalizado deve ser de no mínimo ${MIN_CUSTOM_KZ} Kz.` });
            setSelectedPackage(null);
        }
    };

    const handleSelectSponsor = () => {
        const kzString = SUPPORTER_THRESHOLD_KZ.toString();
        setCustomKz(kzString);
        setSelectedPackage({ kz: SUPPORTER_THRESHOLD_KZ, credits: Math.floor(SUPPORTER_THRESHOLD_KZ * CREDIT_RATE) });
        setMessage(null);
    };
    
    const handlePaypalConfirm = () => {
        setMessage(null);
        if (!transactionId.trim()) {
            setMessage({ type: 'error', text: 'Por favor, insira o ID da Transação do PayPal.' });
            return;
        }
        if (!selectedPackage) {
            setMessage({ type: 'error', text: 'Ocorreu um erro. Por favor, selecione o pacote novamente.' });
            return;
        }

        const amount = selectedPackage.credits;

        // --- Backend simulation ---
        if (amount >= SUPPORTER_THRESHOLD_CREDITS) {
            setAsSupporter();
            setMessage({ type: 'success', text: `Obrigado por se tornar um Patrocinador! O seu pagamento está a ser verificado. Recebeu ${amount} créditos e terá acesso ilimitado.` });
        } else {
            addCredits(amount);
            setMessage({ type: 'success', text: `Pagamento em verificação. Os seus ${amount} créditos foram adicionados com sucesso!` });
        }
        downloadBackupFile();
        setTransactionId('');
    };

    const handleSponsorPaypalConfirm = () => {
        setMessage(null);
        if (!sponsorTransactionId.trim()) {
            setMessage({ type: 'error', text: 'Por favor, insira o ID da Transação de Patrocinador.' });
            return;
        }
        
        // --- Backend simulation for sponsor ---
        setAsSupporter();
        setMessage({ type: 'success', text: 'Obrigado por se tornar um Patrocinador! O seu pagamento está a ser verificado e o seu acesso ilimitado foi ativado.' });
        
        downloadBackupFile();
        setSponsorTransactionId('');
    };
    
    const handleProofUploadAndScan = (proofData: string | null) => {
        setIsUploaderOpen(false);
        if (proofData) {
            setCapturedProof(proofData);
            setOcrResult(null);
            setIsProcessingProof(true);
            setMessage(null);

            // Simulate OCR processing
            setTimeout(() => {
                if (!selectedPackage) {
                    setIsProcessingProof(false);
                    setOcrResult({ status: 'failure', detectedAmount: null, message: 'Erro: Nenhum pacote selecionado. Por favor, comece de novo.' });
                    return;
                }

                // Simulate OCR success/failure (80% success rate)
                const isSuccess = Math.random() > 0.2;
                if (isSuccess) {
                    setOcrResult({ status: 'success', detectedAmount: selectedPackage.kz, message: `O valor corresponde ao pacote selecionado.` });
                } else {
                    setOcrResult({ status: 'failure', detectedAmount: null, message: 'Não foi possível ler o valor. Tente com uma imagem mais nítida ou envie para validação manual.' });
                }
                setIsProcessingProof(false);
            }, 2500);
        }
    };
    
    const resetProofProcess = () => {
        setCapturedProof(null);
        setOcrResult(null);
        setMessage(null);
        setIsUploaderOpen(true);
    };

    const handleSendProof = () => {
        if (!capturedProof) {
            setMessage({ type: 'error', text: 'Nenhum comprovativo carregado.' });
            return;
        }
        
        if (ocrResult?.status === 'success' && selectedPackage) {
            const amount = selectedPackage.credits;
            if (amount >= SUPPORTER_THRESHOLD_CREDITS) {
                setAsSupporter();
                setMessage({ type: 'success', text: `Obrigado por se tornar um Patrocinador! O seu pagamento foi validado automaticamente. Recebeu ${amount} créditos e terá acesso ilimitado.` });
            } else {
                addCredits(amount);
                setMessage({ type: 'success', text: `Pagamento validado! Os seus ${amount} créditos foram adicionados com sucesso!` });
            }
            downloadBackupFile();
        } else {
            const proofType = capturedProof.startsWith('pdf:') ? 'O seu PDF' : 'O seu comprovativo';
            setMessage({ type: 'info', text: `${proofType} foi enviado para análise. Receberá uma notificação assim que o pagamento for validado.` });
        }
        
        setCapturedProof(null);
        setOcrResult(null);
    };

    const clearMessage = useCallback(() => { setMessage(null) }, []);
    
    useMemo(() => {
        if (message) {
            const timer = setTimeout(clearMessage, 8000);
            return () => clearTimeout(timer);
        }
    }, [message, clearMessage]);

    const paymentMethodsDisabled = !selectedPackage;

    return (
        <div className="p-4 lg:p-8 bg-gray-100 min-h-full">
            {isTutorialOpen && <TutorialModal onClose={() => setIsTutorialOpen(false)} />}
            {isUploaderOpen && <ProofUploader onComplete={handleProofUploadAndScan} onCancel={() => setIsUploaderOpen(false)} />}

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Comprar Créditos</h1>
                    <p className="text-gray-600 mt-2">Continue a criar documentos incríveis sem interrupções.</p>
                </div>

                <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg text-center">
                    <p className="text-lg">O seu Saldo</p>
                    {isSupporter ? (
                        <p className="text-4xl font-extrabold tracking-tight">Créditos Ilimitados ✨</p>
                    ) : (
                         <p className="text-5xl font-extrabold tracking-tight">{credits}</p>
                    )}
                </div>

                <StepCard step={1} title="Escolha um Pacote">
                    <p className="text-gray-600 mb-4">Selecione um pacote ou insira um valor personalizado (mínimo {MIN_CUSTOM_KZ.toLocaleString('pt-AO')} Kz).</p>
                    
                    <div className="mb-6">
                        <button onClick={handleSelectSponsor} className={`w-full p-6 text-center rounded-lg border-2 transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-r from-yellow-300 to-amber-500 border-amber-500 shadow-lg ${selectedPackage?.kz === SUPPORTER_THRESHOLD_KZ ? 'ring-4 ring-amber-400' : ''}`}>
                            <p className="text-2xl font-extrabold text-white drop-shadow-md">✨ Torne-se Patrocinador</p>
                            <p className="text-lg font-semibold text-white mt-1">Acesso Ilimitado a Tudo!</p>
                            <p className="mt-2 text-md font-bold text-gray-800 bg-white/80 rounded-full px-4 py-1 inline-block">{SUPPORTER_THRESHOLD_KZ.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA', minimumFractionDigits: 0 })} ou mais</p>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {packages.map(p => <PackageCard key={p.credits} {...p} onSelect={() => handleSelectPackage(p)} isSelected={selectedPackage?.credits === p.credits && selectedPackage?.kz === p.kz} />)}
                        <div className={`w-full p-4 text-center rounded-lg border-2 transition-colors ${selectedPackage?.kz === parseInt(customKz, 10) && customKz !== SUPPORTER_THRESHOLD_KZ.toString() ? 'border-blue-500 bg-blue-100' : 'bg-gray-50 border-gray-200'}`}>
                             <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2">Personalizado (Kz)</label>
                             <input id="custom-amount" type="number" value={customKz} onChange={(e) => { setCustomKz(e.target.value); setSelectedPackage(null); }} placeholder="5000" className="w-full px-2 py-2 text-center text-xl font-bold border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                             <button onClick={handleSelectCustom} disabled={!customKz} className="mt-2 w-full text-sm px-3 py-1.5 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-300">Selecionar</button>
                        </div>
                    </div>
                    {selectedPackage && <p className="text-center mt-4 font-semibold text-blue-700 bg-blue-100 p-2 rounded-md">Selecionado: {selectedPackage.credits} créditos por {selectedPackage.kz.toLocaleString('pt-AO')} Kz.</p>}
                </StepCard>

                <StepCard step={2} title="Efetue o Pagamento" enabled={true}>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-gray-600">Escolha o seu método de pagamento preferido.</p>
                        <button onClick={() => setIsTutorialOpen(true)} className="flex items-center text-sm text-blue-600 hover:underline">
                            <QuestionMarkCircleIcon className="w-5 h-5 mr-1" /> Ver Tutorial
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-sm">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                             <h4 className="font-bold text-gray-900">Transferência (Express / IBAN) (Recomendado)</h4>
                             <p className="mt-1">Envie o comprovativo para validação automática ou manual. A ativação pode demorar algumas horas.</p>
                             {!showBankDetails ? (
                                <button onClick={() => setShowBankDetails(true)} disabled={paymentMethodsDisabled} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    <EyeIcon className="w-5 h-5" /> Mostrar Dados para Transferência
                                </button>
                             ) : (
                                <div className="mt-2 space-y-3 p-3 bg-gray-200 rounded-md animate-fade-in-up">
                                    <h5 className="font-semibold text-gray-800">Dados para Transferência</h5>
                                    <div>
                                        <p className="text-xs font-medium text-gray-600">Beneficiário</p>
                                        <p className="font-mono text-gray-900">{BANK_DETAILS.beneficiary}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-gray-600">Express</p>
                                            <p className="font-mono text-gray-900">{BANK_DETAILS.express}</p>
                                        </div>
                                        <button onClick={() => handleCopy(BANK_DETAILS.express)} className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300">
                                            {copiedText === BANK_DETAILS.express ? 'Copiado!' : 'Copiar'}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-gray-600">IBAN</p>
                                            <p className="font-mono text-gray-900 break-all">{BANK_DETAILS.iban}</p>
                                        </div>
                                        <button onClick={() => handleCopy(BANK_DETAILS.iban)} className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300">
                                            {copiedText === BANK_DETAILS.iban ? 'Copiado!' : 'Copiar'}
                                        </button>
                                    </div>
                                </div>
                             )}
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h4 className="font-bold text-gray-900">PayPal</h4>
                            <p className="mt-1">Pagamento rápido e seguro. A ativação dos créditos é instantânea após inserir o código da transação.</p>
                            <a 
                                href="https://www.paypal.com/ncp/payment/JANSWCP5LFFGC" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={`mt-3 inline-block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 ${paymentMethodsDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                                aria-disabled={paymentMethodsDisabled}
                            >
                                Pagar com PayPal
                            </a>
                            <a 
                                href="https://www.paypal.com/ncp/payment/YYSYG42XLHRR6" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={`
                                    mt-3 inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-semibold rounded-md shadow-md hover:from-amber-600 hover:to-yellow-500 transition-all transform hover:scale-[1.02]
                                `}
                            >
                                ✨ Pagar como Patrocinador (PayPal)
                            </a>
                            <p className="text-xs text-center mt-2 text-gray-500">O botão de Patrocinador tem um valor fixo e pode ser usado a qualquer momento.</p>
                        </div>
                    </div>
                </StepCard>
                
                <StepCard step={3} title="Confirme e Ative os Créditos" enabled={true}>
                    <p className="text-gray-600 mb-4">Após o pagamento, insira o código da transação ou carregue o comprovativo para ativar os seus créditos.</p>

                    {/* Transfer Confirmation */}
                    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-semibold text-gray-800">Se pagou por Transferência:</h4>
                        {!capturedProof ? (
                            <button onClick={() => setIsUploaderOpen(true)} disabled={paymentMethodsDisabled} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400">
                                <UploadIcon className="w-5 h-5" /> Carregar Comprovativo
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-2 border rounded-md bg-white">
                                    <FileIcon className="w-8 h-8 text-green-600 flex-shrink-0" />
                                    <p className="text-sm font-medium text-gray-700">Comprovativo carregado.</p>
                                </div>
                                {isProcessingProof && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <SpinnerIcon className="w-5 h-5 text-blue-600" />
                                        <span>A analisar o comprovativo...</span>
                                    </div>
                                )}
                                {ocrResult && (
                                    <div className={`p-3 rounded-md text-sm flex items-start gap-2 ${ocrResult.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {ocrResult.status === 'success' ? <CheckCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                                        <div>
                                            <p className="font-semibold">
                                                {ocrResult.status === 'success' ? `Valor Detetado: ${ocrResult.detectedAmount?.toLocaleString('pt-AO')} Kz` : "Análise Automática Falhou"}
                                            </p>
                                            <p>{ocrResult.message}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <button onClick={resetProofProcess} className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md hover:bg-gray-300">Carregar Outro</button>
                                    <button onClick={handleSendProof} disabled={isProcessingProof} className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                                        {ocrResult?.status === 'success' ? 'Confirmar e Ativar' : 'Enviar para Validação Manual'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* PayPal Confirmation */}
                    <div className="mt-6 space-y-3 p-4 border rounded-lg bg-gray-50">
                        <label htmlFor="paypal-id" className="font-semibold text-gray-800">Se pagou com PayPal (Pacotes Normais):</label>
                        <input id="paypal-id" type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Insira o ID da Transação aqui" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        <button onClick={handlePaypalConfirm} disabled={!transactionId || paymentMethodsDisabled} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">Confirmar Pagamento PayPal</button>
                    </div>
                    
                     {/* Sponsor PayPal Confirmation */}
                    <div className="mt-6 space-y-3 p-4 border-2 border-amber-400 rounded-lg bg-yellow-50">
                        <label htmlFor="sponsor-paypal-id" className="font-semibold text-gray-800 flex items-center">
                            ✨ Se pagou como Patrocinador (PayPal):
                        </label>
                        <input 
                            id="sponsor-paypal-id" 
                            type="text" 
                            value={sponsorTransactionId} 
                            onChange={(e) => setSponsorTransactionId(e.target.value)} 
                            placeholder="Insira o ID da Transação de Patrocinador" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500" 
                        />
                        <button 
                            onClick={handleSponsorPaypalConfirm} 
                            disabled={!sponsorTransactionId} 
                            className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 disabled:bg-gray-400"
                        >
                            Confirmar Pagamento de Patrocinador
                        </button>
                    </div>
                </StepCard>
                
                 {/* New Backup and Restore Card */}
                <BackupRestoreCard setMessage={setMessage} />

                {message && (
                    <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white animate-fade-in-up flex items-center gap-3 z-50 ${message.type === 'success' ? 'bg-green-500' : message.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
                        {message.type === 'success' ? <CheckCircleIcon className="w-6 h-6"/> : message.type === 'error' ? <XCircleIcon className="w-6 h-6"/> : <InfoIcon className="w-6 h-6"/>}
                        <p>{message.text}</p>
                        <button onClick={clearMessage} className="ml-4 p-1 rounded-full hover:bg-white/20"><CloseIcon className="w-5 h-5"/></button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Monetization;