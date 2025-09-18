import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useCredits } from '../contexts/CreditContext';
import SheetExporter from './SheetExporter';

// --- ICONS ---
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const PrintIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>);
const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);
const ShareIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367 2.684z" /></svg>);
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const SheetIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);


// --- DATA TYPES ---
interface InvitationData {
  title: string;
  subtitle: string;
  message: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string | null;
}

interface FontPair {
    id: string;
    name: string;
    title: string;
    body: string;
}

interface TemplateProps {
  data: InvitationData;
  colors: { background: string; text: string; accent: string; };
  font: FontPair;
}

// --- TEMPLATE COMPONENTS ---
const BirthdayTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full flex flex-col justify-between p-8 text-center" style={{ backgroundColor: 'transparent', color: colors.text }}>
        {data.imageUrl && <img src={data.imageUrl} alt="Aniversariante" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4" style={{borderColor: colors.accent}}/>}
        <div>
            <p className="text-lg" style={{ fontFamily: font.body }}>{data.subtitle}</p>
            <h1 className="text-5xl font-bold my-2" style={{ fontFamily: font.title, color: colors.accent }}>{data.title}</h1>
        </div>
        <p className="my-4 text-sm" style={{ fontFamily: font.body }}>{data.message}</p>
        <div className="border-t-2 pt-4" style={{borderColor: colors.accent, fontFamily: font.body}}>
            <p className="font-bold">{data.date} às {data.time}</p>
            <p>{data.location}</p>
        </div>
    </div>
);

const WeddingTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full flex items-center justify-center p-8 text-center" style={{ backgroundColor: 'transparent', color: colors.text }}>
        <div className="z-10">
            <p className="text-sm tracking-widest" style={{ fontFamily: font.body }}>{data.subtitle}</p>
            <h1 className="text-4xl my-4" style={{ fontFamily: font.title, color: colors.accent }}>{data.title}</h1>
            <p className="my-4 text-sm max-w-md mx-auto" style={{ fontFamily: font.body }}>{data.message}</p>
            {data.imageUrl && <img src={data.imageUrl} alt="Noivos" className="w-20 h-20 rounded-full object-cover mx-auto my-4 border-4" style={{borderColor: colors.accent}}/>}
            <div className="mt-6 text-sm" style={{ fontFamily: font.body }}>
                <p className="font-semibold">{data.date} | {data.time}</p>
                <p>{data.location}</p>
            </div>
        </div>
    </div>
);

