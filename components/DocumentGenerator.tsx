import React, { useState, useRef, useEffect } from 'react';
import AdobeViewer from './AdobeViewer';
import type { Service } from '../App';
import { getDocumentAsHtml, templates } from './documentTemplates';
import type { StyleOptions } from './documentTemplates';
import { useCredits } from '../contexts/CreditContext';


// --- ICONS ---
const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const SpinnerIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const PrintIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>);
const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>);

const creatorServices: { id: Service, name: string; icon: string; description: string }[] = [
    { id: 'invitation', name: 'Criador de Convites', icon: 'M16 12V8m0 4h-4m4 0l-4-4m6 10H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2z', description: 'Crie convites elegantes para qualquer ocasião, prontos para imprimir.' },
    { id: 'businessCard', name: 'Cartões de Visita', icon: 'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-4M9 4h6a2 2 0 012 2v2H7V6a2 2 0 012-2z', description: 'Desenhe cartões de visita profissionais com as medidas certas.' },
    { id: 'pass', name: 'Criador de Passes', icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z', description: 'Gere passes e crachás para eventos e empresas, com tamanho padrão.' },
    { id: 'photoStudio', name: 'Estúdio de Foto', icon: 'M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z', description: 'Tire e edite fotos tipo passe e retratos com as dimensões corretas.' },
];

const Accordion: React.FC<{ title: string, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <button
                type="button"
                className="w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <ChevronDownIcon className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};

// --- Form Helper Components ---
const Input: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string, error?: string }> = ({ label, name, value, onChange, placeholder, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 border rounded-md shadow-sm transition duration-150 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);
const TextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string, rows?: number, error?: string }> = ({ label, name, value, onChange, placeholder, rows = 4, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={`w-full px-3 py-2 border rounded-md shadow-sm transition duration-150 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);

const fontOptions = [
    { name: "Moderno (Inter)", value: "'Inter', sans-serif" },
    { name: "Elegante (Lora)", value: "'Lora', serif" },
    { name: "Simples (Lato)", value: "'Lato', sans-serif" },
    { name: "Formal (Playfair Display)", value: "'Playfair Display', serif" },
    { name: "Manuscrito (Dancing Script)", value: "'Dancing Script', cursive" }
];

const borderOptions = [
    { name: "Nenhuma", value: "none" },
    { name: "Simples", value: "1px solid #333" },
    { name: "Tracejada", value: "2px dashed #666" },
    { name: "Dupla", value: "4px double #333" }
];

const TextDocumentGenerator: React.FC = () => {
    const [activeTemplateId, setActiveTemplateId] = useState<string>('rec');
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [styleOptions, setStyleOptions] = useState<StyleOptions>({
        fontFamily: "'Inter', sans-serif",
        fontSize: '12pt',
        isTitleBold: true,
        isTitleUnderlined: false,
        showSignatureLine: true,
        border: 'none',
        pattern: 'none'
    });
    const [htmlPreview, setHtmlPreview] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<false | 'pdf' | 'print'>(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const previewRef = useRef<HTMLDivElement>(null);
    const { requestServiceUse } = useCredits();
    const SERVICE_ID = 'documents';

    const activeTemplate = templates[activeTemplateId];

    // Refs and state for scaling the preview
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(0.1);

    useEffect(() => {
        const generatePreview = () => {
            const generatedHtml = getDocumentAsHtml(activeTemplateId, formData, styleOptions);
            setHtmlPreview(generatedHtml || '');
        };
        generatePreview();
    }, [activeTemplateId, formData, styleOptions]);

    useEffect(() => {
        const calculateScale = () => {
            if (previewContainerRef.current) {
                const containerWidth = previewContainerRef.current.offsetWidth;
                const a4WidthInPx = 794; // 210mm at 96 DPI
                if (containerWidth > 0 && a4WidthInPx > 0) {
                    const availableWidth = containerWidth - 32; // Account for padding
                    setScale(availableWidth / a4WidthInPx);
                }
            }
        };

        const timeoutId = setTimeout(calculateScale, 50);
        const resizeObserver = new ResizeObserver(calculateScale);
        if (previewContainerRef.current) {
            resizeObserver.observe(previewContainerRef.current);
        }

        return () => {
            clearTimeout(timeoutId);
            resizeObserver.disconnect();
        };
    }, [htmlPreview]);

    const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setActiveTemplateId(e.target.value);
        setFormData({}); // Reset form data when template changes
        setErrors({}); // Reset errors
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const checkedValue = (e.target as HTMLInputElement).checked;
    
        setStyleOptions(prev => ({
            ...prev,
            [name]: isCheckbox ? checkedValue : value
        }));
    };

    const validateData = (): boolean => {
        const newErrors: Record<string, string> = {};
        activeTemplate.fields.forEach(field => {
            if (!formData[field.id] || !formData[field.id].trim()) {
                newErrors[field.id] = `O campo "${field.label}" é obrigatório.`;
            }
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            alert('Por favor, preencha todos os campos do modelo selecionado.');
            return false;
        }
        return true;
    };
    

    const handleDownloadPdf = () => {
        if (!validateData()) return;
        const performDownload = async () => {
            // Get the actual A4 element from the preview
            const content = previewRef.current?.querySelector('div[style*="width: 210mm"]');
            if (!content) return;

            const { jsPDF } = (window as any).jspdf;
            const html2canvas = (window as any).html2canvas;

            setIsProcessing('pdf');

            try {
                const canvas = await html2canvas(content as HTMLElement, { scale: 2, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${activeTemplate.name.replace(/\s+/g, '_')}.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
            } finally {
                setIsProcessing(false);
            }
        };
        requestServiceUse(SERVICE_ID, performDownload, {
            title: 'Confirmar Download de PDF',
            message: 'Baixar este documento irá descontar <strong>1 crédito</strong>.'
        });
    };
    
    const handlePrint = () => {
        if (!validateData()) return;
        const performPrint = () => {
            // Get the actual A4 element's HTML
            const content = previewRef.current?.querySelector('div[style*="width: 210mm"]');
            if (!content) return;
            setIsProcessing('print');

            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const htmlContent = `
                <html>
                    <head>
                        <title>${activeTemplate.name}</title>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Lora:ital,wght@0,400;1,400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
                        <style>
                            @page { size: A4 portrait; margin: 0; }
                            body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        </style>
                    </head>
                    <body>${content.outerHTML}</body>
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
                        setIsProcessing(false);
                        document.body.removeChild(iframe);
                    }
                }, 500);
            };
        };
        requestServiceUse(SERVICE_ID, performPrint, {
            title: 'Confirmar Impressão',
            message: 'Imprimir este documento irá descontar <strong>1 crédito</strong>.'
        });
    };

    const filteredTemplates = Object.entries(templates).filter(([id, template]) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-6 bg-gray-50/70">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Controls Column */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="template-select" className="block text-sm font-semibold text-gray-700 mb-2">1. Escolha o Modelo</label>
                        <div className="relative mb-2">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Pesquisar modelo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <select id="template-select" value={activeTemplateId} onChange={handleTemplateChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm">
                            {filteredTemplates.length > 0 ? (
                                filteredTemplates.map(([id, template]) => (
                                    <option key={id} value={id}>{template.name}</option>
                                ))
                            ) : (
                                <option disabled>Nenhum modelo encontrado</option>
                            )}
                        </select>
                    </div>

                    <div className="space-y-4 p-4 border rounded-md bg-white">
                        <h4 className="font-semibold text-gray-700">2. Preencha os Campos</h4>
                        {activeTemplate.fields.map(field => (
                            field.type === 'textarea' ? (
                                <TextArea key={field.id} label={field.label} name={field.id} value={formData[field.id] || ''} onChange={handleFormChange} placeholder={field.placeholder} error={errors[field.id]} />
                            ) : (
                                <Input key={field.id} label={field.label} name={field.id} value={formData[field.id] || ''} onChange={handleFormChange} placeholder={field.placeholder} error={errors[field.id]} />
                            )
                        ))}
                    </div>

                    <div className="space-y-4 p-4 border rounded-md bg-white">
                        <h4 className="font-semibold text-gray-700">3. Opções de Estilo</h4>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="fontFamily" className="block text-xs font-medium mb-1">Fonte</label>
                                <select id="fontFamily" name="fontFamily" value={styleOptions.fontFamily} onChange={handleStyleChange} className="w-full text-sm p-2 border border-gray-300 rounded-md">
                                    {fontOptions.map(font => <option key={font.value} value={font.value}>{font.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="fontSize" className="block text-xs font-medium mb-1">Tamanho da Fonte</label>
                                <select id="fontSize" name="fontSize" value={styleOptions.fontSize} onChange={handleStyleChange} className="w-full text-sm p-2 border border-gray-300 rounded-md">
                                    <option value="11pt">Pequeno</option>
                                    <option value="12pt">Normal</option>
                                    <option value="14pt">Grande</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="border" className="block text-xs font-medium mb-1">Borda da Página</label>
                                <select id="border" name="border" value={styleOptions.border} onChange={handleStyleChange} className="w-full text-sm p-2 border border-gray-300 rounded-md">
                                    {borderOptions.map(border => <option key={border.value} value={border.value}>{border.name}</option>)}
                                </select>
                            </div>
                        </div>
                         <div className="flex items-center space-x-6 pt-2">
                             <div className="flex items-center">
                                <input type="checkbox" id="isTitleBold" name="isTitleBold" checked={styleOptions.isTitleBold} onChange={handleStyleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <label htmlFor="isTitleBold" className="ml-2 block text-sm text-gray-900">Título em Negrito</label>
                            </div>
                             <div className="flex items-center">
                                <input type="checkbox" id="isTitleUnderlined" name="isTitleUnderlined" checked={styleOptions.isTitleUnderlined} onChange={handleStyleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                                <label htmlFor="isTitleUnderlined" className="ml-2 block text-sm text-gray-900">Título Sublinhado</label>
                            </div>
                        </div>
                        <div className="flex items-center pt-2">
                            <input type="checkbox" id="showSignatureLine" name="showSignatureLine" checked={styleOptions.showSignatureLine} onChange={handleStyleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label htmlFor="showSignatureLine" className="ml-2 block text-sm text-gray-900">Mostrar Linha de Assinatura</label>
                        </div>
                    </div>
                </div>

                {/* Preview and Actions Column */}
                <div>
                    <div className="flex justify-end gap-3 mb-4">
                         <button onClick={handlePrint} disabled={!!isProcessing} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 disabled:bg-gray-400">
                             {isProcessing === 'print' ? <SpinnerIcon className="w-5 h-5"/> : <PrintIcon className="w-5 h-5"/>} Imprimir
                        </button>
                         <button onClick={handleDownloadPdf} disabled={!!isProcessing} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400">
                             {isProcessing === 'pdf' ? <SpinnerIcon className="w-5 h-5"/> : <DownloadIcon className="w-5 h-5"/>} Baixar PDF
                        </button>
                    </div>
                     <div className="bg-gray-200 p-4 rounded-md h-[80vh] overflow-auto flex justify-center" ref={previewContainerRef}>
                        <div ref={previewRef} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
                            <div dangerouslySetInnerHTML={{ __html: htmlPreview }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


interface DocumentGeneratorProps {
  onNavigateToService: (serviceId: Service) => void;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({ onNavigateToService }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [adobeViewerState, setAdobeViewerState] = useState<{ isOpen: boolean; pdfBlob: Blob | null; fileName: string; }>({ isOpen: false, pdfBlob: null, fileName: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAdobeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        let pdfBlob: Blob | null = null;
        let errorMsg = '';

        try {
            if (file.type === 'application/pdf') {
                pdfBlob = file;
            } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                const arrayBuffer = await file.arrayBuffer();
                const mammoth = (window as any).mammoth;
                const result = await mammoth.convertToHtml({ arrayBuffer });
                const htmlContent = `<div style="padding: 2cm; font-family: 'Times New Roman', serif; max-width: 210mm; margin: auto;">${result.value}</div>`;
                
                const tempDiv = document.createElement('div');
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.style.width = '210mm'; // A4 width
                tempDiv.innerHTML = htmlContent;
                document.body.appendChild(tempDiv);

                const { jsPDF } = (window as any).jspdf;
                const html2canvas = (window as any).html2canvas;
                const canvas = await html2canvas(tempDiv, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                let pageHeightLeft = pdfHeight;
                let position = 0;
                
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                pageHeightLeft -= pdf.internal.pageSize.getHeight();

                while (pageHeightLeft > 0) {
                    position -= pdf.internal.pageSize.getHeight();
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                    pageHeightLeft -= pdf.internal.pageSize.getHeight();
                }

                pdfBlob = pdf.output('blob');
                document.body.removeChild(tempDiv);
            } else {
                errorMsg = "Tipo de ficheiro não suportado. Por favor, carregue .pdf ou .docx.";
            }
        } catch (err) {
            console.error("Error processing file for Adobe Viewer:", err);
            errorMsg = "Ocorreu um erro ao processar o ficheiro. Tente novamente.";
        } finally {
            setIsLoading(false);
            if (e.target) e.target.value = ''; // Reset input
        }

        if (errorMsg) {
            alert(errorMsg);
        } else if (pdfBlob) {
            setAdobeViewerState({ isOpen: true, pdfBlob, fileName: file.name });
        }
    };
    
    return (
        <div className="p-4 lg:p-8 bg-gray-100 min-h-full">
            {adobeViewerState.isOpen && adobeViewerState.pdfBlob && (
                <AdobeViewer
                    pdfBlob={adobeViewerState.pdfBlob}
                    fileName={adobeViewerState.fileName}
                    onClose={() => setAdobeViewerState({ isOpen: false, pdfBlob: null, fileName: '' })}
                />
            )}
            <div className="max-w-7xl mx-auto w-full space-y-8">
                 <Accordion title="Carregar e Editar o Seu Próprio Documento" defaultOpen={false}>
                    <div className="p-4 sm:p-6 bg-gray-50/70">
                        <p className="text-gray-600 mt-2 mb-4">
                            Visualize, anote, preencha e assine modelos,formularios,requerimentos e outros  ficheiros PDF ou Word (.docx) diretamente na nossa aplicação, com a tecnologia da Adobe.
                        </p>
                        <div className="text-center">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isLoading}
                                className="w-full max-w-md inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-wait"
                            >
                                {isLoading ? <SpinnerIcon className="w-5 h-5" /> : <UploadIcon className="w-5 h-5" />}
                                {isLoading ? 'A processar...' : 'Carregar Documento (PDF/Word)'}
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleAdobeFileUpload} className="hidden" accept=".pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                    </div>
                </Accordion>

                <Accordion title="Gerador de Documentos de Texto" defaultOpen={true}>
                    <TextDocumentGenerator />
                </Accordion>

                <Accordion title="Criar a Partir de um Modelo Visual" defaultOpen={false}>
                    <div className="p-4 md:p-6 bg-gray-50/70">
                        <p className="text-gray-600 mt-2 mb-6">
                            Escolha um dos nossos criadores especializados para começar o seu projeto com as dimensões corretas para impressão.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {creatorServices.map(service => (
                                <button 
                                    key={service.id}
                                    onClick={() => onNavigateToService(service.id)} 
                                    className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-xl hover:border-blue-500 hover:bg-white transition-all duration-300 transform hover:-translate-y-1 text-left flex items-start gap-4"
                                >
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900">{service.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </Accordion>
            </div>
        </div>
    );
};

export default DocumentGenerator;