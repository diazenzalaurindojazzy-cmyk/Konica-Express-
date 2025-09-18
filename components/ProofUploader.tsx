import React, { useState, useRef, useEffect } from 'react';

// --- ICONS ---
const CameraIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const CheckIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>);
const RefreshIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20l-5-5m5 5V4M4 4l5 5" /></svg>);

interface ProofUploaderProps {
    onComplete: (data: string | null) => void;
    onCancel: () => void;
}

const ProofUploader: React.FC<ProofUploaderProps> = ({ onComplete, onCancel }) => {
    const [view, setView] = useState<'selection' | 'camera' | 'confirm'>('selection');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [showFlash, setShowFlash] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
            });
            setStream(mediaStream);
            setView('camera');
        } catch (error) {
            console.error("Erro ao aceder à câmera: ", error);
            alert("Não foi possível aceder à câmera. Verifique as permissões.");
            onCancel();
        }
    };
    
    useEffect(() => {
        if (view === 'camera' && stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [view, stream]);


    useEffect(() => {
        // Cleanup function to stop camera when component unmounts
        return () => stopCamera();
    }, []);

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 150);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        setView('confirm');
        stopCamera();
    };

    const handleFileTrigger = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type === 'application/pdf') {
            onComplete(`pdf:${file.name}`);
            return;
        }

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onComplete(reader.result as string);
            };
            reader.readAsDataURL(file);
            return;
        }

        alert("Tipo de ficheiro não suportado. Por favor, carregue uma imagem (JPG, PNG) ou PDF.");
    };

    const renderSelection = () => (
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Enviar Comprovativo</h3>
            <p className="text-gray-600 mb-6">Como deseja enviar o seu comprovativo de pagamento?</p>
            <div className="space-y-4">
                <button onClick={startCamera} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                    <CameraIcon className="w-6 h-6"/>
                    Capturar com Câmera
                </button>
                <button onClick={handleFileTrigger} className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors">
                    <UploadIcon className="w-6 h-6"/>
                    Carregar Ficheiro (Imagem/PDF)
                </button>
            </div>
            <button onClick={onCancel} className="mt-6 text-sm text-gray-500 hover:underline">Cancelar</button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/png, image/jpeg, application/pdf" />
        </div>
    );

    const renderCamera = () => (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
            {showFlash && <div className="absolute inset-0 bg-white z-10 opacity-80 animate-fade-out"></div>}
            <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
                <div 
                    className="w-[90vw] max-w-2xl aspect-[2/3] border-4 border-dashed border-white/80 rounded-lg"
                    style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)' }}
                />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col items-center z-10">
                <p className="text-white text-center mb-4">Alinhe o comprovativo na área designada</p>
                <div className="flex items-center space-x-12">
                     <button onClick={() => { stopCamera(); setView('selection'); }} className="p-3 bg-white/20 text-white rounded-full shadow-lg hover:bg-white/30"><CloseIcon className="w-6 h-6"/></button>
                     <button onClick={handleCapture} className="p-4 bg-blue-600 text-white rounded-full shadow-lg ring-4 ring-white/50 hover:bg-blue-700"><CameraIcon className="w-8 h-8"/></button>
                     <div className="w-12 h-12"></div> {/* Placeholder for symmetry */}
                </div>
            </div>
        </div>
    );
    
    const renderConfirm = () => (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4">
            <img src={capturedImage!} alt="Comprovativo capturado" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
            <div className="mt-6 flex items-center space-x-8">
                <button onClick={() => { setCapturedImage(null); startCamera(); }} className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700">
                    <RefreshIcon className="w-6 h-6" /> Tirar Novamente
                </button>
                <button onClick={() => onComplete(capturedImage)} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700">
                    <CheckIcon className="w-6 h-6" /> Confirmar
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            {view === 'selection' && renderSelection()}
            {view === 'camera' && renderCamera()}
            {view === 'confirm' && renderConfirm()}
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default ProofUploader;