const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full flex" style={{ backgroundColor: 'transparent', color: colors.text }}>
        <div className="w-1/3" style={{ backgroundColor: data.imageUrl ? undefined : colors.accent }}>
            {data.imageUrl && <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${data.imageUrl})` }}></div>}
        </div>
        <div className="w-2/3 p-8 flex flex-col justify-center">
            <h1 className="text-3xl font-bold" style={{ fontFamily: font.title, color: colors.accent }}>{data.title}</h1>
            <h2 className="text-lg mt-1" style={{ fontFamily: font.body }}>{data.subtitle}</h2>
            <p className="text-sm my-4" style={{ fontFamily: font.body }}>{data.message}</p>
            <div className="border-t-2 pt-4 mt-4 text-sm" style={{borderColor: colors.accent, fontFamily: font.body}}>
                <p><strong>Data:</strong> {data.date}</p>
                <p><strong>Hora:</strong> {data.time}</p>
                <p><strong>Local:</strong> {data.location}</p>
            </div>
        </div>
    </div>
);

const MinimalistTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center" style={{ backgroundColor: 'transparent', color: colors.text, fontFamily: font.body }}>
        {data.imageUrl && <img src={data.imageUrl} alt="Evento" className="w-16 h-16 rounded-full object-cover mx-auto mb-4"/>}
        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: font.title }}>{data.title}</h1>
        <h2 className="text-xl mt-2 mb-6" style={{ color: colors.accent }}>{data.subtitle}</h2>
        <div className="w-24 h-px my-4" style={{backgroundColor: colors.accent}}></div>
        <p className="max-w-md mx-auto text-sm mb-8">{data.message}</p>
        <div className="text-sm">
            <p className="font-semibold">{data.date}</p>
            <p className="mt-1">{data.time}</p>
            <p className="mt-1">{data.location}</p>
        </div>
    </div>
);


// --- CONFIGURATION ---
const fontPairs: FontPair[] = [
  { id: 'elegant', name: 'Elegante', title: "'Playfair Display', serif", body: "'Inter', sans-serif" },
  { id: 'modern', name: 'Moderno', title: "'Inter', sans-serif", body: "'Lato', sans-serif" },
  { id: 'romantic', name: 'Romântico', title: "'Dancing Script', cursive", body: "'Lora', serif" },
];

const patterns = [
    { id: 'none', name: 'Nenhum', style: 'none' },
    { id: 'confetti', name: 'Confetes', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuQ29udGVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAxMCBDIDE1IDAsIDI1IDIwLCAzMCAxMCBTIDQ1IDAsIDUwIDEwIiBzdHJva2U9IiMwMDAwMDAwIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSIjMDAwMDAwIi8+PGNpcmNsZSBjeD0iNSIgY3k9IjI1IiByPSIxIiBmaWxsPSIjMDAwMDAwIi8+PHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iMyIgaGVpZ2h0PSIzIiByeD0iMSIgZmlsbD0iIzAwMDAwMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')` },
    { id: 'dots', name: 'Pontos', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMSIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==')` },
    { id: 'lines', name: 'Linhas', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTEsMSAyLC0yIE0wLDEwIDEwLDAgTTksMTEgMTIsOCIKICAgICAgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')` },
    { id: 'grid', name: 'Grelha', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZGVmcz4gCiAgICAgICAgPHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMCIgaGVpZHRoPSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0gMTAgMCBMIDAgMCAwIDEwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4CiAgICAgICAgPC9wYXR0ZXJuPgogICAgPC9kZWZzPgogICAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')` },
    { id: 'waves', name: 'Ondas', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9IndhdmUiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiIHdpZHRoPSIyMCIgaGVpZHRoPSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEMgNSAwLCAxNSAyMCwgMjAgMTAgUyAzNSAwLCA0MCAxMCIgc3Ryb2tlPSIjMDAwMDAwIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlKSIvPjwvc3ZnPg==')` },
];


const templates = [
    { id: 'birthday', name: 'Aniversário', component: BirthdayTemplate, defaultData: { title: 'Aniversário do João', subtitle: 'Junta-te a nós para celebrar os meus 30 anos!', message: 'A tua presença é o melhor presente! Haverá bolo, música e muita diversão.', date: '15 de Agosto, 2024', time: '19:00', location: 'Salão de Festas "Alegria"', imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400' }, colors: { background: '#FFFBEB', text: '#4B5563', accent: '#F59E0B' }, defaultFontId: 'modern' },
    { id: 'wedding', name: 'Casamento', component: WeddingTemplate, defaultData: { title: 'Ana & Carlos', subtitle: 'Convidam para a celebração do seu casamento', message: 'Temos a honra de vos convidar para testemunhar o início da nossa vida em conjunto.', date: '20 de Setembro, 2024', time: '16:00', location: 'Quinta das Palmeiras, Luanda', imageUrl: null }, colors: { background: '#F9FAFB', text: '#374151', accent: '#1E40AF' }, defaultFontId: 'romantic' },
    { id: 'professional', name: 'Evento Profissional', component: ProfessionalTemplate, defaultData: { title: 'Conferência Tech 2024', subtitle: 'O Futuro da Inovação em Angola', message: 'Participe num dia de palestras, networking e workshops com os líderes da indústria tecnológica.', date: '25 de Outubro, 2024', time: '09:00', location: 'Hotel Epic Sana, Luanda', imageUrl: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=400' }, colors: { background: '#FFFFFF', text: '#111827', accent: '#047857' }, defaultFontId: 'modern' },
    { id: 'babyShower', name: 'Chá de Bebé', component: BirthdayTemplate, defaultData: { title: "Chá de Bebé da Sofia", subtitle: "Celebre a chegada do nosso anjinho!", message: "Junte-se a nós para um dia de alegria, jogos e doces em honra do nosso bebé que está a chegar.", date: "10 de Julho, 2024", time: "15:00", location: "Jardim Encantado, Condomínio Flores", imageUrl: "https://images.unsplash.com/photo-1599619351208-fe799ec52d50?w=400" }, colors: { background: "#E0F2FE", text: "#075985", accent: "#38BDF8" }, defaultFontId: 'romantic' },
    { id: 'baptism', name: 'Batizado', component: WeddingTemplate, defaultData: { title: "Batizado do Miguel", subtitle: "Convidamos para a celebração sagrada", message: "Convidamo-lo a partilhar a nossa alegria na cerimónia de batismo do nosso filho.", date: "05 de Agosto, 2024", time: "11:00", location: "Igreja da Sé, Luanda", imageUrl: null }, colors: { background: "#F8F8F4", text: "#44403C", accent: "#BEA45A" }, defaultFontId: 'elegant' },
    { id: 'bridalShower', name: 'Chá de Panela', component: BirthdayTemplate, defaultData: { title: "Chá de Panela da Ana", subtitle: "Ajude-nos a equipar a nossa cozinha!", message: "A sua presença e um miminho para o nosso novo lar encherão os nossos corações de alegria. Venha celebrar connosco!", date: "28 de Julho, 2024", time: "16:00", location: "Casa dos Noivos", imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400" }, colors: { background: "#FEF2F2", text: "#9F1239", accent: "#F472B6" }, defaultFontId: 'romantic' },
    { id: 'graduation', name: 'Finalistas', component: MinimalistTemplate, defaultData: { title: "Festa de Finalistas", subtitle: "Celebre a minha conquista!", message: "O fim de uma jornada e o início de outra. Convido-o a celebrar a minha formatura comigo e com os meus entes queridos.", date: "12 de Agosto, 2024", time: "20:00", location: "Salão Nobre da Universidade", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400" }, colors: { background: "#F9FAFB", text: "#111827", accent: "#D97706" }, defaultFontId: 'elegant' },
    { id: 'housewarming', name: 'Inauguração', component: MinimalistTemplate, defaultData: { title: "Lar, Doce Lar", subtitle: "Venha celebrar a nossa nova casa!", message: "As portas da nossa casa estão abertas para si! Junte-se a nós para uma pequena festa de inauguração com boa comida e boa companhia.", date: "03 de Setembro, 2024", time: "18:00", location: "A nossa nova morada", imageUrl: "https://images.unsplash.com/photo-1587398305333-e18d63c5e054?w=400" }, colors: { background: "#FDFBF7", text: "#064E3B", accent: "#C2410C" }, defaultFontId: 'modern' },
    { id: 'general', name: 'Diversos', component: MinimalistTemplate, defaultData: { title: "Você está Convidado!", subtitle: "Um evento especial", message: "Junte-se a nós para um momento inesquecível de boa conversa e companhia.", date: "A definir", time: "20:00", location: "O nosso cantinho", imageUrl: null }, colors: { background: "#FFFFFF", text: "#1F2937", accent: "#4F46E5" }, defaultFontId: 'modern' },
];

const TemplateWrapper: React.FC<{
    backgroundColor: string;
    patternUrl: string | null;
    uploadedImage: string | null;
    opacity: number;
    children: React.ReactNode;
}> = ({ backgroundColor, patternUrl, uploadedImage, opacity, children }) => {
    return (
        <div style={{ backgroundColor, position: 'relative', width: '100%', height: '100%' }}>
            {patternUrl && patternUrl !== 'none' && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: patternUrl, opacity, pointerEvents: 'none' }} />
            )}
            {uploadedImage && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${uploadedImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity, pointerEvents: 'none' }} />
            )}
            <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                {children}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const InvitationCreator: React.FC = () => {
    const [activeTemplate, setActiveTemplate] = useState(templates[0]);
    const [data, setData] = useState<InvitationData>(templates[0].defaultData);
    const [colors, setColors] = useState(templates[0].colors);
    const [activeFont, setActiveFont] = useState(() => fontPairs.find(f => f.id === templates[0].defaultFontId) || fontPairs[0]);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [isProcessing, setIsProcessing] = useState<false | 'png' | 'pdf' | 'print'>(false);
    const [activePatternId, setActivePatternId] = useState<string>('none');
    const [uploadedBgImage, setUploadedBgImage] = useState<string | null>(null);
    const [backgroundOpacity, setBackgroundOpacity] = useState<number>(0.1);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [miniPreviewDismissed, setMiniPreviewDismissed] = useState(false);
    const [isSheetExporterOpen, setIsSheetExporterOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof InvitationData, string>>>({});

    const previewRef = useRef<HTMLDivElement>(null);

    const { requestServiceUse } = useCredits();
    const SERVICE_ID = 'invitation';

    const handleTemplateChange = (templateId: string) => {
        const newTemplate = templates.find(t => t.id === templateId) || templates[0];
        setActiveTemplate(newTemplate);
        setData(newTemplate.defaultData);
        setColors(newTemplate.colors);
        const newFont = fontPairs.find(f => f.id === newTemplate.defaultFontId) || fontPairs[0];
        setActiveFont(newFont);
        setActivePatternId('none');
        setUploadedBgImage(null);
        setMiniPreviewDismissed(false);
        setErrors({});
    };

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof InvitationData]) {
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
            reader.onloadend = () => {
                setData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
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
        const newErrors: Partial<Record<keyof InvitationData, string>> = {};
        if (!data.title.trim()) newErrors.title = "O título é obrigatório.";
        if (!data.date.trim()) newErrors.date = "A data é obrigatória.";
        if (!data.time.trim()) newErrors.time = "A hora é obrigatória.";
        if (!data.location.trim()) newErrors.location = "A localização é obrigatória.";
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return false;
        }
        return true;
    };

    const handleExport = (format: 'png' | 'pdf') => {
        if (!validateData()) return;
        const performExport = async () => {
            const { jsPDF } = (window as any).jspdf;
            const html2canvas = (window as any).html2canvas;
            const content = previewRef.current;
            if (!content) return;

            setIsProcessing(format);
            try {
                const canvas = await html2canvas(content, { scale: 4, useCORS: true }); // Higher scale for better quality
                const imgData = canvas.toDataURL('image/png');
                const fileName = `${data.title.replace(/\s+/g, '_')}_convite`;

                if (format === 'png') {
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `${fileName}.png`;
                    link.click();
                } else {
                    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a5' });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`${fileName}.pdf`);
                }
            } catch (error) {
                console.error(`Error exporting as ${format}:`, error);
            } finally {
                setIsProcessing(false);
            }
        };
        requestServiceUse(SERVICE_ID, performExport, {
            title: 'Confirmar Exportação',
            message: `Exportar o convite como ${format.toUpperCase()} irá descontar <strong>1 crédito</strong>.`
        });
    };

    const handlePrint = () => {
        if (!validateData()) return;
        const performPrint = () => {
            const content = previewRef.current;
            if (!content) return;
            setIsProcessing('print');
    
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
    
            const htmlContent = `
                <html>
                    <head>
                        <title>Imprimir Convite</title>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&family=Lora:ital,wght@0,400;1,400&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
                        <style>
                            @page { size: A5 landscape; margin: 0; }
                            body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                            /* Ensure the high-res div prints correctly */
                            .print-container { width: 210mm; height: 148mm; }
                        </style>
                    </head>
                    <body><div class="print-container">${content.innerHTML}</div></body>
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
            message: 'Imprimir este convite irá descontar <strong>1 crédito</strong>.'
        });
    };

    const handleShare = (platform: 'whatsapp' | 'email' | 'link') => {
        const shareText = `Convite: ${data.title} - ${data.date} às ${data.time} em ${data.location}. Mais detalhes em breve!`;
        switch (platform) {
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                break;
            case 'email':
                window.location.href = `mailto:?subject=${encodeURIComponent(`Convite: ${data.title}`)}&body=${encodeURIComponent(shareText)}`;
                break;
            case 'link':
                navigator.clipboard.writeText(window.location.href).then(() => alert('Link copiado para a área de transferência!'));
                break;
        }
        setShowShareOptions(false);
    };

    const TemplateComponent = activeTemplate.component;
    const activePatternUrl = patterns.find(p => p.id === activePatternId)?.style || null;

    const renderPreviewContent = () => (
         <div className="w-full max-w-4xl">
            <div className="flex flex-wrap justify-end items-center gap-2 mb-4">
                <button onClick={() => handleExport('png')} disabled={!!isProcessing} className="flex items-center bg-blue-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition">
                    {isProcessing === 'png' ? <SpinnerIcon className="w-5 h-5 mr-1.5" /> : <DownloadIcon className="w-5 h-5 mr-1.5" />} {isProcessing === 'png' ? 'A baixar...' : 'Baixar PNG'}
                </button>
                 <button onClick={() => handleExport('pdf')} disabled={!!isProcessing} className="flex items-center bg-red-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-red-700 disabled:bg-gray-400 transition">
                    {isProcessing === 'pdf' ? <SpinnerIcon className="w-5 h-5 mr-1.5" /> : <DownloadIcon className="w-5 h-5 mr-1.5" />} {isProcessing === 'pdf' ? 'A baixar...' : 'Baixar PDF'}
                </button>
                 <button onClick={handlePrint} disabled={!!isProcessing} className="flex items-center bg-gray-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition">
                    {isProcessing === 'print' ? <SpinnerIcon className="w-5 h-5 mr-1.5" /> : <PrintIcon className="w-5 h-5 mr-1.5" />} {isProcessing === 'print' ? 'A imprimir...' : 'Imprimir'}
                </button>
                 <button onClick={() => setIsSheetExporterOpen(true)} disabled={!!isProcessing} className="flex items-center bg-indigo-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition">
                    <SheetIcon className="w-5 h-5 mr-1.5" /> Exportar em Folha
                </button>
                <div className="relative">
                    <button onClick={() => setShowShareOptions(!showShareOptions)} disabled={!!isProcessing} className="flex items-center bg-yellow-500 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-yellow-600 transition">
                        <ShareIcon className="w-5 h-5 mr-1.5" /> Partilhar
                    </button>
                    {showShareOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                            <button onClick={() => handleShare('whatsapp')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">WhatsApp</button>
                            <button onClick={() => handleShare('email')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Email</button>
                            <button onClick={() => handleShare('link')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Copiar Link</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="w-full overflow-x-auto rounded-lg bg-gray-100 p-2 border">
                <div ref={previewRef} className="w-[816px] h-[574px] bg-white shadow-2xl mx-auto">
                    <TemplateWrapper 
                        backgroundColor={colors.background} 
                        patternUrl={activePatternUrl}
                        uploadedImage={uploadedBgImage}
                        opacity={backgroundOpacity}
                    >
                       <TemplateComponent data={data} colors={colors} font={activeFont} />
                    </TemplateWrapper>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-full">
             <SheetExporter
                isOpen={isSheetExporterOpen}
                onClose={() => setIsSheetExporterOpen(false)}
                elementToExportRef={previewRef}
                aspectRatio={210 / 148}
                baseFileName={`${data.title}_convite`}
                serviceId={SERVICE_ID}
            />
            {/* Form Panel */}
            <div className="w-full lg:w-1/3 p-4 lg:p-6 overflow-y-auto bg-white">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">1. Escolha um Modelo</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {templates.map(t => (
                                <button key={t.id} onClick={() => handleTemplateChange(t.id)} className={`px-3 py-2 text-sm rounded-md border-2 ${activeTemplate.id === t.id ? 'border-blue-600 bg-blue-50' : 'border-transparent hover:bg-gray-100'}`}>
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">2. Personalize o Conteúdo</h3>
                        <div className="space-y-3">
                            <Input label="Título Principal" name="title" value={data.title} onChange={handleInputChange} error={errors.title} />
                            <Input label="Subtítulo" name="subtitle" value={data.subtitle} onChange={handleInputChange} />
                            <TextArea label="Mensagem" name="message" value={data.message} onChange={handleInputChange} />
                            <Input label="Data" name="date" value={data.date} onChange={handleInputChange} error={errors.date} />
                            <Input label="Hora" name="time" value={data.time} onChange={handleInputChange} error={errors.time} />
                            <Input label="Localização" name="location" value={data.location} onChange={handleInputChange} error={errors.location} />
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">3. Adicione uma Imagem (Opcional)</h3>
                        <label className="w-full flex items-center justify-center p-3 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                           <UploadIcon className="w-5 h-5 mr-2" />
                           Carregar Foto
                           <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">4. Personalize as Cores e Fontes</h3>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <ColorInput label="Fundo" name="background" value={colors.background} onChange={handleColorChange} />
                            <ColorInput label="Texto" name="text" value={colors.text} onChange={handleColorChange} />
                            <ColorInput label="Destaque" name="accent" value={colors.accent} onChange={handleColorChange} />
                        </div>
                        <div className="flex space-x-2">
                            {fontPairs.map(font => (
                                <button key={font.id} onClick={() => setActiveFont(font)} className={`flex-1 p-2 text-center rounded-md border-2 transition-colors ${activeFont.id === font.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:bg-gray-100'}`} >
                                    <span className="text-lg" style={{ fontFamily: font.title }}>Ag</span>
                                    <span className="text-sm ml-1" style={{ fontFamily: font.body }}>/ Ag</span>
                                    <span className="block text-xs text-gray-500 mt-1">{font.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border-t pt-4">
                         <h3 className="text-lg font-semibold mb-2">5. Personalizar Fundo</h3>
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
                <div className="lg:hidden fixed bottom-20 right-4 z-20 w-48 aspect-[210/148] bg-white rounded-lg shadow-2xl border animate-fade-in-up overflow-hidden">
                     <button 
                        onClick={() => setMiniPreviewDismissed(true)} 
                        className="absolute top-1 right-1 z-30 p-1 bg-gray-800 text-white bg-opacity-50 rounded-full hover:bg-opacity-75" 
                        aria-label="Fechar pré-visualização rápida"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                    <div className="h-full w-full pointer-events-none">
                         <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%' }}>
                             <TemplateWrapper 
                                backgroundColor={colors.background} 
                                patternUrl={activePatternUrl}
                                uploadedImage={uploadedBgImage}
                                opacity={backgroundOpacity}
                            >
                               <TemplateComponent data={data} colors={colors} font={activeFont} />
                            </TemplateWrapper>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Preview Panel (Sheet) */}
            {isPreviewOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-60"
                        onClick={() => setIsPreviewOpen(false)}
                        aria-hidden="true"
                    />
                    {/* Sliding Panel */}
                    <div className="absolute bottom-0 left-0 right-0 h-[95vh] bg-gray-100 rounded-t-2xl shadow-2xl overflow-y-auto p-4 pt-12 flex flex-col items-center justify-center">
                        <button
                            onClick={() => setIsPreviewOpen(false)}
                            className="absolute top-3 right-3 z-50 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                            aria-label="Fechar pré-visualização"
                        >
                            <CloseIcon className="w-5 h-5 text-gray-700" />
                        </button>
                        {renderPreviewContent()}
                    </div>
                </div>
            )}


            {/* Floating Action Button for Mobile */}
            <button
                onClick={() => setIsPreviewOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-30 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                aria-label="Abrir painel de pré-visualização e download do convite"
            >
                Pré-visualizar / Baixar
            </button>
        </div>
    );
};

// --- HELPER UI COMPONENTS ---
const Input: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, error?: string}> = ({ label, name, value, onChange, error }) => (
    <div>
        <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <input type="text" id={name} name={name} value={value} onChange={onChange} className={`w-full px-2 py-1.5 border rounded-md shadow-sm text-sm focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);
const TextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, error?: string}> = ({ label, name, value, onChange, error }) => (
    <div>
        <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={3} className={`w-full px-2 py-1.5 border rounded-md shadow-sm text-sm focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);
const ColorInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-xs font-medium text-gray-600 mb-1 text-center">{label}</label>
        <input type="color" id={name} name={name} value={value} onChange={onChange} className="w-full h-10 border-gray-300 rounded-md cursor-pointer" />
    </div>
);


export default InvitationCreator;