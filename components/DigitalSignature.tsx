import React, { useState, useRef, useCallback } from 'react';

// Icons
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const SignatureIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>);

const SignaturePad: React.FC<{ onSave: (dataUrl: string) => void, onCancel: () => void }> = ({ onSave, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        if (e.nativeEvent instanceof MouseEvent) {
            return { x: e.nativeEvent.clientX - rect.left, y: e.nativeEvent.clientY - rect.top };
        }
        if (e.nativeEvent instanceof TouchEvent) {
            return { x: e.nativeEvent.touches[0].clientX - rect.left, y: e.nativeEvent.touches[0].clientY - rect.top };
        }
        return { x: 0, y: 0 };
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { x, y } = getCoords(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const { x, y } = getCoords(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSave = () => {
        if (!canvasRef.current) return;
        onSave(canvasRef.current.toDataURL('image/png'));
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Desenhe a sua Assinatura</h3>
                </div>
                <div className="p-4">
                    <canvas
                        ref={canvasRef}
                        width="450"
                        height="200"
                        className="bg-gray-100 border border-gray-300 rounded-md w-full touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                    />
                </div>
                <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
                    <button onClick={clearCanvas} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Limpar</button>
                    <button onClick={onCancel} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Cancelar</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar</button>
                </div>
            </div>
        </div>
    );
};


const DigitalSignature: React.FC = () => {
    const [documentImage, setDocumentImage] = useState<string | null>(null);
    const [signatureImage, setSignatureImage] = useState<string | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const finalImageRef = useRef<HTMLDivElement>(null);

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDocumentImage(reader.result as string);
                setSignatureImage(null); // Reset signature if new doc is uploaded
            };
            reader.readAsDataURL(file);
        } else {
            alert("Por favor, carregue um ficheiro de imagem válido (JPG, PNG).");
        }
    };
    
    const handleDownload = async () => {
        if (!finalImageRef.current) return;
        setIsDownloading(true);
        const { html2canvas } = (window as any);

        try {
            const canvas = await html2canvas(finalImageRef.current, { scale: 2, useCORS: true, backgroundColor: null });
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'documento_assinado.png';
            link.click();
        } catch (error) {
            console.error("Erro ao gerar a imagem:", error);
            alert("Ocorreu um erro ao descarregar o documento.");
        } finally {
            setIsDownloading(false);
        }
    };
    
    return (
        <div className="p-4 lg:p-6">
            {isSigning && <SignaturePad onSave={(sig) => { setSignatureImage(sig); setIsSigning(false); }} onCancel={() => setIsSigning(false)} />}
            
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
                <h2 className="text-xl font-bold mb-4">Assinatura Digital de Imagens</h2>
                
                {!documentImage && (
                    <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <UploadIcon className="w-12 h-12 mx-auto text-gray-400"/>
                        <p className="mt-2 text-gray-600">Comece por carregar uma imagem (JPG, PNG)</p>
                        <label className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 cursor-pointer">
                            Carregar Documento
                            <input type="file" accept="image/jpeg, image/png" className="hidden" onChange={handleDocumentUpload} />
                        </label>
                    </div>
                )}
                
                {documentImage && (
                    <>
                        <div className="mb-4 p-2 border bg-gray-100 rounded-md overflow-auto">
                            <div ref={finalImageRef} className="relative w-fit mx-auto">
                                <img src={documentImage} alt="Documento" className="max-w-full h-auto" />
                                {signatureImage && (
                                    <img src={signatureImage} alt="Assinatura" className="absolute top-1/2 left-1/2 w-1/4 h-auto" style={{ transform: 'translate(-50%, -50%)' }} />
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={() => setIsSigning(true)} className="flex-1 flex items-center justify-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600">
                                <SignatureIcon className="w-5 h-5 mr-2" />
                                {signatureImage ? 'Alterar Assinatura' : 'Adicionar Assinatura'}
                            </button>
                            <button onClick={handleDownload} disabled={!signatureImage || isDownloading} className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400">
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                {isDownloading ? 'A descarregar...' : 'Descarregar Imagem Assinada'}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 text-center">Dica: A assinatura será colocada no centro. A funcionalidade de arrastar e redimensionar estará disponível em breve.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default DigitalSignature;