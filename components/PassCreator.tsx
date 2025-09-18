import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useCredits } from '../contexts/CreditContext';
import SheetExporter from './SheetExporter';

// --- ICONS ---
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const PortraitIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M12 21h.01M12 6h.01M12 3h.01" /></svg>);
const LandscapeIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v4m0 0h-4m4 0l-5-5" /></svg>);
const SheetIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);

// --- DATA TYPES ---
interface PassData {
  profileImage: string | null;
  name: string;
  role: string;
  eventOrInstitution: string;
  idNumber: string;
  validity: string;
}

type Orientation = 'portrait' | 'landscape';

interface TemplateProps {
  data: PassData;
  colors: { background: string; primary: string; text: string; };
  qrCodeUrl: string;
  orientation: Orientation;
}

// --- TEMPLATE COMPONENTS ---
const StudentTemplate: React.FC<TemplateProps> = ({ data, colors, qrCodeUrl, orientation }) => (
    // FIX: Refactor for responsive layout using flexbox
    <div className={`w-full h-full flex text-sm p-3 ${orientation === 'portrait' ? 'flex-col' : 'flex-row items-center gap-3'}`} style={{ backgroundColor: 'transparent' }}>
        <header className={`p-3 text-center text-white flex-shrink-0 ${orientation === 'portrait' ? 'w-full' : 'w-1/3 h-full flex flex-col justify-center'}`} style={{ backgroundColor: colors.primary }}>
            <h1 className="font-bold text-lg uppercase">{data.eventOrInstitution || "Instituição"}</h1>
        </header>
        <div className={`flex-1 flex items-center ${orientation === 'portrait' ? 'flex-col' : 'flex-row gap-4'}`} style={{ color: colors.text }}>
            <img src={data.profileImage || 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200'} alt="Foto de Perfil" className={`${orientation === 'portrait' ? 'w-24 h-24 mt-3' : 'w-20 h-20'} rounded-full object-cover border-4 flex-shrink-0`} style={{ borderColor: colors.primary }} />
            <div className={`flex-1 flex flex-col h-full ${orientation === 'portrait' ? 'text-center items-center mt-3' : 'justify-between'}`}>
                <div className={`${orientation === 'landscape' ? 'text-left' : ''}`}>
                    <p className={`font-bold text-xl`}>{data.name || "Nome do Estudante"}</p>
                    <p className={`text-base`} style={{ color: colors.primary }}>{data.role || "Curso / Classe"}</p>
                    <p className={`mt-2 text-gray-500 text-sm`}>ID: {data.idNumber || "N/A"}</p>
                </div>
                <div className={`mt-auto ${orientation === 'landscape' ? 'text-left' : ''}`}>
                    <p className="text-xs text-gray-500">Válido até: {data.validity || "DD/MM/AAAA"}</p>
                </div>
            </div>
             {orientation === 'landscape' && qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16 self-end" />}
        </div>
        {orientation === 'portrait' && (
            <footer className="p-2 bg-gray-100 flex justify-center mt-auto">
                {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />}
            </footer>
        )}
    </div>
);

const VisitorTemplate: React.FC<TemplateProps> = ({ data, colors, qrCodeUrl, orientation }) => (
    // FIX: Refactor for responsive layout using flexbox
    <div className={`w-full h-full flex ${orientation === 'portrait' ? 'flex-col' : 'flex-row'}`} style={{ backgroundColor: 'transparent', color: colors.text }}>
        <div className={`flex flex-col items-center justify-center text-white p-2 ${orientation === 'portrait' ? 'w-full h-1/4' : 'w-1/4 h-full'}`} style={{ backgroundColor: colors.primary }}>
            <span className={`font-extrabold text-2xl uppercase ${orientation === 'landscape' ? 'transform -rotate-90' : ''}`} style={orientation === 'landscape' ? { writingMode: 'vertical-lr' } : {}} >VISITANTE</span>
        </div>
        <div className={`w-full flex-1 flex flex-col p-3 ${orientation === 'landscape' ? 'justify-between' : ''}`}>
            <div className={`flex ${orientation === 'portrait' ? 'flex-col items-center' : 'flex-row items-start gap-3'}`}>
                <img src={data.profileImage || 'https://via.placeholder.com/100'} alt="Foto de Perfil" className="w-20 h-20 rounded-md object-cover flex-shrink-0 border-4" style={{ borderColor: colors.primary }} />
                <div className={`flex-1 mt-3 ${orientation === 'portrait' ? 'text-center' : 'text-left'}`}>
                    <p className="font-bold text-xl">{data.name || "Nome do Visitante"}</p>
                    <p className="text-base">{data.role || "Empresa / Motivo"}</p>
                    <p className="font-semibold text-base mt-2" style={{ color: colors.primary }}>{data.eventOrInstitution || "Local a Visitar"}</p>
                </div>
            </div>
            <div className="flex justify-between items-end mt-3">
                <div className="text-xs">
                    <p className="font-bold">Validade:</p>
                    <p>{data.validity || "DD/MM/AAAA"}</p>
                </div>
                {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />}
            </div>
        </div>
    </div>
);

const EventStaffTemplate: React.FC<TemplateProps> = ({ data, colors, orientation }) => (
    // FIX: Refactor for responsive layout using flexbox
    <div className={`w-full h-full flex text-sm ${orientation === 'portrait' ? 'flex-col' : 'flex-row'}`} style={{ backgroundColor: 'transparent' }}>
        {orientation === 'landscape' && (
            <div className="w-2/5 flex items-center justify-center p-2">
                <img src={data.profileImage || 'https://images.unsplash.com/photo-1613940102159-192a8323f3e2?w=200'} alt="Foto de Perfil" className="w-full h-full object-cover border-4" style={{ borderColor: colors.primary }} />
            </div>
        )}
        <div className={`flex flex-col flex-1 ${orientation === 'landscape' ? 'w-3/5' : ''}`}>
            <header className="p-3 text-center" style={{ backgroundColor: colors.primary, color: getTextColorForBackground(colors.primary) }}>
                <h1 className="font-bold text-lg uppercase">{data.eventOrInstitution || "Nome do Evento"}</h1>
            </header>
            <div className="flex-1 p-3 flex flex-col items-center justify-center text-center" style={{color: colors.text}}>
                {orientation === 'portrait' && <img src={data.profileImage || 'https://images.unsplash.com/photo-1613940102159-192a8323f3e2?w=200'} alt="Foto de Perfil" className="w-28 h-28 object-cover border-4" style={{ borderColor: colors.primary }} />}
                <p className={`font-bold mt-3 ${orientation === 'portrait' ? 'text-2xl' : 'text-xl'}`}>{data.name || "Nome do Membro"}</p>
            </div>
            <footer className="p-2 text-center text-white font-extrabold uppercase" style={{ backgroundColor: colors.primary, color: getTextColorForBackground(colors.primary) }}>
                <p className={`${orientation === 'portrait' ? 'text-2xl' : 'text-xl'}`}>{data.role || "Função (Ex: Staff)"}</p>
            </footer>
        </div>
    </div>
);


const VipTemplate: React.FC<TemplateProps> = ({ data, colors, orientation }) => (
    // FIX: Refactor for responsive layout using flexbox
    <div className={`w-full h-full flex p-3 ${orientation === 'portrait' ? 'flex-col justify-between' : 'flex-row items-center gap-4'}`} style={{ backgroundColor: 'transparent', color: colors.text }}>
        <div className={`flex flex-col flex-1 h-full ${orientation === 'portrait' ? 'w-full justify-between' : 'w-2/3 justify-between'}`}>
            <header className="flex justify-between items-start">
                <h1 className="font-semibold text-base">{data.eventOrInstitution || "Nome do Evento"}</h1>
                <span className="font-extrabold text-2xl" style={{color: colors.primary}}>VIP</span>
            </header>
            <div className={`${orientation === 'portrait' ? 'text-center my-4' : 'text-left'}`}>
                <p className="font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif"}}>{data.name || "Nome do Convidado"}</p>
                <p className="text-md">{data.role || "Convidado Especial"}</p>
            </div>
            <footer className={`text-xs ${orientation === 'portrait' ? 'flex justify-between items-end' : 'text-left'}`}>
                <p>Acesso Total</p>
                <p>{data.validity || "Válido para o evento"}</p>
            </footer>
        </div>
        <div className={`flex-shrink-0 flex items-center justify-center ${orientation === 'portrait' ? 'w-full' : 'w-1/3'}`}>
            <img src={data.profileImage || 'https://via.placeholder.com/150'} alt="Foto de Perfil" className={`rounded-full object-cover border-4 ${orientation === 'portrait' ? 'w-20 h-20' : 'w-24 h-24'}`} style={{ borderColor: colors.primary }} />
        </div>
    </div>
);


