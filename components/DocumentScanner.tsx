import React, { useState, useRef, useEffect } from 'react';
import { useCredits } from '../contexts/CreditContext';
import { extractTextFromImage } from '../services/geminiService';


// Icons
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0119.5 19.5M20 20l-1.5-1.5A9 9 0 004.5 4.5" /></svg>;
const PlusIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const TrashIcon: React.FC<{className?: string}> = ({className}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>);
const CardIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-4M9 4h6a2 2 0 012 2v2H7V6a2 2 0 012-2z"></path></svg>);
const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>);
const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);
const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.293l2.293 2.293a1 1 0 010 1.414L16 20l-2.293 2.293a1 1 0 01-1.414 0L10 20M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>
);


type ScanMode = 'selection' | 'card' | 'document';

// New component for the full-screen camera view
const CameraView: React.FC<{
    videoRef: React.RefObject<HTMLVideoElement>;
    onCapture: () => void;
    onCancel: () => void;
    guideText: string;
    guideShape: 'card' | 'document';
}> = ({ videoRef, onCapture, onCancel, guideText, guideShape }) => {
    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />

            {/* Improved overlay with cutout effect */}
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className={`border-4 border-dashed border-white/80 rounded-lg transition-all duration-300 ${
                        guideShape === 'card' 
                        ? 'w-[90vw] max-w-md aspect-[85.6/54]' 
                        : 'w-[90vw] max-w-2xl aspect-[210/297]' // A4 ratio
                    }`}
                    style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)' }}
                />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col items-center z-10">
                <p className="text-white text-center mb-4">{guideText}</p>
                <div className="flex items-center space-x-12">
                     <button onClick={onCancel} className="p-3 bg-white/20 text-white rounded-full shadow-lg hover:bg-white/30 transition-colors">
                        <CloseIcon className="w-6 h-6"/>
                    </button>
                    <button onClick={onCapture} className="p-4 bg-blue-600 text-white rounded-full shadow-lg ring-4 ring-white/50 hover:bg-blue-700 transition-colors">
                        <CameraIcon className="w-8 h-8"/>
                    </button>
                    {/* Placeholder for future features like flash toggle */}
                    <div className="w-12 h-12"></div>
                </div>
            </div>
        </div>
    );
};

const OcrResultModal: React.FC<{ result: { title: string, text: string } | null, onClose: () => void }> = ({ result, onClose }) => {
    if (!result) return null;

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(result.text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                <header className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-bold">Texto Extraído: {result.title}</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><CloseIcon className="w-5 h-5"/></button>
                </header>
                <main className="p-4 overflow-y-auto">
                    <textarea
                        readOnly
                        value={result.text}
                        className="w-full h-64 p-2 border rounded bg-gray-50 font-mono text-sm"
                    />
                </main>
                <footer className="p-4 bg-gray-50 border-t flex justify-end gap-3">
                     <button onClick={handleCopy} className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                       {copied ? 'Copiado!' : 'Copiar Texto'}
                    </button>
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                        Fechar
                    </button>
                </footer>
            </div>
        </div>
    );
};


