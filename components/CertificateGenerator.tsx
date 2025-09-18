import React, { useState, useRef, useCallback, ChangeEvent } from 'react';
import { useCredits } from '../contexts/CreditContext';

// --- ICONS ---
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const CertificateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);
const DiplomaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
    </svg>
);

// --- HELPER FUNCTIONS ---
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

// --- DATA TYPES ---
interface CertificateData {
  recipientName: string;
  eventName: string;
  description: string;
  issuerName: string;
  date: string;
  signatureImage: string | null;
  logoImage: string | null;
}

interface TemplateProps {
  data: CertificateData;
  colors: { background: string; text: string; accent: string; primary?: string; };
  font: { title: string; body: string; };
}

// --- TEMPLATE COMPONENTS ---
const ParticipationTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full p-8 text-center flex flex-col justify-between" style={{ color: colors.text }}>
        <header>
            {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-16 mx-auto mb-4 object-contain" />}
            <h1 className="text-4xl" style={{ fontFamily: font.title, color: colors.accent }}>Certificado de Participação</h1>
        </header>
        <main className="my-4">
            <p className="text-lg" style={{ fontFamily: font.body }}>Certificamos que</p>
            <p className="text-3xl my-2" style={{ fontFamily: font.title, color: colors.accent }}>{data.recipientName || "Nome do Participante"}</p>
            <p className="text-lg" style={{ fontFamily: font.body }}>
                participou com sucesso no evento
            </p>
            <p className="text-2xl font-semibold my-2" style={{ fontFamily: font.body }}>{data.eventName || "Nome do Curso/Evento"}</p>
            <p className="text-sm text-gray-600" style={{ fontFamily: font.body }}>{data.description || "com uma carga horária de X horas, realizado no dia DD/MM/AAAA."}</p>
        </main>
        <footer className="mt-auto">
            <p className="mb-2">{data.date || "Luanda, DD de Mês de AAAA"}</p>
            <div className="inline-block">
                {data.signatureImage ? <img src={data.signatureImage} alt="Assinatura" className="h-12 mx-auto object-contain" /> : <div className="h-12"></div>}
                <div className="border-t-2 w-48 mx-auto mt-1" style={{ borderColor: colors.text }}></div>
                <p className="text-sm mt-1">{data.issuerName || "Nome do Formador/Organizador"}</p>
            </div>
        </footer>
    </div>
);

const HonorTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full p-12 text-center flex flex-col justify-center border-4" style={{ color: colors.text, borderColor: colors.accent }}>
        <header>
            {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-12 mx-auto mb-2 object-contain" />}
            <h1 className="text-5xl" style={{ fontFamily: font.title }}>Diploma de Honra</h1>
        </header>
        <main className="my-6">
            <p className="text-xl" style={{ fontFamily: font.body }}>Conferido a</p>
            <p className="text-4xl my-3" style={{ fontFamily: font.title, color: colors.accent }}>{data.recipientName || "Nome do Homenageado"}</p>
            <p className="text-md max-w-md mx-auto" style={{ fontFamily: font.body }}>
                {data.description || "Em reconhecimento pelo seu desempenho excecional, dedicação e contribuição notável durante o evento/ano letivo."}
            </p>
        </main>
        <footer className="mt-auto flex justify-around items-center pt-4">
            <div className="text-center">
                {data.signatureImage ? <img src={data.signatureImage} alt="Assinatura" className="h-12 mx-auto object-contain" /> : <div className="h-12"></div>}
                <div className="border-t-2 w-40 mx-auto mt-1" style={{ borderColor: colors.text }}></div>
                <p className="text-sm mt-1">{data.issuerName || "Diretor da Instituição"}</p>
            </div>
            <div className="text-center">
                <p className="font-bold">{data.date || "DD/MM/AAAA"}</p>
                <div className="border-t-2 w-40 mx-auto mt-1" style={{ borderColor: colors.text }}></div>
                <p className="text-sm mt-1">Data</p>
            </div>
        </footer>
    </div>
);

const CompletionTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full p-8 flex" style={{ color: colors.text }}>
        <div className="w-1/4 border-r-4 pr-6 flex flex-col items-center justify-between text-center" style={{ borderColor: colors.accent }}>
             {data.logoImage ? <img src={data.logoImage} alt="Logo" className="h-16 object-contain" /> : <div className="h-16"></div>}
            <h2 className="text-3xl font-bold" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: font.title }}>CERTIFICADO</h2>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10" style={{color: colors.accent}} fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
            </div>
        </div>
        <div className="w-3/4 pl-8 flex flex-col justify-center">
             <h1 className="text-2xl" style={{ fontFamily: font.title }}>DE CONCLUSÃO</h1>
             <p className="text-lg my-4" style={{ fontFamily: font.body }}>Este certificado é atribuído a</p>
             <p className="text-3xl" style={{ fontFamily: font.title, color: colors.accent }}>{data.recipientName || "Nome do Formando"}</p>
             <p className="text-md my-4" style={{ fontFamily: font.body }}>
                pela conclusão bem-sucedida do curso de
             </p>
             <p className="text-2xl font-semibold" style={{ fontFamily: font.body }}>{data.eventName || "Nome do Curso"}</p>
             <p className="text-sm text-gray-600 mt-2" style={{ fontFamily: font.body }}>{data.description || "Curso ministrado pela nossa instituição."}</p>
            <div className="mt-8 flex justify-between items-end">
                <div className="text-center">
                    {data.signatureImage ? <img src={data.signatureImage} alt="Assinatura" className="h-10 mx-auto object-contain" /> : <div className="h-10"></div>}
                    <div className="border-t-2 w-32 mx-auto mt-1" style={{ borderColor: colors.text }}></div>
                    <p className="text-xs mt-1">{data.issuerName || "Nome do Instrutor"}</p>
                </div>
                <div className="text-xs text-center">
                    <p className="font-bold">{data.date || "DD/MM/AAAA"}</p>
                    <p>Data de Emissão</p>
                </div>
            </div>
        </div>
    </div>
);

const RecognitionTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full p-10 text-center flex flex-col justify-center border-2" style={{ color: colors.text, borderColor: colors.accent, borderStyle: 'dashed' }}>
        <header>
            {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-14 mx-auto mb-4 object-contain" />}
            <h1 className="text-4xl" style={{ fontFamily: font.title, color: colors.accent }}>Certificado de Reconhecimento</h1>
        </header>
        <main className="my-6">
            <p className="text-lg" style={{ fontFamily: font.body }}>É com grande honra que apresentamos este reconhecimento a</p>
            <p className="text-3xl my-3" style={{ fontFamily: font.title }}>{data.recipientName || "Nome do Homenageado"}</p>
            <p className="text-md max-w-lg mx-auto" style={{ fontFamily: font.body }}>
                {data.description || "Pela sua inestimável contribuição, dedicação e impacto positivo. O seu trabalho não passou despercebido e é sinceramente apreciado."}
            </p>
        </main>
        <footer className="mt-auto flex justify-between items-center pt-4 w-full max-w-md mx-auto">
            <div className="text-center">
                <p className="font-bold">{data.issuerName || "Nome do Emissor"}</p>
                <div className="border-t-2 w-40 mx-auto mt-1" style={{ borderColor: colors.text }}></div>
                <p className="text-sm mt-1">Organização</p>
            </div>
            <div className="text-center">
                <p className="font-bold">{data.date || "DD/MM/AAAA"}</p>
                <div className="border-t-2 w-40 mx-auto mt-1" style={{ borderColor: colors.text }}></div>
                <p className="text-sm mt-1">Data</p>
            </div>
        </footer>
    </div>
);

const WorkshopTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full flex" style={{ color: colors.text }}>
        <div className="w-2/3 p-8 flex flex-col justify-center">
            <p className="text-sm tracking-widest uppercase" style={{ color: colors.accent }}>Certificado de Workshop</p>
            <h1 className="text-4xl font-bold my-4" style={{ fontFamily: font.title }}>{data.eventName || "Nome do Workshop"}</h1>
            <p className="text-lg" style={{ fontFamily: font.body }}>Certificamos que</p>
            <p className="text-3xl my-2" style={{ fontFamily: font.title, color: colors.accent }}>{data.recipientName || "Nome do Participante"}</p>
            <p className="text-md text-gray-600" style={{ fontFamily: font.body }}>{data.description || "completou com sucesso o workshop, demonstrando empenho e excelentes capacidades práticas."}</p>
        </div>
        <div className="w-1/3 p-6 flex flex-col justify-between text-center text-white" style={{ backgroundColor: colors.accent }}>
            {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-16 mx-auto object-contain brightness-0 invert" />}
            <div className="my-auto">
                <p className="text-sm">Emitido em:</p>
                <p className="font-bold">{data.date || "DD/MM/AAAA"}</p>
            </div>
            <div>
                {data.signatureImage ? <img src={data.signatureImage} alt="Assinatura" className="h-12 mx-auto object-contain brightness-0 invert" /> : <div className="h-12"></div>}
                <div className="border-t-2 w-32 mx-auto mt-1 border-white"></div>
                <p className="text-sm mt-1">{data.issuerName || "Nome do Facilitador"}</p>
            </div>
        </div>
    </div>
);

const ExcellenceDiplomaTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full p-12 text-center flex flex-col justify-center border-8" style={{ color: colors.text, borderColor: colors.accent, borderStyle: 'double' }}>
        <header>
            {data.logoImage && <img src={data.logoImage} alt="Logo" className="h-16 mx-auto mb-4 object-contain" />}
            <p className="text-xl" style={{ fontFamily: font.body, color: colors.accent }}>A Instituição {data.issuerName || "Nome da Instituição"}</p>
            <h1 className="text-5xl my-2" style={{ fontFamily: font.title }}>Diploma de Excelência</h1>
        </header>
        <main className="my-6">
            <p className="text-lg" style={{ fontFamily: font.body }}>É com grande orgulho que conferimos este diploma a</p>
            <p className="text-4xl my-3" style={{ fontFamily: font.title, color: colors.accent }}>{data.recipientName || "Nome do Aluno"}</p>
            <p className="text-md max-w-lg mx-auto" style={{ fontFamily: font.body }}>
                {data.description || "Pelo seu excecional mérito e desempenho brilhante, alcançando o mais alto nível de excelência no curso de " + (data.eventName || "Nome do Curso") + "."}
            </p>
        </main>
        <footer className="mt-auto flex justify-around items-center pt-6">
             <div className="text-center">
                <div className="border-t-2 w-48 mx-auto" style={{ borderColor: colors.text }}></div>
                <p className="text-sm mt-1">Diretor(a) Pedagógico(a)</p>
            </div>
            <div className="text-center">
                 <div className="border-t-2 w-48 mx-auto" style={{ borderColor: colors.text }}></div>
                <p className="text-sm mt-1">Data: {data.date || "DD/MM/AAAA"}</p>
            </div>
        </footer>
    </div>
);

const SportsMeritDiplomaTemplate: React.FC<TemplateProps> = ({ data, colors, font }) => (
    <div className="w-full h-full flex flex-col text-center" style={{ color: colors.text, backgroundColor: colors.background }}>
        <header className="p-6" style={{ backgroundColor: colors.primary, color: getTextColorForBackground(colors.primary || '#ffffff')}}>
            <h1 className="text-4xl font-extrabold uppercase tracking-wider" style={{ fontFamily: font.title }}>Mérito Desportivo</h1>
        </header>
        <main className="flex-1 p-6 flex flex-col items-center justify-center">
            <svg className="w-20 h-20 mb-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            <p className="text-lg" style={{ fontFamily: font.body }}>Este diploma é atribuído a</p>
            <p className="text-4xl my-3 font-bold" style={{ fontFamily: font.title }}>{data.recipientName || "Nome do Atleta"}</p>
            <p className="text-md max-w-md mx-auto" style={{ fontFamily: font.body }}>
                {data.description || "Em reconhecimento pela sua extraordinária performance, espírito de equipa e dedicação exemplar na modalidade de " + (data.eventName || "Futebol") + "."}
            </p>
        </main>
        <footer className="p-4 text-sm flex justify-between items-center" style={{ backgroundColor: '#f3f4f6' }}>
            <p className="font-semibold">{data.issuerName || "A Direção do Clube"}</p>
            <p>{data.date || "Época 2024"}</p>
        </footer>
    </div>
);

// --- CONFIGURATION ---
const fontPairs = [
  { id: 'elegant', name: 'Elegante', title: "'Playfair Display', serif", body: "'Inter', sans-serif" },
  { id: 'modern', name: 'Moderno', title: "'Inter', sans-serif", body: "'Lato', sans-serif" },
  { id: 'formal', name: 'Formal', title: "'Times New Roman', serif", body: "'Georgia', serif" },
];