const CorporateTemplate: React.FC<TemplateProps> = ({ data, colors, qrCodeUrl, orientation }) => (
    // FIX: Refactor for responsive layout using flexbox
    <div className={`w-full h-full flex ${orientation === 'portrait' ? 'flex-col' : 'flex-row'}`} style={{ backgroundColor: 'transparent', color: colors.text }}>
        <div className={`flex-shrink-0 ${orientation === 'portrait' ? 'h-1/3' : 'w-1/3'} flex items-center justify-center`} style={{backgroundColor: colors.primary}}>
             <img src={data.profileImage || 'https://via.placeholder.com/200x150'} alt="Foto de Perfil" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between">
            <h2 className="font-bold text-lg uppercase" style={{color: colors.primary}}>{data.eventOrInstitution || "Nome da Empresa"}</h2>
            <div>
                <p className="font-extrabold text-xl">{data.name || "Nome do Colaborador"}</p>
                <p className="font-semibold text-base">{data.role || "Cargo"}</p>
            </div>
            <div className="flex justify-between items-end mt-3">
                <div className="text-xs">
                    <p>ID: {data.idNumber || "00000"}</p>
                    <p>Validade: {data.validity || "Indeterminada"}</p>
                </div>
                 {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-16 h-16" />}
            </div>
        </div>
    </div>
);

const ConferenceTemplate: React.FC<TemplateProps> = ({ data, colors, qrCodeUrl, orientation }) => (
    // FIX: Refactor for responsive layout using flexbox
    <div className={`w-full h-full flex ${orientation === 'portrait' ? 'flex-col' : 'flex-row'}`} style={{ backgroundColor: 'transparent', color: colors.text }}>
        <div className={`flex flex-col flex-1 ${orientation === 'portrait' ? '' : 'w-3/5'}`}>
            <header className="p-2 text-center">
                <h1 className="font-bold text-lg uppercase">{data.eventOrInstitution || "Nome da Conferência"}</h1>
            </header>
            <div className="flex-1 flex flex-col p-3 items-center justify-center text-center">
                <p className="font-bold text-xl">{data.name || "Nome do Participante"}</p>
                <p className="text-sm text-gray-600">{data.idNumber || "Empresa / Organização"}</p>
            </div>
             <footer className="p-2 text-center text-white text-lg font-bold uppercase" style={{ backgroundColor: colors.primary }}>
                {data.role || "PARTICIPANTE"}
            </footer>
        </div>
        <div className={`${orientation === 'portrait' ? 'p-3 flex-row' : 'w-2/5 flex-col bg-gray-100'} flex items-center justify-center gap-3`}>
            <img src={data.profileImage || 'https://via.placeholder.com/150'} alt="Foto de Perfil" className="w-24 h-24 rounded-full object-cover border-4" style={{ borderColor: colors.primary }} />
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-20 h-20" />}
        </div>
    </div>
);


const getTextColorForBackground = (hexColor: string): string => {
    try {
        if (!hexColor || hexColor.length < 7) return '#111827';
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
        return (brightness > 125) ? '#111827' : '#FFFFFF';
    } catch (e) {
        return '#111827';
    }
};

// --- CONFIGURATION ---
const templates = [
    { id: 'student', name: 'Estudante', component: StudentTemplate, defaultData: { profileImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200', name: 'Ana Silva', role: 'Engenharia Informática', eventOrInstitution: 'Universidade A. Neto', idNumber: '2024-1987', validity: '31/12/2024' }, colors: { background: '#FFFFFF', primary: '#0ea5e9', text: '#1f2937' }},
    { id: 'visitor', name: 'Visitante', component: VisitorTemplate, defaultData: { profileImage: null, name: 'João Baptista', role: 'Tupuca Lda', eventOrInstitution: 'Edifício One Metrópolis', idNumber: '', validity: '25/12/2024' }, colors: { background: '#F9FAFB', primary: '#f97316', text: '#111827' }},
    { id: 'staff', name: 'Staff de Evento', component: EventStaffTemplate, defaultData: { profileImage: 'https://images.unsplash.com/photo-1613940102159-192a8323f3e2?w=200', name: 'Mário Jorge', role: 'Segurança', eventOrInstitution: 'Show Unitel', idNumber: 'S-012', validity: '25/12/2024' }, colors: { background: '#FFFFFF', primary: '#facc15', text: '#000000' }},
    { id: 'vip', name: 'VIP', component: VipTemplate, defaultData: { profileImage: null, name: 'Lurdes Miguel', role: 'Convidada de Honra', eventOrInstitution: 'Gala de Prémios', idNumber: 'VIP-001', validity: '25/12/2024' }, colors: { background: '#FDFBF7', primary: '#d4af37', text: '#44403C' }},
    { id: 'corporate', name: 'Corporativo', component: CorporateTemplate, defaultData: { profileImage: null, name: 'Carlos Ferreira', role: 'Gestor de Projetos', eventOrInstitution: 'Angola Cables', idNumber: 'EMP-087', validity: '31/12/2025' }, colors: { background: '#FFFFFF', primary: '#047857', text: '#1f2937' }},
    { id: 'conference', name: 'Conferência', component: ConferenceTemplate, defaultData: { profileImage: null, name: 'Sofia Pereira', role: 'ORADOR', eventOrInstitution: 'AngoTIC 2024', idNumber: 'Startup Inova', validity: '20-22/10/2024' }, colors: { background: '#f3f4f6', primary: '#4f46e5', text: '#111827' }},
];
const patterns = [
    { id: 'none', name: 'Nenhum', style: 'none' },
    { id: 'dots', name: 'Pontos', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMSIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==')` },
    { id: 'lines', name: 'Linhas', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTEsMSAyLC0yIE0wLDEwIDEwLDAgTTksMTEgMTIsOCIKICAgICAgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')` },
    { id: 'grid', name: 'Grelha', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZGVmcz4gCiAgICAgICAgPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMCIgaGVpZHRoPSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4CiAgICAgICAgPC9wYXR0ZXJuPgogICAgPC9kZWZzPgogICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')` },
];

const PASS_WIDTH_MM = 86;
const PASS_HEIGHT_MM = 54;

const TemplateWrapper: React.FC<{ backgroundColor: string; patternUrl: string | null; uploadedImage: string | null; opacity: number; children: React.ReactNode; }> = 
({ backgroundColor, patternUrl, uploadedImage, opacity, children }) => {
    return (
        <div style={{ backgroundColor, position: 'relative', width: '100%', height: '100%' }}>
            {(patternUrl && patternUrl !== 'none') && <div style={{ position: 'absolute', inset: 0, backgroundImage: patternUrl, opacity, pointerEvents: 'none' }} />}
            {uploadedImage && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${uploadedImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity, pointerEvents: 'none' }} />}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>{children}</div>
        </div>
    );
};

// --- MAIN COMPONENT ---
const PassCreator: React.FC = () => {
    const [activeTemplate, setActiveTemplate] = useState(templates[0]);
    const [data, setData] = useState<PassData>(templates[0].defaultData);
    const [colors, setColors] = useState(templates[0].colors);
    const [orientation, setOrientation] = useState<Orientation>('portrait');
    const [isDownloading, setIsDownloading] = useState(false);
    const [activePatternId, setActivePatternId] = useState<string>('none');
    const [uploadedBgImage, setUploadedBgImage] = useState<string | null>(null);
    const [backgroundOpacity, setBackgroundOpacity] = useState<number>(0.1);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [miniPreviewDismissed, setMiniPreviewDismissed] = useState(false);
    const [isSheetExporterOpen, setIsSheetExporterOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof PassData, string>>>({});
    const previewRef = useRef<HTMLDivElement>(null);
    
    const { requestServiceUse } = useCredits();
    const SERVICE_ID = 'pass';

    const qrCodeUrl = useMemo(() => {
        const qrData = JSON.stringify({ name: data.name, id: data.idNumber, entity: data.eventOrInstitution });
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
    }, [data.name, data.idNumber, data.eventOrInstitution]);

    const handleTemplateChange = (templateId: string) => {
        const newTemplate = templates.find(t => t.id === templateId) || templates[0];
        setActiveTemplate(newTemplate);
        setData(newTemplate.defaultData);
        setColors(newTemplate.colors);
        setActivePatternId('none');
        setUploadedBgImage(null);
        setMiniPreviewDismissed(false);
        setErrors({});
    };

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof PassData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setColors(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setData(prev => ({ ...prev, profileImage: reader.result as string })); };
            reader.readAsDataURL(file);
        }
    };
    
    const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedBgImage(reader.result as string);
                setActivePatternId('none');
            };
            reader.readAsDataURL(file);
        }
    };

    const validateData = (): boolean => {
        const newErrors: Partial<Record<keyof PassData, string>> = {};
        if (!data.name.trim()) newErrors.name = "O nome é obrigatório.";
        if (!data.role.trim()) newErrors.role = "A função/cargo é obrigatória.";
        if (!data.eventOrInstitution.trim()) newErrors.eventOrInstitution = "O evento/instituição é obrigatório.";

        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            alert('Por favor, preencha os campos obrigatórios (Nome, Função, Evento).');
            return false;
        }
        return true;
    };

    const exportAs = async (format: 'png' | 'pdf') => {
        if (!validateData()) return;
        const performExport = async () => {
            const { jsPDF } = (window as any).jspdf;
            const html2canvas = (window as any).html2canvas;
            const content = previewRef.current;
            if (!content) return;

            setIsDownloading(true);
            const canvas = await html2canvas(content, { scale: 4, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const fileName = `${data.name.replace(/\s+/g, '_')}_passe`;

            if (format === 'png') {
                const link = document.createElement('a');
                link.href = imgData;
                link.download = `${fileName}.png`;
                link.click();
            } else {
                const pdf = new jsPDF({ 
                    orientation: orientation, 
                    unit: 'mm', 
                    format: [PASS_WIDTH_MM, PASS_HEIGHT_MM] 
                });
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${fileName}.pdf`);
            }
            setIsDownloading(false);
        };
        requestServiceUse(SERVICE_ID, performExport, {
            title: 'Confirmar Exportação',
            message: `Exportar este passe como ${format.toUpperCase()} irá descontar <strong>1 crédito</strong>.`
        });
    };

    const TemplateComponent = activeTemplate.component;
    const activePatternUrl = patterns.find(p => p.id === activePatternId)?.style || null;

    const { itemWidth, itemHeight, finalAspectRatio } = useMemo(() => {
        const itemW = orientation === 'portrait' ? PASS_HEIGHT_MM : PASS_WIDTH_MM;
        const itemH = orientation === 'portrait' ? PASS_WIDTH_MM : PASS_HEIGHT_MM;
        return {
            itemWidth: itemW,
            itemHeight: itemH,
            finalAspectRatio: itemW / itemH
        };
    }, [orientation]);

    const renderPreviewContent = () => (
         <div className="w-full max-w-sm mx-auto">
            <div className="flex flex-wrap justify-end items-center gap-3 mb-4">
                <button onClick={() => exportAs('png')} disabled={isDownloading} className="flex-1 flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition">
                    <DownloadIcon className="w-5 h-5 mr-2" /> {isDownloading ? 'A baixar...' : 'PNG'}
                </button>
                 <button onClick={() => exportAs('pdf')} disabled={isDownloading} className="flex-1 flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition">
                    <DownloadIcon className="w-5 h-5 mr-2" /> {isDownloading ? 'A baixar...' : 'PDF'}
                </button>
                 <button onClick={() => setIsSheetExporterOpen(true)} disabled={isDownloading} className="w-full flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition">
                    <SheetIcon className="w-5 h-5 mr-2" /> Exportar em Folha
                </button>
            </div>
            <div ref={previewRef} className={`w-full bg-white shadow-2xl rounded-lg overflow-hidden relative transition-all duration-300`} style={{ aspectRatio: `${finalAspectRatio}` }}>
                <TemplateWrapper backgroundColor={colors.background} patternUrl={activePatternUrl} uploadedImage={uploadedBgImage} opacity={backgroundOpacity}>
                   <TemplateComponent data={data} colors={colors} qrCodeUrl={qrCodeUrl} orientation={orientation} />
                </TemplateWrapper>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-full">
            <SheetExporter
                isOpen={isSheetExporterOpen}
                onClose={() => setIsSheetExporterOpen(false)}
                elementToExportRef={previewRef}
                aspectRatio={finalAspectRatio}
                itemWidth_mm={itemWidth}
                itemHeight_mm={itemHeight}
                baseFileName={`${data.name}_passes`}
                serviceId={SERVICE_ID}
                sheetSize={orientation === 'landscape' ? 'A4-landscape' : 'A4'}
            />
            {/* Form Panel */}
            <div className="w-full lg:w-1/3 p-4 lg:p-6 overflow-y-auto bg-white">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">1. Escolha um Modelo</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {templates.map(t => (
                                <button key={t.id} onClick={() => handleTemplateChange(t.id)} className={`p-2 text-sm rounded-md border-2 text-center ${activeTemplate.id === t.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-100'}`}>
                                    {t.name}
                                </button>
                            ))}
                        </div>
                        {activeTemplate.id === 'student' && (
                            <p className="text-xs text-center text-gray-600 mt-2 p-2 bg-blue-50 rounded-md">
                                Para passes de estudante, a orientação <strong>vertical</strong> é a mais recomendada para um melhor enquadramento da informação.
                            </p>
                        )}
                    </div>

                    <div>
                         <h3 className="text-lg font-semibold mb-2">2. Orientação</h3>
                         <div className="flex items-center space-x-2">
                            <button onClick={() => setOrientation('portrait')} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md border-2 transition-colors ${orientation === 'portrait' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="6" y="3" width="12" height="18" rx="2" /></svg>
                                Vertical
                            </button>
                            <button onClick={() => setOrientation('landscape')} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md border-2 transition-colors ${orientation === 'landscape' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:bg-gray-100'}`}>
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="6" width="18" height="12" rx="2" /></svg>
                                Horizontal
                            </button>
                         </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">3. Preencha os Dados</h3>
                        <div className="space-y-3">
                            <Input label="Nome Completo" name="name" value={data.name} onChange={handleInputChange} error={errors.name} />
                            <Input label="Função / Cargo / Curso" name="role" value={data.role} onChange={handleInputChange} error={errors.role} />
                            <Input label="Evento / Instituição" name="eventOrInstitution" value={data.eventOrInstitution} onChange={handleInputChange} error={errors.eventOrInstitution} />
                            <Input label="Nº de ID / Empresa" name="idNumber" value={data.idNumber} onChange={handleInputChange} />
                            <Input label="Validade" name="validity" value={data.validity} onChange={handleInputChange} />
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">4. Adicione uma Foto/Logo</h3>
                        <label className="w-full flex items-center justify-center p-3 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                           <UploadIcon className="w-5 h-5 mr-2" /> Carregar Imagem
                           <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">5. Personalize as Cores</h3>
                        <div className="grid grid-cols-3 gap-3">
                            <ColorInput label="Fundo" name="background" value={colors.background} onChange={handleColorChange} />
                            <ColorInput label="Principal" name="primary" value={colors.primary} onChange={(e) => {
                                const newPrimary = e.target.value;
                                setColors({
                                    ...colors,
                                    primary: newPrimary,
                                    text: getTextColorForBackground(colors.background)
                                });
                            }} />
                             <ColorInput label="Texto" name="text" value={colors.text} onChange={handleColorChange} />
                        </div>
                    </div>
                    <div className="border-t pt-4">
                         <h3 className="text-lg font-semibold mb-2">6. Fundo Personalizado</h3>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Padrões</label>
                                <div className="grid grid-cols-3 gap-2">
                                     {patterns.map(p => (
                                        <button key={p.id} onClick={() => { setActivePatternId(p.id); setUploadedBgImage(null); }} className={`p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${activePatternId === p.id ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200'}`}>
                                            <div className="w-full h-10 rounded-md" style={{backgroundImage: p.style, backgroundColor: '#e5e7eb', opacity: 0.5}}></div>
                                            <span className="block text-xs text-gray-600 mt-1">{p.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-gray-600 mb-2">Imagem de Fundo</label>
                                {!uploadedBgImage ? (
                                    <label className="w-full flex items-center justify-center p-3 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                                       <UploadIcon className="w-5 h-5 mr-2" /> Carregar Imagem
                                       <input type="file" accept="image/*" className="hidden" onChange={handleBgImageUpload} />
                                    </label>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <img src={uploadedBgImage} alt="Preview" className="w-16 h-10 rounded-lg object-cover border" />
                                        <button onClick={() => setUploadedBgImage(null)} className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition">
                                           <TrashIcon className="w-4 h-4 mr-1.5" /> Remover
                                        </button>
                                    </div>
                                )}
                             </div>
                             <div>
                                <label htmlFor="bgOpacity" className="block text-xs font-medium text-gray-600 mb-1">Transparência do Fundo</label>
                                <input type="range" id="bgOpacity" min="0.05" max="1" step="0.05" value={backgroundOpacity} onChange={(e) => setBackgroundOpacity(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Desktop Preview Panel */}
            <div className="hidden lg:flex lg:w-2/3 items-center justify-center p-8 bg-gray-100 overflow-y-auto">
                {renderPreviewContent()}
            </div>
            
            {/* Mini Preview Popup for Mobile */}
            {!isPreviewOpen && !miniPreviewDismissed && (
                <div className={`lg:hidden fixed bottom-20 right-4 z-20 bg-white rounded-lg shadow-2xl border animate-fade-in-up overflow-hidden transition-all duration-300 ${orientation === 'portrait' ? 'w-24' : 'w-40'}`} style={{aspectRatio: `${finalAspectRatio}`}}>
                     <button 
                        onClick={() => setMiniPreviewDismissed(true)} 
                        className="absolute top-1 right-1 z-30 p-1 bg-gray-800 text-white bg-opacity-50 rounded-full hover:bg-opacity-75" 
                        aria-label="Fechar pré-visualização rápida"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                    <div className="h-full w-full pointer-events-none">
                         <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}>
                              <TemplateWrapper backgroundColor={colors.background} patternUrl={activePatternUrl} uploadedImage={uploadedBgImage} opacity={backgroundOpacity}>
                                <TemplateComponent data={data} colors={colors} qrCodeUrl={qrCodeUrl} orientation={orientation} />
                            </TemplateWrapper>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Preview Panel (Sheet) */}
            {isPreviewOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setIsPreviewOpen(false)} aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 right-0 h-[95vh] bg-gray-100 rounded-t-2xl shadow-2xl overflow-y-auto p-4 pt-12 flex flex-col items-center justify-center">
                        <button onClick={() => setIsPreviewOpen(false)} className="absolute top-3 right-3 z-50 p-2 bg-gray-200 rounded-full hover:bg-gray-300" aria-label="Fechar pré-visualização"><CloseIcon className="w-5 h-5 text-gray-700" /></button>
                        {renderPreviewContent()}
                    </div>
                </div>
            )}

            {/* Floating Action Button for Mobile */}
            <button
                onClick={() => setIsPreviewOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-30 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                aria-label="Abrir painel de pré-visualização e download do passe"
            >
                Pré-visualizar / Baixar
            </button>
        </div>
    );
};

// --- HELPER UI COMPONENTS ---
const Input: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error?: string}> = ({ label, name, value, onChange, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);

const ColorInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 text-center">{label}</label>
        <input type="color" id={name} name={name} value={value} onChange={onChange} className="w-full h-10 border-gray-300 rounded-md cursor-pointer" />
    </div>
);

export default PassCreator;