const DocumentScanner: React.FC = () => {
    const [scanMode, setScanMode] = useState<ScanMode>('selection');
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [documentName, setDocumentName] = useState<string>('');
    
    // State for Card Mode
    const [cardFront, setCardFront] = useState<string | null>(null);
    const [cardBack, setCardBack] = useState<string | null>(null);
    const [cardCaptureStep, setCardCaptureStep] = useState<'front' | 'back'>('front');

    // State for Document Mode
    const [capturedImages, setCapturedImages] = useState<{id: string, src: string}[]>([]);
    
    // State for OCR
    const [isOcrLoading, setIsOcrLoading] = useState<string | null>(null); // Use image ID to track
    const [ocrResult, setOcrResult] = useState<{ title: string; text: string } | null>(null);


    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const { requestServiceUse } = useCredits();
    const SERVICE_ID = 'scanner';


    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            setStream(mediaStream);
            setIsCameraOpen(true);
        } catch (error) {
            console.error("Erro ao aceder à câmera: ", error);
            alert("Não foi possível aceder à câmera. Por favor, verifique as permissões no seu navegador.");
        }
    };
    
    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream]);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);
    
    const handleBackToSelection = () => {
        stopCamera();
        setScanMode('selection');
        setCardFront(null);
        setCardBack(null);
        setCardCaptureStep('front');
        setCapturedImages([]);
        setDocumentName('');
    };

    const processImage = (canvas: HTMLCanvasElement): string => {
        return canvas.toDataURL('image/jpeg', 0.9);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            setIsProcessing(true);
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const processedDataUrl = processImage(canvas);
            
            if (scanMode === 'card') {
                if (cardCaptureStep === 'front') {
                    setCardFront(processedDataUrl);
                    setCardCaptureStep('back');
                } else {
                    setCardBack(processedDataUrl);
                }
            } else { // document mode
                setCapturedImages(prev => [...prev, { id: `img_${Date.now()}`, src: processedDataUrl }]);
            }
            
            setIsProcessing(false);
            stopCamera();
        }
    };
    
    const handleOcr = (imageDataUrl: string, title: string, imageId: string) => {
        const performOcr = async () => {
            setIsOcrLoading(imageId);
            try {
                const base64Data = imageDataUrl.split(',')[1];
                const mimeType = imageDataUrl.substring(5, imageDataUrl.indexOf(';'));
                const text = await extractTextFromImage(base64Data, mimeType);
                setOcrResult({ title, text });
            } catch (error) {
                alert('Ocorreu um erro ao extrair o texto.');
                console.error(error);
            } finally {
                setIsOcrLoading(null);
            }
        };

        requestServiceUse(SERVICE_ID, performOcr, {
            title: 'Confirmar Extração de Texto',
            message: 'Extrair texto desta imagem com IA irá descontar <strong>1 crédito</strong>.'
        });
    };

    const handleGeneratePdf = () => {
        const performGeneration = async () => {
            setIsProcessing(true);
            const { jsPDF } = (window as any).jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');

            try {
                if (scanMode === 'card') {
                    if (!cardFront || !cardBack) {
                        alert("Por favor, capture a frente e o verso do cartão.");
                        return;
                    }
                    
                    const margin = 15;
                    const topMargin = 20;
                    const spacing = 15;
                    const availableWidth = pdf.internal.pageSize.getWidth() - margin * 2;

                    const addEnlargedImageToPdf = (imgSrc: string, yOffset: number): Promise<number> => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            img.src = imgSrc;
                            img.onload = () => {
                                const imgRatio = img.width / img.height;
                                const drawWidth = availableWidth;
                                const drawHeight = drawWidth / imgRatio;
                                pdf.addImage(imgSrc, 'JPEG', margin, yOffset, drawWidth, drawHeight);
                                resolve(drawHeight);
                            };
                        });
                    };
                    
                    const frontHeight = await addEnlargedImageToPdf(cardFront, topMargin);
                    await addEnlargedImageToPdf(cardBack, topMargin + frontHeight + spacing);

                } else { // document mode
                    if (capturedImages.length === 0) {
                        alert("Por favor, capture pelo menos uma página.");
                        return;
                    }
                     
                    for (const [index, image] of capturedImages.entries()) {
                        if (index > 0) pdf.addPage();
                        
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = pdf.internal.pageSize.getHeight();
                        pdf.addImage(image.src, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                    }
                }
                
                const safeFileName = documentName.replace(/[^a-z0-9_-\s]/gi, '').trim().replace(/\s+/g, '_') || `Documento_KonicaExpress_${scanMode}`;
                pdf.save(`${safeFileName}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
                alert("Ocorreu um erro ao gerar o PDF.");
            } finally {
                setIsProcessing(false);
            }
        };

        requestServiceUse(SERVICE_ID, performGeneration, {
            title: 'Confirmar Geração de PDF',
            message: 'Gerar este documento PDF irá descontar <strong>1 crédito</strong>.'
        });
    };
    
    // --- RENDER FUNCTIONS ---

    const renderSelectionScreen = () => (
        <>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">Scannear Documentos</h2>
            <p className="text-sm text-gray-600 mb-8 text-center">Que tipo de documento pretende escanear?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => { setScanMode('card'); setDocumentName('Cartao_Identidade'); }} className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-lg border-2 border-transparent hover:border-blue-500 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
                    <CardIcon className="w-16 h-16 text-blue-600 mb-4"/>
                    <span className="text-lg font-semibold text-blue-800">Escanear Cartão</span>
                    <span className="text-sm text-gray-600 mt-1">(BI, Carta de Condução, etc.)</span>
                </button>
                 <button onClick={() => { setScanMode('document'); setDocumentName('Documento_Escaneado'); }} className="flex flex-col items-center justify-center p-8 bg-green-50 rounded-lg border-2 border-transparent hover:border-green-500 hover:bg-green-100 transition-all duration-300 transform hover:scale-105">
                    <DocumentIcon className="w-16 h-16 text-green-600 mb-4"/>
                    <span className="text-lg font-semibold text-green-800">Escanear Documento</span>
                    <span className="text-sm text-gray-600 mt-1">(A4, Múltiplas Páginas)</span>
                </button>
            </div>
        </>
    );

    const renderCardScanner = () => (
        <>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Escanear Cartão (Frente e Verso)</h2>
            <p className="text-sm text-gray-600 mb-6">Capture a frente e o verso do seu cartão. O resultado será um único PDF.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                    <h3 className="font-semibold text-gray-700 mb-2">Frente</h3>
                    <div className="aspect-[85.6/54] bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed relative">
                        {cardFront ? <img src={cardFront} alt="Frente do cartão" className="object-contain w-full h-full rounded-lg" /> : <span className="text-gray-500 text-sm p-2">Aguardando frente</span>}
                        {cardFront && (
                             <div className="absolute top-1 right-1">
                                <button onClick={() => handleOcr(cardFront, 'Frente do Cartão', 'cardFront')} disabled={isOcrLoading === 'cardFront'} className="p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:bg-gray-400">
                                    {isOcrLoading === 'cardFront' ? <SpinnerIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-center">
                    <h3 className="font-semibold text-gray-700 mb-2">Verso</h3>
                    <div className="aspect-[85.6/54] bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed relative">
                         {cardBack ? <img src={cardBack} alt="Verso do cartão" className="object-contain w-full h-full rounded-lg" /> : <span className="text-gray-500 text-sm p-2">Aguardando verso</span>}
                         {cardBack && (
                            <div className="absolute top-1 right-1">
                                <button onClick={() => handleOcr(cardBack, 'Verso do Cartão', 'cardBack')} disabled={isOcrLoading === 'cardBack'} className="p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 disabled:bg-gray-400">
                                    {isOcrLoading === 'cardBack' ? <SpinnerIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

             <div className="border-t pt-4 mt-4 space-y-4">
                <button onClick={startCamera} disabled={!!cardBack} className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold transition-colors disabled:bg-gray-400">
                    <CameraIcon className="w-6 h-6 mr-2" />
                    {!cardFront ? '1. Capturar Frente' : '2. Capturar Verso'}
                </button>
                 <div className="mb-4">
                    <label htmlFor="cardDocumentName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Ficheiro PDF</label>
                    <input
                        type="text"
                        id="cardDocumentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Meu_BI"
                    />
                </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button onClick={() => { setCardFront(null); setCardBack(null); setCardCaptureStep('front'); }} disabled={!cardFront && !cardBack} className="w-full flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                        <RefreshIcon className="w-6 h-6 mr-2"/> Limpar
                     </button>
                     <button onClick={handleGeneratePdf} disabled={!cardFront || !cardBack || isProcessing} className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:bg-green-300 disabled:cursor-wait font-semibold transition-colors">
                        {isProcessing ? <SpinnerIcon className="w-6 h-6 mr-2"/> : <DownloadIcon className="w-6 h-6 mr-2" />}
                        {isProcessing ? 'A gerar...' : 'Gerar PDF'}
                    </button>
                 </div>
            </div>
        </>
    );
    
    const renderDocumentScanner = () => (
         <>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Escanear Documento (Múltiplas Páginas)</h2>
            <p className="text-sm text-gray-600 mb-6">Capture múltiplas páginas e junte-as num único ficheiro PDF otimizado.</p>
            
            {capturedImages.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2 text-gray-700">Páginas Capturadas ({capturedImages.length})</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 p-2 bg-gray-100 rounded-lg">
                        {capturedImages.map((image, index) => (
                            <div key={image.id} className="relative group w-24 h-32 flex-shrink-0">
                                <img src={image.src} alt={`Página ${index + 1}`} className="object-cover w-full h-full rounded-md shadow-md border" />
                                <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setCapturedImages(p => p.filter(img => img.id !== image.id))} className="p-1 bg-red-600 text-white rounded-full focus:opacity-100" title="Apagar Página"><TrashIcon className="w-4 h-4" /></button>
                                    <button onClick={() => handleOcr(image.src, `Página ${index + 1}`, image.id)} disabled={isOcrLoading === image.id} className="p-1 bg-blue-600 text-white rounded-full focus:opacity-100 disabled:bg-gray-400" title="Extrair Texto (OCR)">
                                        {isOcrLoading === image.id ? <SpinnerIcon className="w-4 h-4" /> : <SparklesIcon className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="absolute bottom-0 left-0 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-br-md rounded-tl-md">{index + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {capturedImages.length === 0 && (
                 <div className="text-center py-10 border-2 border-dashed rounded-lg">
                    <CameraIcon className="w-12 h-12 mx-auto text-gray-400"/>
                    <p className="mt-2 text-gray-600">Nenhuma página capturada ainda.</p>
                 </div>
            )}
            
            <div className="border-t pt-4 mt-4">
                <div className="mb-4">
                    <label htmlFor="docDocumentName" className="block text-sm font-medium text-gray-700 mb-1">Nome do Ficheiro PDF</label>
                    <input
                        type="text"
                        id="docDocumentName"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Contrato_Aluguer"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button onClick={startCamera} className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 font-semibold transition-colors">
                        {capturedImages.length > 0 ? <PlusIcon className="w-6 h-6 mr-2" /> : <CameraIcon className="w-6 h-6 mr-2" />}
                        {capturedImages.length > 0 ? 'Adicionar Página' : 'Iniciar Câmera'}
                    </button>
                    <button onClick={() => setCapturedImages([])} disabled={capturedImages.length === 0} className="w-full flex items-center justify-center px-4 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 font-semibold transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed">
                       <RefreshIcon className="w-6 h-6 mr-2"/> Limpar Tudo
                    </button>
                    <button onClick={handleGeneratePdf} disabled={capturedImages.length === 0 || isProcessing} className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:bg-green-300 disabled:cursor-wait font-semibold transition-colors">
                        {isProcessing ? <SpinnerIcon className="w-6 h-6 mr-2"/> : <DownloadIcon className="w-6 h-6 mr-2" />}
                        {isProcessing ? 'A gerar...' : `Gerar PDF (${capturedImages.length})`}
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex flex-col h-full bg-gray-100 p-4 lg:p-8">
            {ocrResult && <OcrResultModal result={ocrResult} onClose={() => setOcrResult(null)} />}
            {isCameraOpen && stream && (
                <CameraView
                    videoRef={videoRef}
                    onCapture={captureImage}
                    onCancel={stopCamera}
                    guideText={
                        scanMode === 'card'
                        ? `Alinhe ${cardCaptureStep === 'front' ? 'a FRENTE' : 'o VERSO'} do cartão`
                        : 'Alinhe o documento na área designada'
                    }
                    guideShape={scanMode === 'card' ? 'card' : 'document'}
                />
            )}

            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-4xl mx-auto w-full relative">
                {scanMode !== 'selection' && (
                    <button onClick={handleBackToSelection} className="absolute top-4 left-4 flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold">
                        <ArrowLeftIcon className="w-5 h-5 mr-1" />
                        Voltar
                    </button>
                )}

                {scanMode === 'selection' && renderSelectionScreen()}
                {scanMode === 'card' && renderCardScanner()}
                {scanMode === 'document' && renderDocumentScanner()}
                
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
        </div>
    );
};

export default DocumentScanner;