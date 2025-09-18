import React, { useState, useMemo, useEffect } from 'react';
import { useCredits } from '../contexts/CreditContext';

// --- ICONS ---
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const PrintIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>);
const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

interface SheetExporterProps {
  isOpen: boolean;
  onClose: () => void;
  elementToExportRef: React.RefObject<HTMLDivElement>;
  aspectRatio: number;
  baseFileName: string;
  serviceId: string;
  itemWidth_mm?: number;
  itemHeight_mm?: number;
  sheetSize?: 'A4' | '10x15' | 'A4-landscape';
}

const quantityOptions = [1, 2, 4, 6, 8];

const SheetExporter: React.FC<SheetExporterProps> = ({ 
    isOpen, 
    onClose, 
    elementToExportRef, 
    aspectRatio, 
    baseFileName, 
    serviceId, 
    itemWidth_mm, 
    itemHeight_mm,
    sheetSize = 'A4'
}) => {
    const [quantity, setQuantity] = useState(4);
    const [customQuantity, setCustomQuantity] = useState('');
    const [isExporting, setIsExporting] = useState(false);
    const [itemImage, setItemImage] = useState<string | null>(null);

    const { requestServiceUse } = useCredits();
    const finalQuantity = customQuantity ? parseInt(customQuantity, 10) || quantity : quantity;
    
    const sheetDimensions = useMemo(() => {
        if (sheetSize === '10x15') {
            return { width_mm: 100, height_mm: 150, padding_mm: 5, name: '100mm 150mm', displayName: '10x15cm' };
        }
        if (sheetSize === 'A4-landscape') {
            return { width_mm: 297, height_mm: 210, padding_mm: 10, name: 'A4 landscape', displayName: 'A4 Horizontal' };
        }
        // Default to A4 Portrait
        return { width_mm: 210, height_mm: 297, padding_mm: 10, name: 'A4 portrait', displayName: 'A4 Vertical' };
    }, [sheetSize]);

    const layout = useMemo(() => {
        if (itemWidth_mm && itemHeight_mm) {
            const { width_mm, height_mm, padding_mm } = sheetDimensions;
            const availableW = width_mm - (padding_mm * 2);
            const availableH = height_mm - (padding_mm * 2);
            const itemW = itemWidth_mm + 1; // with gap
            const itemH = itemHeight_mm + 1; // with gap

            const cols = Math.floor(availableW / itemW);
            const rows = Math.floor(availableH / itemH);
            return { cols: cols > 0 ? cols : 1, rows: rows > 0 ? rows : 1 };
        }

        // Fallback for items without physical dimensions (like resumes, invitations)
        const quantity = finalQuantity;
        if (quantity === 1) return { rows: 1, cols: 1 };
        if (quantity === 2) return { rows: 2, cols: 1 };
        if (quantity === 3 || quantity === 4) return { rows: 2, cols: 2 };
        if (quantity === 5 || quantity === 6) return { rows: 3, cols: 2 };
        if (quantity >= 7 && quantity <= 8) return { rows: 4, cols: 2 };
        if (quantity >= 9 && quantity <= 10) return { rows: 5, cols: 2 };
        if (quantity >= 11 && quantity <= 12) return { rows: 4, cols: 3 };
        return { rows: Math.ceil(quantity / 2), cols: 2 };
    }, [finalQuantity, itemWidth_mm, itemHeight_mm, sheetDimensions]);

    useEffect(() => {
        if (isOpen && elementToExportRef.current) {
            const { html2canvas } = window as any;
            html2canvas(elementToExportRef.current, { scale: 2, useCORS: true, backgroundColor: null })
                .then((canvas: HTMLCanvasElement) => {
                    setItemImage(canvas.toDataURL('image/png'));
                });
        }
    }, [isOpen, elementToExportRef]);

    const handleExport = (format: 'pdf' | 'png') => {
        const performExport = async () => {
            if (!itemImage) return;
            setIsExporting(true);

            const printContainer = document.createElement('div');
            printContainer.style.position = 'absolute';
            printContainer.style.left = '-9999px';
            printContainer.style.width = `${sheetDimensions.width_mm}mm`;
            printContainer.style.height = `${sheetDimensions.height_mm}mm`;
            printContainer.style.padding = `${sheetDimensions.padding_mm}mm`;
            printContainer.style.boxSizing = 'border-box';
            printContainer.style.backgroundColor = '#fff';

            if (itemWidth_mm && itemHeight_mm) {
                printContainer.style.display = 'flex';
                printContainer.style.flexWrap = 'wrap';
                printContainer.style.alignContent = 'flex-start';
                printContainer.style.gap = '1mm';

                for (let i = 0; i < finalQuantity; i++) {
                    const itemWrapper = document.createElement('div');
                    itemWrapper.style.width = `${itemWidth_mm}mm`;
                    itemWrapper.style.height = `${itemHeight_mm}mm`;
                    itemWrapper.style.border = '0.5px dashed #aaa';
                    itemWrapper.style.boxSizing = 'border-box';
                    itemWrapper.style.overflow = 'hidden';
                    itemWrapper.style.backgroundImage = `url('${itemImage}')`;
                    itemWrapper.style.backgroundSize = 'cover';
                    itemWrapper.style.backgroundPosition = 'center';
                    
                    printContainer.appendChild(itemWrapper);
                }
            } else {
                printContainer.style.display = 'grid';
                printContainer.style.gridTemplateRows = `repeat(${layout.rows}, 1fr)`;
                printContainer.style.gridTemplateColumns = `repeat(${layout.cols}, 1fr)`;
                printContainer.style.gap = '1px';

                for (let i = 0; i < finalQuantity; i++) {
                    const itemWrapper = document.createElement('div');
                    itemWrapper.style.border = '0.5px dashed #aaa';
                    itemWrapper.style.display = 'flex';
                    itemWrapper.style.justifyContent = 'center';
                    itemWrapper.style.alignItems = 'center';
                    itemWrapper.style.overflow = 'hidden';

                    const img = document.createElement('img');
                    img.src = itemImage;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'contain';
                    
                    itemWrapper.appendChild(img);
                    printContainer.appendChild(itemWrapper);
                }
            }

            document.body.appendChild(printContainer);

            const { html2canvas } = window as any;
            try {
                const canvas = await html2canvas(printContainer, { scale: 3, useCORS: true });
                const imgData = canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
                const fileName = `${baseFileName}_folha_x${finalQuantity}`;

                if (format === 'png') {
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `${fileName}.png`;
                    link.click();
                } else {
                    const { jsPDF } = (window as any).jspdf;
                    const { width_mm, height_mm } = sheetDimensions;
                    const pdf = new jsPDF({ 
                        orientation: width_mm > height_mm ? 'landscape' : 'portrait', 
                        unit: 'mm', 
                        format: [width_mm, height_mm]
                    });
                    pdf.addImage(imgData, 'PNG', 0, 0, width_mm, height_mm);
                    pdf.save(`${fileName}.pdf`);
                }
            } catch (error) {
                console.error(`Error exporting as ${format}:`, error);
            } finally {
                document.body.removeChild(printContainer);
                setIsExporting(false);
            }
        };
        requestServiceUse(serviceId, performExport, {
            title: 'Confirmar Exportação em Folha',
            message: `Exportar esta folha como ${format.toUpperCase()} irá descontar <strong>1 crédito</strong>.`
        });
    };
    
    const handlePrint = () => {
        const performPrint = () => {
            if (!itemImage) {
                alert("A imagem do item ainda não foi gerada. Por favor, aguarde.");
                return;
            }
            setIsExporting(true);
    
            const oldIframe = document.getElementById('sheet-print-iframe');
            if (oldIframe) oldIframe.remove();
    
            const iframe = document.createElement('iframe');
            iframe.id = 'sheet-print-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            let pageContentHtml: string;
            let pageStyle: string;

            if (itemWidth_mm && itemHeight_mm) {
                pageContentHtml = Array.from({ length: finalQuantity }).map(() => `
                    <div class="print-item" style="background-image: url('${itemImage}');"></div>
                `).join('');
                
                pageStyle = `
                    #print-grid {
                        width: 100%; height: 100%; display: flex; flex-wrap: wrap;
                        align-content: flex-start; gap: 1mm; box-sizing: border-box;
                    }
                    .print-item {
                        width: ${itemWidth_mm}mm; height: ${itemHeight_mm}mm;
                        border: 0.5px dashed #aaa; box-sizing: border-box;
                        background-size: cover;
                        background-position: center;
                        background-repeat: no-repeat;
                    }
                `;
            } else {
                pageContentHtml = Array.from({ length: finalQuantity }).map(() => `
                    <div style="border: 0.5px dashed #aaa; display: flex; justify-content: center; align-items: center; overflow: hidden; height: 100%; box-sizing: border-box;">
                        <img src="${itemImage}" style="width: 100%; height: 100%; object-fit: contain;" />
                    </div>
                `).join('');
                
                pageStyle = `
                    #print-grid {
                        width: 100%; height: 100%; display: grid;
                        grid-template-rows: repeat(${layout.rows}, 1fr);
                        grid-template-columns: repeat(${layout.cols}, 1fr);
                        gap: 1mm; box-sizing: border-box;
                    }
                `;
            }
    
            const htmlContent = `
                <html>
                    <head>
                        <title>${baseFileName}</title>
                        <style>
                            @page { size: ${sheetDimensions.name}; margin: ${sheetDimensions.padding_mm}mm; }
                            body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                            ${pageStyle}
                        </style>
                    </head>
                    <body>
                        <div id="print-grid">${pageContentHtml}</div>
                    </body>
                </html>
            `;
            
            iframe.srcdoc = htmlContent;
    
            iframe.onload = () => {
                try {
                    iframe.contentWindow?.focus();
                    iframe.contentWindow?.print();
                } catch (e) {
                    console.error("Print failed:", e);
                    alert("Ocorreu um erro ao tentar imprimir.");
                } finally {
                    setIsExporting(false);
                }
            };
        };
    
        requestServiceUse(serviceId, performPrint, {
            title: 'Confirmar Impressão',
            message: `Imprimir esta folha irá descontar <strong>1 crédito</strong>.`
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold">Exportar em Folha ({sheetDimensions.displayName})</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><CloseIcon className="w-5 h-5"/></button>
                </header>
                <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
                    {/* Controls */}
                    <div className="w-full lg:w-1/3 space-y-4">
                        <div>
                            <label className="font-semibold block mb-2">Quantidade por folha</label>
                            <div className="grid grid-cols-3 gap-2">
                                {quantityOptions.map(q => (
                                    <button key={q} onClick={() => { setQuantity(q); setCustomQuantity(''); }} className={`p-2 text-sm rounded-md border-2 ${quantity === q && !customQuantity ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-100'}`}>{q} exemplares</button>
                                ))}
                            </div>
                            <div className="mt-3">
                                <label className="block text-sm font-medium mb-1">Personalizar quantidade:</label>
                                <input type="number" value={customQuantity} onChange={e => setCustomQuantity(e.target.value)} min="1" className={`w-full p-2 border-2 rounded-md ${customQuantity ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`} placeholder="Ex: 12" />
                            </div>
                        </div>
                        <div className="border-t pt-4 space-y-3">
                            <h4 className="font-semibold">Opções de Exportação</h4>
                             <button onClick={handlePrint} disabled={isExporting} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400">
                                {isExporting ? <SpinnerIcon className="w-5 h-5"/> : <PrintIcon className="w-5 h-5"/>}
                                Imprimir Diretamente
                            </button>
                            <button onClick={() => handleExport('pdf')} disabled={isExporting} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:bg-gray-400">
                                {isExporting ? <SpinnerIcon className="w-5 h-5"/> : <DownloadIcon className="w-5 h-5"/>}
                                Exportar PDF
                            </button>
                            <button onClick={() => handleExport('png')} disabled={isExporting} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                                 {isExporting ? <SpinnerIcon className="w-5 h-5"/> : <DownloadIcon className="w-5 h-5"/>}
                                Exportar Imagem (PNG)
                            </button>
                        </div>
                    </div>
                    {/* Preview */}
                    <div className="flex-1 bg-gray-100 p-4 rounded-lg overflow-auto">
                        <p className="text-center text-sm text-gray-600 mb-2">Pré-visualização da folha {sheetDimensions.displayName}</p>
                        <div className="w-full mx-auto bg-white shadow-lg" style={{ aspectRatio: `${sheetDimensions.width_mm}/${sheetDimensions.height_mm}`}}>
                             <div className="w-full h-full grid gap-px p-1" style={{ gridTemplateColumns: `repeat(${layout.cols}, 1fr)`, gridTemplateRows: `repeat(${layout.rows}, 1fr)` }}>
                                {itemImage && Array.from({ length: Math.min(finalQuantity, layout.rows * layout.cols) }).map((_, i) => (
                                    <div key={i} className="border border-dashed border-gray-300 flex items-center justify-center p-0.5 overflow-hidden">
                                        <img src={itemImage} className="w-full h-full" style={{ objectFit: itemWidth_mm ? 'cover' : 'contain' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SheetExporter;