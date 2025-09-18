import React, { useState, useRef, useMemo, useEffect } from 'react';
import { editImageWithGemini } from '../services/geminiService';
import { useCredits } from '../contexts/CreditContext';
import SheetExporter from './SheetExporter';

// --- ICONS ---
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.293l2.293 2.293a1 1 0 010 1.414L16 20l-2.293 2.293a1 1 0 01-1.414 0L10 20M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const PrintIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>);
const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const CheckIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const RefreshIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20l-5-5m5 5V4M4 4l5 5" /></svg>);
const SheetIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);


// --- CONFIGS ---
const templates = [
    { id: 'passe', name: 'Tipo Passe', aspectRatio: '35/45', width_mm: 35, height_mm: 45 },
    { id: 'meio_corpo', name: 'Retrato (Meio Corpo)', aspectRatio: '2/3', width_mm: 100, height_mm: 150 },
    { id: 'corpo_inteiro', name: 'Retrato (Corpo Inteiro)', aspectRatio: '9/16', width_mm: 100, height_mm: 177.8 },
    { id: 'funebre', name: 'Fúnebre / Honra', aspectRatio: '4/5', width_mm: 90, height_mm: 112.5 },
    { id: 'livre', name: 'Livre', aspectRatio: 'auto' },
];

const backgrounds = [
    { id: 'original', name: 'Original', style: 'transparent' },
    { id: 'branco', name: 'Branco', style: '#FFFFFF' },
    { id: 'azul_corp', name: 'Azul Corporativo', style: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
    { id: 'cinza_prof', name: 'Cinza Profissional', style: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' },
];


const CameraView: React.FC<{
    videoRef: React.RefObject<HTMLVideoElement>;
    onCapture: () => void;
    onCancel: () => void;
    onConfirm: () => void;
    onRetake: () => void;
    guideAspectRatio: string;
    capturedPhoto: string | null;
}> = ({ videoRef, onCapture, onCancel, onConfirm, onRetake, guideAspectRatio, capturedPhoto }) => {
    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
             {capturedPhoto ? (
                <img src={capturedPhoto} alt="Captura" className="max-w-full max-h-full object-contain" />
            ) : (
                <>
                    <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                        <div 
                            className="border-4 border-dashed border-white/80 rounded-lg transition-all duration-300"
                            style={{ 
                                aspectRatio: guideAspectRatio === 'auto' ? '3/4' : guideAspectRatio,
                                width: 'auto',
                                height: '70%',
                                maxHeight: '70vh',
                                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)' 
                            }}
                        />
                    </div>
                </>
            )}
           
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col items-center z-10">
                <p className="text-white text-center mb-4">
                    {capturedPhoto ? 'Gostou da foto?' : 'Posicione o rosto na área designada'}
                </p>
                <div className="flex items-center space-x-12">
                     <button onClick={capturedPhoto ? onRetake : onCancel} className="p-3 bg-white/20 text-white rounded-full shadow-lg hover:bg-white/30 transition-colors">
                        {capturedPhoto ? <RefreshIcon className="w-6 h-6"/> : <CloseIcon className="w-6 h-6"/>}
                    </button>
                    {!capturedPhoto && (
                        <button onClick={onCapture} className="p-4 bg-blue-600 text-white rounded-full shadow-lg ring-4 ring-white/50 hover:bg-blue-700 transition-colors">
                            <CameraIcon className="w-8 h-8"/>
                        </button>
                    )}
                     <button onClick={capturedPhoto ? onConfirm : () => {}} className={`p-3 rounded-full shadow-lg transition-all ${capturedPhoto ? 'bg-green-500 text-white hover:bg-green-600' : 'opacity-0'}`}>
                        <CheckIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const PhotoStudio: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [originalFileType, setOriginalFileType] = useState<string>('image/png');
    const [processedImage, setProcessedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [showFlash, setShowFlash] = useState(false);
    const [isSheetExporterOpen, setIsSheetExporterOpen] = useState(false);
    const [imageNaturalAspectRatio, setImageNaturalAspectRatio] = useState(1);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');

    const [activeTemplateId, setActiveTemplateId] = useState('livre');
    const [activeBackgroundId, setActiveBackgroundId] = useState('original');
    const [aiPrompt, setAiPrompt] = useState('');
    const [adjustments, setAdjustments] = useState({ brightness: 100, contrast: 100, saturate: 100 });
    const [imageFit, setImageFit] = useState<'contain' | 'cover' | 'fill'>('contain');

    const previewRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { requestServiceUse } = useCredits();
    const SERVICE_ID = 'photoStudio';

    const selectedTemplate = useMemo(() => templates.find(t => t.id === activeTemplateId), [activeTemplateId]);
    const previewAspectRatio = useMemo(() => selectedTemplate?.aspectRatio || 'auto', [selectedTemplate]);

    useEffect(() => {
        if (processedImage) {
            const img = new Image();
            img.src = processedImage;
            img.onload = () => {
                if (img.naturalHeight > 0) {
                    setImageNaturalAspectRatio(img.naturalWidth / img.naturalHeight);
                }
            };
        }
    }, [processedImage]);

    const finalAspectRatio = useMemo(() => {
        if (previewAspectRatio === 'auto' || !previewAspectRatio) {
            return imageNaturalAspectRatio;
        }
        try {
            if (String(previewAspectRatio).includes('/')) {
                const parts = previewAspectRatio.split('/');
                return parseFloat(parts[0]) / parseFloat(parts[1]);
            }
        } catch (e) {
            console.error('Invalid aspect ratio format', e);
        }
        return 1; // Default fallback
    }, [previewAspectRatio, imageNaturalAspectRatio]);


    const resetStateForNewImage = (result: string, fileType: string) => {
        setOriginalImage(result);
        setProcessedImage(result);
        setOriginalFileType(fileType);
        setError(null);
        setActiveBackgroundId('original');
        setActiveTab('editor');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                resetStateForNewImage(reader.result as string, file.type);
            };
            reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            setStream(mediaStream);
            setIsCameraOpen(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Não foi possível aceder à câmera. Verifique as permissões.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setCapturedPhoto(null);
        setIsCameraOpen(false);
    };
    
    useEffect(() => {
        if (isCameraOpen && stream && videoRef.current && !capturedPhoto) {
            videoRef.current.srcObject = stream;
        }
    }, [isCameraOpen, stream, capturedPhoto]);

    useEffect(() => () => stopCamera(), []);

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;
    
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 150);
    
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const videoAR = videoWidth / videoHeight;
        
        let targetAR;
        if (previewAspectRatio === 'auto' || !previewAspectRatio) {
            targetAR = videoAR;
        } else {
            const parts = previewAspectRatio.split('/');
            targetAR = parseFloat(parts[0]) / parseFloat(parts[1]);
        }
    
        let sx, sy, sWidth, sHeight;
    
        if (videoAR > targetAR) { // Video is wider than target
            sHeight = videoHeight;
            sWidth = sHeight * targetAR;
            sx = (videoWidth - sWidth) / 2;
            sy = 0;
        } else { // Video is taller than target
            sWidth = videoWidth;
            sHeight = sWidth / targetAR;
            sx = 0;
            sy = (videoHeight - sHeight) / 2;
        }
    
        canvas.width = sWidth;
        canvas.height = sHeight;
        
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedPhoto(dataUrl);
    };

    const handleConfirmCapture = () => {
        if(capturedPhoto) {
            resetStateForNewImage(capturedPhoto, 'image/jpeg');
        }
        stopCamera();
    };
    
    const handleRetake = () => {
        setCapturedPhoto(null);
    };


    const handleApplyBackground = (newBackgroundId: string) => {
        if (!originalImage || isLoading) return;
        
        if (newBackgroundId === 'original') {
            setProcessedImage(originalImage);
            setActiveBackgroundId('original');
            return;
        }
    
        const backgroundPrompts: Record<string, string> = {
            'branco': 'Replace the background of this photo with a solid, clean white studio background suitable for a passport photo. Keep the subject crisp and clear.',
            'azul_corp': "Replace the background of this photo with a professional corporate blue background, like one used for ID photos. The blue should have a subtle gradient. Keep the subject crisp and clear.",
            'cinza_prof': "Replace the background of this photo with a professional gray studio portrait backdrop with a subtle gradient. Keep the subject crisp and clear.",
        };
    
        const prompt = backgroundPrompts[newBackgroundId];
        if (!prompt) return;
    
        const performBackgroundChange = async () => {
            setIsLoading(true);
            setError(null);
        
            try {
                const imageToProcess = originalImage; 
                const imageMimeType = originalFileType;
                
                const base64Data = imageToProcess.split(',')[1];
                const result = await editImageWithGemini(base64Data, imageMimeType, prompt);
    
                if (result) {
                    setProcessedImage(result);
                    setActiveBackgroundId(newBackgroundId);
                } else {
                    throw new Error('Falha ao substituir o fundo.');
                }
            } catch (e: any) {
                setError(e.message || 'Ocorreu um erro.');
            } finally {
                setIsLoading(false);
            }
        };
    
        requestServiceUse(SERVICE_ID, performBackgroundChange, {
            title: 'Confirmar Edição com IA',
            message: 'Substituir o fundo da imagem irá descontar <strong>1 crédito</strong>.'
        });
    };

    const handleApplyAIPrompt = () => {
        if (!processedImage) return;

        const performAIPrompt = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const imageMimeType = (processedImage.startsWith('data:'))
                    ? processedImage.substring(5, processedImage.indexOf(';'))
                    : originalFileType;
                const base64Data = processedImage.split(',')[1];
                const result = await editImageWithGemini(base64Data, imageMimeType, aiPrompt);
                if (result) {
                    setProcessedImage(result);
                } else {
                    throw new Error('Falha ao aplicar o aprimoramento da IA.');
                }
            } catch (e: any) {
                setError(e.message || 'Ocorreu um erro.');
            } finally {
                setIsLoading(false);
            }
        };

        requestServiceUse(SERVICE_ID, performAIPrompt, {
            title: 'Confirmar Edição com IA',
            message: 'Aplicar esta edição de IA irá descontar <strong>1 crédito</strong>.'
        });
    };

    const handleAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAdjustments(prev => ({ ...prev, [name]: parseInt(value) }));
    };

    const handleDownload = (format: 'png' | 'pdf') => {
        const performDownload = async () => {
            const { html2canvas, jsPDF } = window as any;
            const element = previewRef.current;
            if (!element) return;

            try {
                const canvas = await html2canvas(element, { scale: 4, useCORS: true, backgroundColor: null });
                const imgData = canvas.toDataURL('image/png');
                const fileName = `foto_konicaexpress_${activeTemplateId}`;

                if (format === 'png') {
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `${fileName}.png`;
                    link.click();
                } else {
                    if (selectedTemplate && selectedTemplate.width_mm && selectedTemplate.height_mm) {
                        const pdf = new jsPDF({
                            orientation: selectedTemplate.width_mm > selectedTemplate.height_mm ? 'landscape' : 'portrait',
                            unit: 'mm',
                            format: [selectedTemplate.width_mm, selectedTemplate.height_mm]
                        });
                        pdf.addImage(imgData, 'PNG', 0, 0, selectedTemplate.width_mm, selectedTemplate.height_mm);
                        pdf.save(`${fileName}.pdf`);
                    } else {
                        alert("O formato 'Livre' não pode ser exportado como PDF com tamanho definido. Exporte como PNG.");
                    }
                }
            } catch(e) {
                console.error("Error downloading image:", e);
            }
        };

        requestServiceUse(SERVICE_ID, performDownload, {
            title: 'Confirmar Download',
            message: `Baixar esta foto como ${format.toUpperCase()} irá descontar <strong>1 crédito</strong>.`
        });
    };
    
    const handlePrint = () => {
        const performPrint = () => {
            const content = previewRef.current;
            if (!content) return;
            setIsLoading(true);
    
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
    
            const htmlContent = `
                <html>
                    <head>
                        <title>Imprimir Foto</title>
                        <style>
                            @page { size: auto; margin: 0; }
                            body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; display: flex; align-items: center; justify-content: center; height: 100vh; }
                            img { max-width: 100%; max-height: 100%; object-fit: contain; }
                        </style>
                    </head>
                    <body>${content.innerHTML}</body>
                </html>
            `;
            
            iframe.srcdoc = htmlContent;
    
            iframe.onload = () => {
                setTimeout(() => {
                    try {
                        iframe.contentWindow?.focus();
                        iframe.contentWindow?.print();
                    } catch (e) {
                        console.error("Print failed:", e);
                    } finally {
                        setIsLoading(false);
                        document.body.removeChild(iframe);
                    }
                }, 500);
            };
        };
    
        requestServiceUse(SERVICE_ID, performPrint, {
            title: 'Confirmar Impressão',
            message: 'Imprimir esta foto irá descontar <strong>1 crédito</strong>.'
        });
    };

    const imageStyle = useMemo(() => ({
        filter: `brightness(${adjustments.brightness}%) contrast(${adjustments.contrast}%) saturate(${adjustments.saturate}%)`,
        objectFit: imageFit,
    }), [adjustments, imageFit]);

    const renderEditor = () => (
        <div className="p-4 lg:p-6 space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">1. Carregar Foto</h3>
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex flex-col items-center justify-center p-4 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                        <UploadIcon className="w-8 h-8 mb-1" />
                        <span className="text-sm font-medium text-center">Carregar Ficheiro</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    <button onClick={startCamera} className="flex flex-col items-center justify-center p-4 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition">
                        <CameraIcon className="w-8 h-8 mb-1" />
                        <span className="text-sm font-medium text-center">Tirar Foto</span>
                    </button>
                </div>
            </div>

            {originalImage && (
                <>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">2. Formato da Foto</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {templates.map(t => (
                                <button key={t.id} onClick={() => setActiveTemplateId(t.id)} className={`p-2 text-xs text-center rounded-md border-2 ${activeTemplateId === t.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-100'}`}>{t.name}</button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">3. Fundo da Foto</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {backgrounds.map(bg => (
                                <button key={bg.id} onClick={() => handleApplyBackground(bg.id)} disabled={isLoading && activeBackgroundId !== bg.id} className={`p-2 rounded-md border-2 flex items-center justify-center ${activeBackgroundId === bg.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-100'}`}>
                                    <div className="w-6 h-6 rounded-full mr-2 border" style={{ background: bg.style }}></div>
                                    <span className="text-sm">{bg.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">4. Edição com IA <SparklesIcon className="w-5 h-5 text-yellow-500" /></h3>
                        <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={3} placeholder="Ex: Mudar a cor da camisa para azul, adicionar um sorriso..." className="w-full p-2 border rounded-md" />
                        <button onClick={handleApplyAIPrompt} disabled={isLoading || !aiPrompt} className="w-full mt-2 flex items-center justify-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 disabled:bg-gray-400">
                            {isLoading ? <SpinnerIcon className="w-5 h-5 mr-2" /> : <SparklesIcon className="w-5 h-5 mr-2" />}
                            Aplicar Edição
                        </button>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-2">5. Ajustes Manuais</h3>
                            <div className="space-y-4">
                            <div>
                                <label htmlFor="brightness" className="text-sm">Brilho</label>
                                <input id="brightness" name="brightness" type="range" min="50" max="150" value={adjustments.brightness} onChange={handleAdjustmentChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <label htmlFor="contrast" className="text-sm">Contraste</label>
                                <input id="contrast" name="contrast" type="range" min="50" max="150" value={adjustments.contrast} onChange={handleAdjustmentChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <label htmlFor="saturate" className="text-sm">Saturação</label>
                                <input id="saturate" name="saturate" type="range" min="0" max="200" value={adjustments.saturate} onChange={handleAdjustmentChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                            </div>
                            <div>
                                <label className="text-sm">Ajuste da Imagem no Formato</label>
                                <div className="grid grid-cols-3 gap-2 mt-1">
                                    <button onClick={() => setImageFit('contain')} className={`px-3 py-1.5 text-xs rounded-md border ${imageFit === 'contain' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100 border-gray-300'}`}>Ajustar</button>
                                    <button onClick={() => setImageFit('cover')} className={`px-3 py-1.5 text-xs rounded-md border ${imageFit === 'cover' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100 border-gray-300'}`}>Preencher</button>
                                    <button onClick={() => setImageFit('fill')} className={`px-3 py-1.5 text-xs rounded-md border ${imageFit === 'fill' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100 border-gray-300'}`}>Esticar</button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {imageFit === 'contain' && 'Mostra a imagem inteira, pode deixar espaços em branco.'}
                                    {imageFit === 'cover' && 'Preenche todo o espaço, pode cortar partes da imagem.'}
                                    {imageFit === 'fill' && 'Estica a imagem para preencher o espaço, pode distorcer.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderPreview = () => (
        <div className="w-full max-w-2xl mx-auto">
            {!processedImage ? (
                <div className="aspect-[4/3] bg-gray-200 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500 text-center p-4">
                    <p>A pré-visualização da sua foto aparecerá aqui.<br/>Comece por carregar ou tirar uma foto.</p>
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap justify-end gap-2 mb-4">
                        <button onClick={() => handleDownload('png')} disabled={isLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                            <DownloadIcon className="w-5 h-5"/> Baixar PNG
                        </button>
                        <button onClick={() => handleDownload('pdf')} disabled={isLoading || activeTemplateId === 'livre'} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400" title={activeTemplateId === 'livre' ? 'Selecione um formato com tamanho definido' : ''}>
                            <DownloadIcon className="w-5 h-5"/> Baixar PDF
                        </button>
                        <button onClick={handlePrint} disabled={isLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400">
                            <PrintIcon className="w-5 h-5"/> Imprimir
                        </button>
                            <button onClick={() => setIsSheetExporterOpen(true)} disabled={isLoading} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                            <SheetIcon className="w-5 h-5"/> Exportar Folha
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                    
                    <div ref={previewRef} className="bg-gray-300 relative shadow-lg rounded-lg mx-auto" style={{ aspectRatio: `${finalAspectRatio}`, maxWidth: finalAspectRatio > 1 ? '100%' : '60%' }}>
                            {isLoading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg"><SpinnerIcon className="w-12 h-12 text-white" /></div>}
                        <div style={{ background: backgrounds.find(bg => bg.id === activeBackgroundId)?.style || 'transparent', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={processedImage} alt="Processada" className="w-full h-full" style={imageStyle} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <canvas ref={canvasRef} className="hidden"></canvas>
            {isCameraOpen && (
                <CameraView
                    videoRef={videoRef}
                    onCapture={handleCapture}
                    onCancel={stopCamera}
                    onConfirm={handleConfirmCapture}
                    onRetake={handleRetake}
                    guideAspectRatio={previewAspectRatio}
                    capturedPhoto={capturedPhoto}
                />
            )}
            <SheetExporter
                isOpen={isSheetExporterOpen}
                onClose={() => setIsSheetExporterOpen(false)}
                elementToExportRef={previewRef}
                aspectRatio={finalAspectRatio}
                itemWidth_mm={selectedTemplate?.width_mm}
                itemHeight_mm={selectedTemplate?.height_mm}
                baseFileName="foto_editada"
                serviceId={SERVICE_ID}
                sheetSize="10x15"
            />
    
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden sticky top-0 bg-white z-10 border-b">
                <div className="flex">
                    <button onClick={() => setActiveTab('editor')} className={`flex-1 p-3 text-sm font-semibold transition-colors ${activeTab === 'editor' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500'}`}>
                        Editar
                    </button>
                    <button onClick={() => setActiveTab('preview')} className={`flex-1 p-3 text-sm font-semibold transition-colors ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500'}`}>
                        Pré-visualizar
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                {/* Controls Panel */}
                <div className={`w-full lg:w-1/3 bg-white overflow-y-auto ${activeTab === 'editor' ? 'block' : 'hidden'} lg:block`}>
                    {renderEditor()}
                </div>
                
                {/* Preview Panel */}
                <div className={`w-full lg:w-2/3 flex-1 flex items-center justify-center p-4 lg:p-8 bg-gray-100 overflow-y-auto ${activeTab === 'preview' ? 'flex' : 'hidden'} lg:flex`}>
                    {renderPreview()}
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            {originalImage && (
                 <button
                    onClick={() => setActiveTab(activeTab === 'editor' ? 'preview' : 'editor')}
                    className="lg:hidden fixed bottom-6 right-6 z-30 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                    aria-label="Alternar entre editor e pré-visualização"
                >
                    {activeTab === 'editor' ? 'Pré-visualizar' : 'Editar'}
                </button>
            )}
        </div>
    );
};

export default PhotoStudio;