const templateCategories = [
    {
        name: 'Certificados',
        templates: [
            { id: 'participation', name: 'Participação', component: ParticipationTemplate, defaultData: { recipientName: 'João Silva', eventName: 'Workshop de Marketing Digital', description: 'Com uma carga horária de 8 horas, realizado com sucesso.', issuerName: 'Dr. Carlos Neto, Formador', date: 'Luanda, 25 de Dezembro de 2024', signatureImage: null, logoImage: null }, colors: { background: '#F9FAFB', text: '#374151', accent: '#2563EB' }, defaultFontId: 'modern' },
            { id: 'completion', name: 'Conclusão', component: CompletionTemplate, defaultData: { recipientName: 'Pedro dos Santos', eventName: 'Curso Avançado de Finanças', description: 'Ministrado pela Konica Express Training, com aproveitamento.', issuerName: 'António Mendes, Coordenador', date: 'Luanda, 30 de Novembro de 2024', signatureImage: null, logoImage: null }, colors: { background: '#F8F8F4', text: '#111827', accent: '#047857' }, defaultFontId: 'formal' },
            { id: 'recognition', name: 'Reconhecimento', component: RecognitionTemplate, defaultData: { recipientName: 'Equipa de Voluntários', eventName: '', description: 'Pela vossa inestimável contribuição e dedicação durante a campanha de solidariedade. O vosso trabalho fez a diferença.', issuerName: 'A Organização', date: 'Luanda, 10 de Dezembro de 2024', signatureImage: null, logoImage: null }, colors: { background: '#FFFBEB', text: '#78350F', accent: '#D97706' }, defaultFontId: 'elegant' },
            { id: 'workshop', name: 'Workshop', component: WorkshopTemplate, defaultData: { recipientName: 'Maria Antónia', eventName: 'Workshop de Fotografia Criativa', description: 'Completou com sucesso o workshop, demonstrando empenho e excelentes capacidades práticas.', issuerName: 'Fotógrafo Profissional', date: 'Luanda, 18 de Novembro de 2024', signatureImage: null, logoImage: null }, colors: { background: '#FFFFFF', text: '#1E293B', accent: '#0D9488' }, defaultFontId: 'modern' },
        ]
    },
    {
        name: 'Diplomas',
        templates: [
            { id: 'honor', name: 'Honra / Mérito', component: HonorTemplate, defaultData: { recipientName: 'Maria Domingos', eventName: '', description: 'Em reconhecimento pelo seu excecional desempenho académico e dedicação exemplar durante o ano letivo de 2024.', issuerName: 'A Direção da Escola', date: 'Luanda, 15 de Dezembro de 2024', signatureImage: null, logoImage: null }, colors: { background: '#FFFFFF', text: '#4B3621', accent: '#BEA45A' }, defaultFontId: 'elegant' },
            { id: 'excellence', name: 'Excelência', component: ExcellenceDiplomaTemplate, defaultData: { recipientName: 'Francisco de Almeida', eventName: 'Gestão de Projetos', description: 'Pelo seu excecional mérito e desempenho brilhante, alcançando o mais alto nível de excelência no curso.', issuerName: 'Instituto de Formação Avançada', date: 'Luanda, 20 de Dezembro de 2024', signatureImage: null, logoImage: null }, colors: { background: '#F3F4F6', text: '#1E3A8A', accent: '#1E40AF' }, defaultFontId: 'formal' },
            { id: 'sports_merit', name: 'Mérito Desportivo', component: SportsMeritDiplomaTemplate, defaultData: { recipientName: 'Clube Desportivo 1º de Agosto', eventName: 'Futebol Sénior Masculino', description: 'Em reconhecimento pela extraordinária performance, espírito de equipa e dedicação exemplar que culminou na conquista do campeonato nacional.', issuerName: 'Federação Angolana de Futebol', date: 'Época 2024', signatureImage: null, logoImage: null }, colors: { background: '#FFFFFF', text: '#1F2937', accent: '#B91C1C', primary: '#1F2937' }, defaultFontId: 'modern' },
        ]
    }
];

const allTemplates = templateCategories.flatMap(category => category.templates);

const TemplateWrapper: React.FC<{ backgroundColor: string; children: React.ReactNode; }> = ({ backgroundColor, children }) => {
    return (
        <div style={{ backgroundColor, width: '100%', height: '100%', position: 'relative' }}>
            {children}
        </div>
    );
};

// FIX: Added local Input and TextArea components to resolve missing component errors.
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

// --- MAIN COMPONENT ---
const CertificateGenerator: React.FC = () => {
    const [activeTemplate, setActiveTemplate] = useState(allTemplates[0]);
    const [data, setData] = useState<CertificateData>(allTemplates[0].defaultData);
    const [colors, setColors] = useState(allTemplates[0].colors);
    const [activeFont, setActiveFont] = useState(() => fontPairs.find(f => f.id === allTemplates[0].defaultFontId) || fontPairs[0]);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof CertificateData, string>>>({});
    const previewRef = useRef<HTMLDivElement>(null);
    const { requestServiceUse } = useCredits();
    const SERVICE_ID = 'other'; // Part of 'Other Services'

    const handleTemplateChange = (templateId: string) => {
        const newTemplate = allTemplates.find(t => t.id === templateId) || allTemplates[0];
        setActiveTemplate(newTemplate);
        setData(newTemplate.defaultData);
        setColors(newTemplate.colors);
        const newFont = fontPairs.find(f => f.id === newTemplate.defaultFontId) || fontPairs[0];
        setActiveFont(newFont);
        setErrors({});
    };

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof CertificateData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setColors(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'signatureImage' | 'logoImage') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({ ...prev, [field]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const validateData = (): boolean => {
        const newErrors: Partial<Record<keyof CertificateData, string>> = {};
        if (!data.recipientName.trim()) newErrors.recipientName = "O nome do recipiente é obrigatório.";
        if (!data.eventName.trim()) newErrors.eventName = "O nome do evento/curso é obrigatório.";
        if (!data.issuerName.trim()) newErrors.issuerName = "O nome do emissor é obrigatório.";
        if (!data.date.trim()) newErrors.date = "A data de emissão é obrigatória.";
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

            setIsDownloading(true);
            try {
                const canvas = await html2canvas(content, { scale: 4, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const fileName = `${activeTemplate.name.replace(/\s+/g, '_')}_${data.recipientName.replace(/\s+/g, '_')}`;

                if (format === 'png') {
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `${fileName}.png`;
                    link.click();
                } else {
                    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`${fileName}.pdf`);
                }
            } catch (error) {
                console.error(`Error exporting as ${format}:`, error);
            } finally {
                setIsDownloading(false);
            }
        };

        requestServiceUse(SERVICE_ID, performExport, {
            title: 'Confirmar Exportação',
            message: `Exportar o certificado como ${format.toUpperCase()} irá descontar <strong>1 crédito</strong>.`
        });
    };

    const TemplateComponent = activeTemplate.component;

    const renderPreviewContent = () => (
         <div className="w-full max-w-4xl">
            <div className="flex justify-end items-center gap-2 mb-4">
                <button onClick={() => handleExport('png')} disabled={isDownloading} className="flex items-center bg-blue-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition">
                    <DownloadIcon className="w-5 h-5 mr-1.5" /> {isDownloading ? 'A baixar...' : 'Baixar PNG'}
                </button>
                 <button onClick={() => handleExport('pdf')} disabled={isDownloading} className="flex items-center bg-green-600 text-white px-3 py-1.5 text-sm font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 transition">
                    <DownloadIcon className="w-5 h-5 mr-1.5" /> {isDownloading ? 'A baixar...' : 'Baixar PDF'}
                </button>
            </div>
            <div ref={previewRef} className="w-full aspect-[297/210] bg-white shadow-2xl rounded-lg overflow-hidden relative">
                <TemplateWrapper backgroundColor={colors.background}>
                   <TemplateComponent data={data} colors={colors} font={activeFont} />
                </TemplateWrapper>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-full">
            {/* Form Panel */}
            <div className="w-full lg:w-1/3 p-4 lg:p-6 overflow-y-auto bg-white">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-3">1. Escolha um Modelo</h3>
                        <div className="space-y-4">
                            {templateCategories.map(category => (
                                <div key={category.name} className="p-3 border rounded-lg bg-gray-50/50 transition-all duration-300">
                                    <div className="flex items-center mb-3">
                                        {category.name === 'Certificados' ? 
                                            <CertificateIcon className="w-6 h-6 text-indigo-500 flex-shrink-0" /> : 
                                            <DiplomaIcon className="w-6 h-6 text-amber-600 flex-shrink-0" />}
                                        <h4 className="text-md font-semibold text-gray-800 ml-2">{category.name}</h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {category.templates.map(t => (
                                            <button 
                                                key={t.id} 
                                                onClick={() => handleTemplateChange(t.id)} 
                                                className={`p-2 text-sm text-center rounded-md border-2 bg-white transition-all duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                                                    activeTemplate.id === t.id 
                                                    ? 'border-blue-500 shadow-sm font-semibold text-blue-600' 
                                                    : 'border-gray-200 hover:border-blue-400 hover:shadow-sm hover:scale-[1.02]'
                                                }`}
                                            >
                                                {t.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">2. Preencha os Dados</h3>
                        <div className="space-y-3">
                            <Input label="Nome do Recipiente" name="recipientName" value={data.recipientName} onChange={handleInputChange} error={errors.recipientName} />
                            <Input label="Nome do Evento/Curso" name="eventName" value={data.eventName} onChange={handleInputChange} error={errors.eventName} />
                            <TextArea label="Descrição" name="description" value={data.description} onChange={handleInputChange} />
                            <Input label="Nome do Emissor" name="issuerName" value={data.issuerName} onChange={handleInputChange} error={errors.issuerName} />
                            <Input label="Local e Data de Emissão" name="date" value={data.date} onChange={handleInputChange} error={errors.date} />
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2">3. Imagens (Opcional)</h3>
                        <div className="space-y-3">
                            <label className="w-full flex items-center justify-center p-3 text-sm text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                               <UploadIcon className="w-5 h-5 mr-2" /> Carregar Assinatura
                               <input type="file" accept="image/png, image/svg+xml" className="hidden" onChange={(e) => handleImageUpload(e, 'signatureImage')} />
                            </label>
                            <label className="w-full flex items-center justify-center p-3 text-sm text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                               <UploadIcon className="w-5 h-5 mr-2" /> Carregar Logótipo
                               <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logoImage')} />
                            </label>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">4. Personalize o Estilo</h3>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div>
                                <label htmlFor="backgroundColor" className="block text-xs font-medium text-gray-600 mb-1 text-center">Fundo</label>
                                <input type="color" id="backgroundColor" name="background" value={colors.background} onChange={handleColorChange} className="w-full h-10 border-gray-300 rounded-md cursor-pointer" />
                            </div>
                            <div>
                                <label htmlFor="textColor" className="block text-xs font-medium text-gray-600 mb-1 text-center">Texto</label>
                                <input type="color" id="textColor" name="text" value={colors.text} onChange={handleColorChange} className="w-full h-10 border-gray-300 rounded-md cursor-pointer" />
                            </div>
                            <div>
                                <label htmlFor="accentColor" className="block text-xs font-medium text-gray-600 mb-1 text-center">Destaque</label>
                                <input type="color" id="accentColor" name="accent" value={colors.accent} onChange={handleColorChange} className="w-full h-10 border-gray-300 rounded-md cursor-pointer" />
                            </div>
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
                </div>
            </div>

            {/* Desktop Preview Panel */}
            <div className="hidden lg:flex lg:w-2/3 items-center justify-center p-8 bg-gray-100 overflow-y-auto">
                 {renderPreviewContent()}
            </div>
            
            {/* Mobile Preview Floating Button */}
             <button
                onClick={() => setIsPreviewOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-30 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Pré-visualizar
            </button>

            {/* Mobile Preview Panel (Sheet) */}
            {isPreviewOpen && (
                <div className="lg:hidden fixed inset-0 z-40">
                    <div className="absolute inset-0 bg-black bg-opacity-60" onClick={() => setIsPreviewOpen(false)} aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 right-0 h-[95vh] bg-gray-100 rounded-t-2xl shadow-2xl overflow-y-auto p-4 pt-12 flex flex-col items-center justify-center">
                        <button onClick={() => setIsPreviewOpen(false)} className="absolute top-3 right-3 z-50 p-2 bg-gray-200 rounded-full hover:bg-gray-300" aria-label="Fechar"><CloseIcon className="w-5 h-5 text-gray-700" /></button>
                        {renderPreviewContent()}
                    </div>
                </div>
            )}
        </div>
    );
};

// FIX: Added default export to resolve import error in OtherServices.tsx
export default CertificateGenerator;