import React, { useState, useCallback, ChangeEvent, useRef } from 'react';
import type { ResumeData, Experience, Education } from '../types';
import { Template } from '../types';
import { getResumeSuggestion } from '../services/geminiService';
import { ModernTemplate } from './templates/ModernTemplate';
import { ClassicTemplate } from './templates/ClassicTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { ProfessionalTemplate } from './templates/ProfessionalTemplate';
import { useCredits } from '../contexts/CreditContext';
import SheetExporter from './SheetExporter';

// Helper to generate unique IDs
const generateId = () => `id_${Math.random().toString(36).substr(2, 9)}`;

// Initial empty state for the resume
const initialResumeData: ResumeData = {
  profilePicture: null,
  fullName: 'João Silva',
  jobTitle: 'Desenvolvedor Web Full-Stack',
  email: 'joao.silva@email.com',
  phone: '+244 9XX XXX XXX',
  location: 'Luanda, Angola',
  linkedin: 'linkedin.com/in/joaosilva',
  portfolio: 'github.com/joaosilva',
  summary: 'Desenvolvedor web full-stack com mais de 5 anos de experiência na criação de aplicações web robustas e escaláveis. Proficiente em React, Node.js e tecnologias de nuvem. Apaixonado por resolver problemas complexos e criar interfaces de utilizador intuitivas.',
  skills: ['React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Docker', 'AWS', 'SQL'],
  experience: [
    { id: generateId(), jobTitle: 'Desenvolvedor Web Sênior', company: 'Tech Angola', location: 'Luanda', startDate: 'Jan 2021', endDate: 'Presente', description: 'Liderei o desenvolvimento do front-end para uma nova plataforma de e-commerce, resultando em um aumento de 20% na conversão. Mentorei desenvolvedores juniores e melhorei a qualidade do código através de revisões e testes automatizados.' },
    { id: generateId(), jobTitle: 'Desenvolvedor Full-Stack', company: 'Startup Inovadora', location: 'Home Office', startDate: 'Jun 2018', endDate: 'Dez 2020', description: 'Desenvolvi e mantive APIs RESTful para a aplicação principal. Colaborei com designers para implementar interfaces responsivas e amigáveis.' },
  ],
  education: [
    { id: generateId(), institution: 'Universidade Agostinho Neto', degree: 'Licenciatura', fieldOfStudy: 'Engenharia Informática', startDate: 'Set 2014', endDate: 'Jul 2018' },
  ],
};

// Icons defined as components for reusability
const SparklesIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12m13 1.293l2.293 2.293a1 1 0 010 1.414L16 20l-2.293 2.293a1 1 0 01-1.414 0L10 20M5 7h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" /></svg>
);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
);
const PrintIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>);
const PlusIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
);
const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
);
const SheetIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);

const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


// UI Components
const Input: React.FC<{label: string, name: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void, placeholder?: string, type?: string, error?: string}> = ({ label, name, value, onChange, placeholder, type = 'text', error }) => (
    <div className="mb-3 lg:mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 border rounded-md shadow-sm transition duration-150 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);
const TextArea: React.FC<{label: string, name: string, value: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, placeholder?: string, rows?: number, onAISuggest?: () => void, error?: string}> = ({ label, name, value, onChange, placeholder, rows = 4, onAISuggest, error }) => (
    <div className="mb-3 lg:mb-4">
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            {onAISuggest && (
                <button onClick={onAISuggest} type="button" className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-semibold transition duration-150">
                    <SparklesIcon className="w-4 h-4 mr-1" /> Sugestão da IA
                </button>
            )}
        </div>
        <textarea id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} rows={rows} className={`w-full px-3 py-2 border rounded-md shadow-sm transition duration-150 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);

const Accordion: React.FC<{ title: string, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-gray-200 rounded-md mb-2">
            <button
                type="button"
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <ChevronDownIcon className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                <div className="overflow-hidden bg-white">
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main Component
const ResumeBuilder: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
    const [template, setTemplate] = useState<Template>(Template.Modern);
    const [isGenerating, setIsGenerating] = useState(false);
    const [downloadingFormat, setDownloadingFormat] = useState<'pdf' | 'jpeg' | 'print' | null>(null);
    const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
    const [isSheetExporterOpen, setIsSheetExporterOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ResumeData, string>>>({});
    const [suggestion, setSuggestion] = useState<{
        title: string;
        content: string;
        field: keyof ResumeData;
        index?: number;
        subField?: keyof Experience | keyof Education;
    } | null>(null);
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const { requestServiceUse } = useCredits();
    const SERVICE_ID = 'resume';


    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof ResumeData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    const handleNestedChange = <T,>(section: keyof ResumeData, index: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setResumeData(prev => {
            const newSection = [...(prev[section] as unknown as T[])];
            newSection[index] = { ...newSection[index], [name]: value };
            return { ...prev, [section]: newSection };
        });
    };

    const handleAddItem = <T,>(section: keyof ResumeData, newItem: T) => {
        setResumeData(prev => ({
            ...prev,
            [section]: [...(prev[section] as unknown as T[]), newItem]
        }));
    };

    const handleRemoveItem = <T extends {id: string}>(section: keyof ResumeData, id: string) => {
        setResumeData(prev => ({
            ...prev,
            [section]: (prev[section] as unknown as T[]).filter(item => item.id !== id)
        }));
    };

    const handleAddExperience = () => {
        handleAddItem<Experience>('experience', { id: generateId(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' });
    };

    const handleAddEducation = () => {
        handleAddItem<Education>('education', { id: generateId(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' });
    };

    const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setResumeData(prev => ({ ...prev, skills: skillsArray }));
    };

    const handleProfilePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setResumeData(prev => ({ ...prev, profilePicture: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleRemoveProfilePicture = () => {
        setResumeData(prev => ({ ...prev, profilePicture: null }));
    };

    const handleAISuggestion = (text: string, context: string, field: keyof ResumeData, index?: number, subField?: keyof Experience) => {
        const performSuggestion = async () => {
            setIsGenerating(true);
            setSuggestion({ title: `Sugestão da IA para ${context}`, content: 'A gerar...', field, index, subField });
            try {
                const result = await getResumeSuggestion(text, context);
                setSuggestion({ title: `Sugestão da IA para ${context}`, content: result, field, index, subField });
            } catch (error) {
                 setSuggestion({ title: `Erro ao gerar Sugestão`, content: 'Ocorreu um erro. Por favor, tente novamente.', field, index, subField });
            } finally {
                setIsGenerating(false);
            }
        };

        requestServiceUse(SERVICE_ID, performSuggestion, { 
            title: 'Usar Sugestão da IA', 
            message: 'Gerar uma sugestão de IA irá descontar <strong>1 crédito</strong>.' 
        });
    };
    
    const applySuggestion = () => {
        if (!suggestion || suggestion.content === 'A gerar...') return;
        
        const { field, index, subField, content } = suggestion;

        if(index !== undefined && subField) {
            setResumeData(prev => {
                const newSection = [...(prev[field] as unknown as any[])];
                newSection[index] = { ...newSection[index], [subField]: content };
                return { ...prev, [field]: newSection };
            });
        } else {
            setResumeData(prev => ({ ...prev, [field]: content as any }));
        }
        setSuggestion(null);
    };

    const validateData = (): boolean => {
        const newErrors: Partial<Record<keyof ResumeData, string>> = {};
        if (!resumeData.fullName.trim()) newErrors.fullName = "O nome completo é obrigatório.";
        if (!resumeData.jobTitle.trim()) newErrors.jobTitle = "O cargo é obrigatório.";
        if (!resumeData.email.trim()) newErrors.email = "O email é obrigatório.";
        if (!resumeData.summary.trim()) newErrors.summary = "O resumo profissional é obrigatório.";

        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            alert('Por favor, preencha todos os campos obrigatórios antes de continuar.');
            return false;
        }
        return true;
    };


    const handleDownloadPdf = () => {
        if (!validateData()) return;
        const performDownload = async () => {
            const { jsPDF } = (window as any).jspdf;
            const html2canvas = (window as any).html2canvas;
            const content = resumePreviewRef.current;
            if (!content) return;

            setDownloadingFormat('pdf');

            try {
                const canvas = await html2canvas(content, {
                    scale: 4,
                    useCORS: true 
                });
                const imgData = canvas.toDataURL('image/png');

                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${resumeData.fullName.replace(' ', '_')}_CV.pdf`);
            } catch (error) {
                console.error("Error generating PDF:", error);
                alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
            } finally {
                setDownloadingFormat(null);
            }
        };

        requestServiceUse(SERVICE_ID, performDownload, {
            title: 'Confirmar Download',
            message: 'Ao baixar este PDF irá descontar <strong>1 crédito</strong> do seu saldo.'
        });
    };

    const handleDownloadImage = (format: 'jpeg') => {
        if (!validateData()) return;
        const performDownload = async () => {
            const html2canvas = (window as any).html2canvas;
            const content = resumePreviewRef.current;
            if (!content) return;

            setDownloadingFormat('jpeg');

            try {
                const canvas = await html2canvas(content, { 
                    scale: 4,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                
                const imgData = canvas.toDataURL('image/jpeg', 1.0);

                const link = document.createElement('a');
                link.href = imgData;
                link.download = `${resumeData.fullName.replace(' ', '_')}_CV.jpeg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } catch (error) {
                console.error("Error generating JPEG:", error);
                alert("Ocorreu um erro ao gerar a imagem. Por favor, tente novamente.");
            } finally {
                setDownloadingFormat(null);
            }
        };

        requestServiceUse(SERVICE_ID, performDownload, {
            title: 'Confirmar Download',
            message: 'Ao baixar esta imagem irá descontar <strong>1 crédito</strong> do seu saldo.'
        });
    };

    const handlePrint = () => {
        if (!validateData()) return;
        const performPrint = () => {
            const content = resumePreviewRef.current;
            if (!content) {
                alert("Não foi possível encontrar o conteúdo para impressão.");
                return;
            }
            setDownloadingFormat('print');

            const oldIframe = document.getElementById('resume-print-iframe');
            if (oldIframe) oldIframe.remove();

            const iframe = document.createElement('iframe');
            iframe.id = 'resume-print-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);

            const htmlContent = `
                <html>
                    <head>
                        <title>${resumeData.fullName} CV</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Lora:ital,wght@0,400;1,400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
                        <style>
                            @page { size: A4 portrait; margin: 0; }
                            body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        </style>
                    </head>
                    <body>
                        ${content.innerHTML}
                    </body>
                </html>
            `;
            
            iframe.srcdoc = htmlContent;

            iframe.onload = () => {
                // Wait for external resources like fonts and especially for the Tailwind JIT to run.
                setTimeout(() => {
                    try {
                        iframe.contentWindow?.focus();
                        iframe.contentWindow?.print();
                    } catch (e) {
                        console.error("Print failed:", e);
                        alert("Ocorreu um erro ao tentar imprimir.");
                    } finally {
                        setDownloadingFormat(null);
                    }
                }, 1000); // Give it a second to be safe
            };
        };

        requestServiceUse(SERVICE_ID, performPrint, {
            title: 'Confirmar Impressão',
            message: 'Imprimir este currículo irá descontar <strong>1 crédito</strong> do seu saldo.'
        });
    };

    const renderPreviewContent = () => (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div>
                    <span className="font-semibold mr-3">Modelo:</span>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button onClick={() => setTemplate(Template.Modern)} className={`px-4 py-2 text-sm font-medium border ${template === Template.Modern ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200'} rounded-l-lg`}>Moderno</button>
                        <button onClick={() => setTemplate(Template.Classic)} className={`px-4 py-2 text-sm font-medium border-t border-b ${template === Template.Classic ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200'}`}>Clássico</button>
                        <button onClick={() => setTemplate(Template.Creative)} className={`px-4 py-2 text-sm font-medium border-t border-b border-l ${template === Template.Creative ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200'}`}>Criativo</button>
                        <button onClick={() => setTemplate(Template.Professional)} className={`px-4 py-2 text-sm font-medium border ${template === Template.Professional ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200'} rounded-r-md`}>Profissional</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full sm:w-auto">
                    <button 
                        onClick={handlePrint} 
                        disabled={!!downloadingFormat} 
                        className="flex items-center justify-center w-full bg-gray-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-wait transition"
                    >
                        {downloadingFormat === 'print' ? <SpinnerIcon className="w-5 h-5 mr-1.5" /> : <PrintIcon className="w-5 h-5 mr-1.5" />}
                        {downloadingFormat === 'print' ? 'A preparar...' : 'Imprimir'}
                    </button>
                    <button 
                        onClick={handleDownloadPdf} 
                        disabled={!!downloadingFormat} 
                        className="flex items-center justify-center w-full bg-red-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-wait transition"
                    >
                        {downloadingFormat === 'pdf' ? <SpinnerIcon className="w-5 h-5 mr-1.5" /> : <DownloadIcon className="w-5 h-5 mr-1.5" />}
                        {downloadingFormat === 'pdf' ? 'A gerar...' : 'Baixar PDF'}
                    </button>
                    <button 
                        onClick={() => handleDownloadImage('jpeg')} 
                        disabled={!!downloadingFormat} 
                        className="flex items-center justify-center w-full bg-blue-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-wait transition"
                    >
                         {downloadingFormat === 'jpeg' ? <SpinnerIcon className="w-5 h-5 mr-1.5" /> : <DownloadIcon className="w-5 h-5 mr-1.5" />}
                        {downloadingFormat === 'jpeg' ? 'A gerar...' : 'Baixar JPEG'}
                    </button>
                    <button 
                        onClick={() => setIsSheetExporterOpen(true)}
                        disabled={!!downloadingFormat} 
                        className="flex items-center justify-center w-full bg-indigo-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-wait transition"
                    >
                        <SheetIcon className="w-5 h-5 mr-1.5" />
                        Exportar Folha
                    </button>
                </div>
            </div>

            <div ref={resumePreviewRef} className="bg-white shadow-2xl p-2 rounded-lg aspect-[210/297] w-full overflow-hidden">
                {template === Template.Modern && <ModernTemplate data={resumeData} />}
                {template === Template.Classic && <ClassicTemplate data={resumeData} />}
                {template === Template.Creative && <CreativeTemplate data={resumeData} />}
                {template === Template.Professional && <ProfessionalTemplate data={resumeData} />}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-gray-100">
             <SheetExporter
                isOpen={isSheetExporterOpen}
                onClose={() => setIsSheetExporterOpen(false)}
                elementToExportRef={resumePreviewRef}
                aspectRatio={210 / 297}
                baseFileName={`${resumeData.fullName}_CV`}
                serviceId={SERVICE_ID}
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
                {/* Form Panel */}
                <div className={`w-full lg:w-1/2 overflow-y-auto ${activeTab === 'editor' ? 'block' : 'hidden'} lg:block`}>
                    <div className="p-4 lg:p-8">
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-bold mb-6 text-gray-800">Construa o Seu Currículo</h2>

                            <Accordion title="Dados Pessoais" defaultOpen={true}>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <Input label="Nome Completo" name="fullName" value={resumeData.fullName} onChange={handleInputChange} error={errors.fullName} />
                                    <Input label="Cargo" name="jobTitle" value={resumeData.jobTitle} onChange={handleInputChange} error={errors.jobTitle} />
                                    <Input label="Email" name="email" value={resumeData.email} onChange={handleInputChange} type="email" error={errors.email} />
                                    <Input label="Nº de Telemóvel" name="phone" value={resumeData.phone} onChange={handleInputChange} />
                                    <Input label="Localização" name="location" value={resumeData.location} onChange={handleInputChange} />
                                    <Input label="Perfil LinkedIn" name="linkedin" value={resumeData.linkedin} onChange={handleInputChange} />
                                    <Input label="Portfólio/GitHub" name="portfolio" value={resumeData.portfolio} onChange={handleInputChange} />
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil (Opcional)</label>
                                    {!resumeData.profilePicture ? (
                                        <label className="w-full flex items-center justify-center p-3 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                                        <UploadIcon className="w-5 h-5 mr-2" /> Carregar Foto
                                        <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                                        </label>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            <img src={resumeData.profilePicture} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
                                            <button onClick={handleRemoveProfilePicture} className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition">
                                            <TrashIcon className="w-4 h-4 mr-1.5" /> Remover Foto
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </Accordion>

                            <Accordion title="Resumo Profissional">
                            <TextArea label="Resumo" name="summary" value={resumeData.summary} onChange={handleInputChange} onAISuggest={() => handleAISuggestion(resumeData.summary, 'Resumo Profissional', 'summary')} error={errors.summary} />
                            </Accordion>

                            <Accordion title="Competências">
                                <Input label="Competências (separadas por vírgula)" name="skills" value={resumeData.skills.join(', ')} onChange={handleSkillsChange} placeholder="ex: React, Node.js, Liderança"/>
                            </Accordion>
                            
                            <Accordion title="Experiência Profissional">
                                {errors.experience && <p className="text-red-600 text-sm mb-2 p-2 bg-red-50 rounded-md">{errors.experience}</p>}
                                {resumeData.experience.map((exp, index) => (
                                    <div key={exp.id} className="p-4 mb-4 border rounded-md relative">
                                        <button onClick={() => handleRemoveItem('experience', exp.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                        <Input label="Cargo" name="jobTitle" value={exp.jobTitle} onChange={(e) => handleNestedChange<Experience>('experience', index, e)} />
                                        <Input label="Empresa" name="company" value={exp.company} onChange={(e) => handleNestedChange<Experience>('experience', index, e)} />
                                        <Input label="Localização" name="location" value={exp.location} onChange={(e) => handleNestedChange<Experience>('experience', index, e)} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Data de Início" name="startDate" value={exp.startDate} onChange={(e) => handleNestedChange<Experience>('experience', index, e)} />
                                            <Input label="Data de Fim" name="endDate" value={exp.endDate} onChange={(e) => handleNestedChange<Experience>('experience', index, e)} />
                                        </div>
                                        <TextArea 
                                            label="Descrição" 
                                            name="description" 
                                            value={exp.description} 
                                            onChange={(e) => handleNestedChange<Experience>('experience', index, e)}
                                            onAISuggest={() => handleAISuggestion(exp.description, `Descrição do cargo em ${exp.company || 'empresa'}`, 'experience', index, 'description')}
                                        />
                                    </div>
                                ))}
                                <button onClick={handleAddExperience} className="w-full flex items-center justify-center p-2 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition">
                                <PlusIcon className="w-5 h-5 mr-2" /> Adicionar Experiência
                                </button>
                            </Accordion>
                            
                            <Accordion title="Formação Académica">
                                {errors.education && <p className="text-red-600 text-sm mb-2 p-2 bg-red-50 rounded-md">{errors.education}</p>}
                                {resumeData.education.map((edu, index) => (
                                    <div key={edu.id} className="p-4 mb-4 border rounded-md relative">
                                        <button onClick={() => handleRemoveItem('education', edu.id)} className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"><TrashIcon className="w-5 h-5"/></button>
                                        <Input label="Instituição" name="institution" value={edu.institution} onChange={(e) => handleNestedChange<Education>('education', index, e)} />
                                        <Input label="Grau" name="degree" value={edu.degree} onChange={(e) => handleNestedChange<Education>('education', index, e)} />
                                        <Input label="Área de Estudo" name="fieldOfStudy" value={edu.fieldOfStudy} onChange={(e) => handleNestedChange<Education>('education', index, e)} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input label="Data de Início" name="startDate" value={edu.startDate} onChange={(e) => handleNestedChange<Education>('education', index, e)} />
                                            <Input label="Data de Fim" name="endDate" value={edu.endDate} onChange={(e) => handleNestedChange<Education>('education', index, e)} />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={handleAddEducation} className="w-full flex items-center justify-center p-2 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition">
                                    <PlusIcon className="w-5 h-5 mr-2" /> Adicionar Formação
                                </button>
                            </Accordion>
                        </div>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className={`w-full lg:w-1/2 flex-col items-center p-4 lg:p-8 overflow-y-auto ${activeTab === 'preview' ? 'flex' : 'hidden'} lg:flex`}>
                    <div className="w-full max-w-2xl lg:sticky lg:top-8">
                        {renderPreviewContent()}
                    </div>
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            <button
                onClick={() => setActiveTab('preview')}
                className={`lg:hidden ${activeTab === 'editor' ? 'fixed' : 'hidden'} bottom-6 right-6 z-30 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105`}
                aria-label="Abrir painel de pré-visualização e download do currículo"
            >
                Pré-visualizar / Baixar
            </button>

            {/* AI Suggestion Modal */}
            {suggestion && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-4">{suggestion.title}</h3>
                            <div className="bg-gray-100 p-4 rounded-md max-h-64 overflow-y-auto text-gray-700 whitespace-pre-wrap">
                                {suggestion.content}
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                            <button onClick={() => setSuggestion(null)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Fechar</button>
                            {!isGenerating && suggestion.content !== "A gerar..." && (
                                <button onClick={applySuggestion} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Aplicar Sugestão</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeBuilder;