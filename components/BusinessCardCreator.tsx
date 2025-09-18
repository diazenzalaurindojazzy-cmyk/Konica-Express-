import React, { useState, useCallback, useRef } from 'react';
import { useCredits } from '../contexts/CreditContext';
import SheetExporter from './SheetExporter';

// --- ICONS ---
const UploadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>);
const TrashIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>);
const CloseIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const DownloadIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>);
const SheetIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
const PrintIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>);
const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);

// --- SOCIAL ICONS ---
const LinkedInIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0 2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>);
const InstagramIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>);
const FacebookIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>);
const TwitterIcon: React.FC<{className?: string}> = ({className}) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.616 1.922 2.397 3.328 4.491 3.364-1.889 1.473-4.281 2.346-6.872 2.346-.514 0-1.02-.03-1.522-.094 2.436 1.562 5.338 2.473 8.434 2.473 9.771 0 14.223-8.283 13.84-14.656.985-.71 1.838-1.592 2.52-2.612z"/></svg>);


// --- DATA TYPES ---
interface CardData {
    name: string;
    title: string;
    company: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
}

interface TemplateProps {
    data: CardData;
    primaryColor: string;
    backgroundColor: string;
    backgroundPattern: string;
    textColor: string;
    profileImage: string | null;
    uploadedBackgroundImage: string | null;
    uploadedBackgroundImageOpacity: number;
}


// --- HELPER FUNCTIONS ---
const getTextColorForBackground = (hexColor: string): string => {
    try {
        if (hexColor.length < 7) return '#111827'; // Default to dark on invalid color
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        const brightness = Math.round(((r * 299) + (g * 587) + (b * 114)) / 1000);
        return (brightness > 125) ? '#111827' : '#FFFFFF';
    } catch (e) {
        return '#111827';
    }
};

// --- PATTERNS ---
const patterns = [
    { id: 'none', name: 'Nenhum', style: 'none' },
    { id: 'dots', name: 'Pontos', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMSIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg==')` },
    { id: 'lines', name: 'Linhas', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTEsMSAyLC0yIE0wLDEwIDEwLDAgTTksMTEgMTIsOCIKICAgICAgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')` },
    { id: 'grid', name: 'Grelha', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIxMCIgaGVpZHRoPSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZHRoPSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')` },
    { id: 'cross', name: 'Cruzado', style: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZHRoPSI4IiBmaWxsPSJ0cmFuc3BhcmVudCIvPgo8cGF0aCBkPSJNIDAgOCBMIDggMCBNIDYgOCBMIDggNiBNIDAgMiBMIDIgMCBNIDAgNiBMIDYgMCBNIDIgOCBMIDggMiIKc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIvPgo8L3N2Zz4=')` },
    { id: 'waves', name: 'Ondas', style: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9IndhdmUiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiIHdpZHRoPSIyMCIgaGVpZHRoPSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEMgNSAwLCAxNSAyMCwgMjAgMTAgUyAzNSAwLCA0MCAxMCIgc3Ryb2tlPSIjMDAwMDAwIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCN3YXZlKSIvPjwvc3ZnPg==')` },
];

const SocialLinks: React.FC<{ data: CardData, iconColor: string, alignment?: 'left' | 'right' | 'center' }> = ({ data, iconColor, alignment = 'left' }) => {
    const hasSocials = data.linkedin || data.instagram || data.facebook || data.twitter;
    if (!hasSocials) return null;
    const alignClass = alignment === 'right' ? 'justify-end' : alignment === 'center' ? 'justify-center' : 'justify-start';

    return (
        <div className={`flex items-center gap-2 mt-2 text-[8px] ${alignClass}`}>
            {data.linkedin && <a href={`https://linkedin.com/in/${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-75" style={{ color: iconColor }}><LinkedInIcon className="w-3 h-3" /></a>}
            {data.instagram && <a href={`https://instagram.com/${data.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-75" style={{ color: iconColor }}><InstagramIcon className="w-3 h-3" /></a>}
            {data.facebook && <a href={`https://facebook.com/${data.facebook}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-75" style={{ color: iconColor }}><FacebookIcon className="w-3 h-3" /></a>}
            {data.twitter && <a href={`https://twitter.com/${data.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-75" style={{ color: iconColor }}><TwitterIcon className="w-3 h-3" /></a>}
        </div>
    );
};

// --- TEMPLATE COMPONENTS ---
const TemplateWrapper: React.FC<Pick<TemplateProps, 'backgroundColor' | 'backgroundPattern' | 'uploadedBackgroundImage' | 'uploadedBackgroundImageOpacity'> & { children: React.ReactNode; className?: string }> = 
({ backgroundColor, backgroundPattern, uploadedBackgroundImage, uploadedBackgroundImageOpacity, children, className }) => (
    <div className={`w-full h-full shadow-lg rounded-xl transition-colors duration-300 relative overflow-hidden ${className}`}
         style={{ backgroundColor }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: backgroundPattern, pointerEvents: 'none', opacity: 0.1 }} />
        {uploadedBackgroundImage && (
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${uploadedBackgroundImage})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: uploadedBackgroundImageOpacity, pointerEvents: 'none'
            }} />
        )}
        {children}
    </div>
);


const ModernTemplate: React.FC<TemplateProps> = ({ data, primaryColor, textColor, profileImage, ...bgProps }) => (
    <TemplateWrapper {...bgProps}>
        <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between text-[10px]" style={{ color: textColor }}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: primaryColor }}>{data.name}</h2>
                    <p className="text-sm font-light" style={{ opacity: 0.8 }}>{data.title}</p>
                    <p className="text-base font-semibold mt-1">{data.company}</p>
                </div>
                {profileImage && <img src={profileImage} alt="Profile" className="w-14 h-14 rounded-full object-cover ml-3 shadow-md" />}
            </div>
            <div>
                <div className="text-right text-[9px] border-t-2 pt-2 space-y-0.5" style={{ borderColor: primaryColor }}>
                    <p>{data.phone}</p>
                    <p>{data.email}</p>
                    <p>{data.website}</p>
                    <p>{data.address}</p>
                </div>
                <SocialLinks data={data} iconColor={primaryColor} alignment="right"/>
            </div>
        </div>
    </TemplateWrapper>
);

const MinimalistTemplate: React.FC<TemplateProps> = ({ data, primaryColor, textColor, profileImage, ...bgProps }) => (
    <TemplateWrapper {...bgProps}>
        <div className="relative z-10 w-full h-full p-4 flex flex-col justify-center items-center text-center text-[10px]" style={{ color: textColor }}>
            <div className={`flex w-full ${profileImage ? 'justify-between items-start' : 'justify-center items-center flex-col'}`}>
                <div className={profileImage ? 'text-left' : 'text-center'}>
                    <h2 className="text-2xl font-serif" style={{ color: primaryColor }}>{data.name}</h2>
                    <p className="text-sm mt-1 mb-3 tracking-widest uppercase" style={{ opacity: 0.7 }}>{data.title}</p>
                </div>
                {profileImage && <img src={profileImage} alt="Profile" className="w-16 h-16 rounded-full object-cover shadow-md ml-4 flex-shrink-0" />}
            </div>
            <div className="text-[9px] space-y-0.5 mt-3">
                <p className="font-semibold">{data.company}</p>
                <p>{data.phone} | {data.email}</p>
                <p>{data.website}</p>
                 <SocialLinks data={data} iconColor={primaryColor} alignment="center"/>
            </div>
        </div>
    </TemplateWrapper>
);

const CreativeTemplate: React.FC<TemplateProps> = ({ data, primaryColor, textColor, profileImage, ...bgProps }) => (
    <TemplateWrapper {...bgProps} className="flex overflow-hidden">
        <div className="relative z-10 w-full h-full flex">
            <div className="w-1/3 flex flex-col justify-center items-center p-3 transition-colors duration-300" style={{ backgroundColor: primaryColor }}>
                <h2 className="text-xl font-extrabold tracking-wider uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: getTextColorForBackground(primaryColor) }}>{data.company}</h2>
            </div>
            <div className="w-2/3 p-4 flex flex-col justify-center text-[10px]" style={{ color: textColor }}>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold">{data.name}</h2>
                        <p className="text-sm transition-colors duration-300" style={{ color: primaryColor }}>{data.title}</p>
                    </div>
                    {profileImage && <img src={profileImage} alt="Profile" className="w-14 h-14 rounded-full object-cover ml-2" />}
                </div>
                <div className="mt-auto">
                    <div className="text-[9px] space-y-1 border-t pt-2" style={{ borderColor: textColor, opacity: 0.4 }}>
                        <p>{data.phone}</p>
                        <p>{data.email}</p>
                        <p>{data.website}</p>
                        <p>{data.address}</p>
                    </div>
                     <SocialLinks data={data} iconColor={textColor} alignment="left"/>
                </div>
            </div>
        </div>
    </TemplateWrapper>
);

const ElegantTemplate: React.FC<TemplateProps> = ({ data, primaryColor, textColor, profileImage, ...bgProps }) => (
    <TemplateWrapper {...bgProps}>
        <div className="relative z-10 w-full h-full p-4 flex items-center text-[10px]" style={{ color: textColor }}>
            <div className="w-2/5 pr-3 border-r flex flex-col justify-center h-full" style={{ borderColor: primaryColor }}>
                <h2 className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}>{data.name}</h2>
                <p className="text-sm font-sans" style={{ opacity: 0.8 }}>{data.title}</p>
            </div>
            <div className="w-3/5 pl-3 text-[9px] font-sans flex flex-col h-full">
                {profileImage && <img src={profileImage} alt="Profile" className="w-14 h-14 rounded-full object-cover mb-3 self-end shadow-md" />}
                <div className="space-y-1 mt-auto">
                    <p className="font-bold">{data.company}</p>
                    <p>{data.phone}</p>
                    <p>{data.email}</p>
                    <p>{data.website}</p>
                    <p>{data.address}</p>
                    <SocialLinks data={data} iconColor={primaryColor} alignment="left"/>
                </div>
            </div>
        </div>
    </TemplateWrapper>
);

const BoldTypoTemplate: React.FC<TemplateProps> = ({ data, primaryColor, textColor, ...bgProps }) => (
    <TemplateWrapper {...bgProps}>
        <div className="relative z-10 w-full h-full p-4 flex flex-col justify-between text-[10px]" style={{ color: textColor }}>
            <div>
                <p className="font-light text-sm" style={{ opacity: 0.8 }}>{data.title}</p>
                <h2 className="text-3xl font-extrabold leading-tight tracking-tighter" style={{ color: primaryColor }}>{data.name}</h2>
            </div>
            <div className="mt-auto">
                <div className="text-left text-[9px] space-y-0.5 border-t pt-2" style={{ borderColor: primaryColor, opacity: 0.8 }}>
                    <p>{data.company}</p>
                    <p>{data.phone}</p>
                    <p>{data.email}</p>
                    <p>{data.website}</p>
                    <p>{data.address}</p>
                </div>
                 <SocialLinks data={data} iconColor={primaryColor} alignment="left"/>
            </div>
        </div>
    </TemplateWrapper>
);

const ImageFocusTemplate: React.FC<TemplateProps> = ({ data, primaryColor, textColor, profileImage, ...bgProps }) => (
    <TemplateWrapper {...bgProps} className="flex">
        <div className="relative z-10 w-full h-full flex">
            <div className="w-2/5 h-full bg-gray-300">
                {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                         <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                )}
            </div>
            <div className="w-3/5 p-4 flex flex-col justify-center text-[10px]" style={{ color: textColor }}>
                <div>
                    <h2 className="text-xl font-bold">{data.name}</h2>
                    <p className="text-sm font-medium" style={{ color: primaryColor }}>{data.title}</p>
                    <p className="text-sm mt-1">{data.company}</p>
                </div>
                <div className="mt-auto">
                    <div className="text-[9px] space-y-1 border-t pt-2" style={{ borderColor: textColor, opacity: 0.5 }}>
                        <p>{data.phone}</p>
                        <p>{data.email}</p>
                        <p>{data.website}</p>
                        <p>{data.address}</p>
                    </div>
                     <SocialLinks data={data} iconColor={primaryColor} alignment="left"/>
                </div>
            </div>
        </div>
    </TemplateWrapper>
);

// --- CONFIGURATION ---
const templateConfig = {
    modern: { name: 'Moderno', component: ModernTemplate, defaultPrimary: '#2563EB', defaultBg: '#FFFFFF' },
    minimalist: { name: 'Minimalista', component: MinimalistTemplate, defaultPrimary: '#1F2937', defaultBg: '#F9FAFB' },
    creative: { name: 'Criativo', component: CreativeTemplate, defaultPrimary: '#F59E0B', defaultBg: '#111827' },
    elegant: { name: 'Elegante', component: ElegantTemplate, defaultPrimary: '#4F46E5', defaultBg: '#F8F8F4' },
    boldTypo: { name: 'Tipográfico', component: BoldTypoTemplate, defaultPrimary: '#D946EF', defaultBg: '#1F2937' },
    imageFocus: { name: 'Com Foto', component: ImageFocusTemplate, defaultPrimary: '#10B981', defaultBg: '#FFFFFF' }
};

type TemplateKey = keyof typeof templateConfig;

const initialData: CardData = {
    name: 'Maria Mendes',
    title: 'Designer Gráfica',
    company: 'Criativa Studio',
    phone: '+244 912 345 678',
    email: 'maria.mendes@criativa.co.ao',
    website: 'criativa.co.ao',
    address: 'Rua da Criatividade 123, Luanda',
    linkedin: 'maria-mendes',
    instagram: 'maria.designs',
    facebook: 'maria.mendes.criativa',
    twitter: 'mariadesigns',
};

const CARD_WIDTH_MM = 80;
const CARD_HEIGHT_MM = 50;

// --- MAIN COMPONENT ---
const BusinessCardCreator: React.FC = () => {
    const [data, setData] = useState<CardData>(initialData);
    const [activeTemplate, setActiveTemplate] = useState<TemplateKey>('modern');
    const [primaryColor, setPrimaryColor] = useState<string>(templateConfig.modern.defaultPrimary);
    const [backgroundColor, setBackgroundColor] = useState<string>(templateConfig.modern.defaultBg);
    const [activePatternId, setActivePatternId] = useState<string>('none');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [uploadedBgImage, setUploadedBgImage] = useState<string | null>(null);
    const [uploadedBgOpacity, setUploadedBgOpacity] = useState<number>(0.1);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [miniPreviewDismissed, setMiniPreviewDismissed] = useState(false);
    const [isProcessing, setIsProcessing] = useState<false | 'png' | 'pdf' | 'print'>(false);
    const [isSheetExporterOpen, setIsSheetExporterOpen] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof CardData, string>>>({});
    const previewRef = useRef<HTMLDivElement>(null);
    
    const { requestServiceUse } = useCredits();
    const SERVICE_ID = 'businessCard';

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof CardData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    const handleTemplateChange = useCallback((key: TemplateKey) => {
        setActiveTemplate(key);
        setPrimaryColor(templateConfig[key].defaultPrimary);
        setBackgroundColor(templateConfig[key].defaultBg);
        setActivePatternId('none');
        setUploadedBgImage(null);
        setMiniPreviewDismissed(false);
        setErrors({});
    }, []);

    const handleProfileImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setProfileImage(reader.result as string); };
            reader.readAsDataURL(file);
        }
    }, []);
    const handleRemoveProfileImage = useCallback(() => { setProfileImage(null); }, []);

    const handleBgImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedBgImage(reader.result as string);
                setActivePatternId('none');
            };
            reader.readAsDataURL(file);
        }
    }, []);
    const handleRemoveBgImage = useCallback(() => { setUploadedBgImage(null); }, []);
    
    const validateData = (): boolean => {
        const newErrors: Partial<Record<keyof CardData, string>> = {};
        if (!data.name.trim()) newErrors.name = "O nome é obrigatório.";
        if (!data.title.trim()) newErrors.title = "O cargo é obrigatório.";
        if (!data.phone.trim()) newErrors.phone = "O telemóvel é obrigatório.";
        if (!data.email.trim()) newErrors.email = "O email é obrigatório.";

        setErrors(newErrors);
        
        if (Object.keys(newErrors).length > 0) {
            alert('Por favor, preencha os campos obrigatórios (Nome, Cargo, Telemóvel, Email).');
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
                const canvas = await html2canvas(content, { scale: 4, useCORS: true });
                const imgData = canvas.toDataURL('image/png');
                const fileName = `${data.name.replace(/\s+/g, '_')}_cartao`;

                if (format === 'png') {
                    const link = document.createElement('a');
                    link.href = imgData;
                    link.download = `${fileName}.png`;
                    link.click();
                } else {
                     const pdf = new jsPDF({ 
                        orientation: 'landscape', 
                        unit: 'mm', 
                        format: [CARD_WIDTH_MM, CARD_HEIGHT_MM]
                     });
                     pdf.addImage(imgData, 'PNG', 0, 0, CARD_WIDTH_MM, CARD_HEIGHT_MM);
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
            message: `Exportar o cartão como ${format.toUpperCase()} irá descontar <strong>1 crédito</strong>.`
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
                        <title>Imprimir Cartão de Visita</title>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
                        <style>
                            @page { size: ${CARD_WIDTH_MM}mm ${CARD_HEIGHT_MM}mm; margin: 0; }
                            body { margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
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
                        setIsProcessing(false);
                        document.body.removeChild(iframe);
                    }
                }, 500);
            };
        };
    
        requestServiceUse(SERVICE_ID, performPrint, {
            title: 'Confirmar Impressão',
            message: 'Imprimir este cartão irá descontar <strong>1 crédito</strong>.'
        });
    };


    const ActiveTemplateComponent = templateConfig[activeTemplate].component;
    const textColor = getTextColorForBackground(backgroundColor);
    const patternStyle = patterns.find(p => p.id === activePatternId)?.style || 'none';

    const renderPreviewContent = () => (
        <div className="w-full max-w-2xl">
            <div ref={previewRef} className="w-full aspect-[8/5] max-w-lg mx-auto">
                 <ActiveTemplateComponent 
                    data={data} 
                    primaryColor={primaryColor} 
                    backgroundColor={backgroundColor} 
                    backgroundPattern={patternStyle} 
                    textColor={textColor}
                    profileImage={profileImage}
                    uploadedBackgroundImage={uploadedBgImage}
                    uploadedBackgroundImageOpacity={uploadedBgOpacity}
                 />
            </div>
             <div className="flex flex-wrap justify-center gap-2 mt-4">
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
            </div>

            <p className="text-center text-sm text-gray-500 mt-2">Pré-visualização em tempo real. As suas alterações aparecem aqui.</p>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row h-full">
            <SheetExporter
                isOpen={isSheetExporterOpen}
                onClose={() => setIsSheetExporterOpen(false)}
                elementToExportRef={previewRef}
                aspectRatio={CARD_WIDTH_MM / CARD_HEIGHT_MM}
                itemWidth_mm={CARD_WIDTH_MM}
                itemHeight_mm={CARD_HEIGHT_MM}
                baseFileName={`${data.name}_cartao`}
                serviceId={SERVICE_ID}
            />
            {/* Form Panel */}
            <div className="w-full lg:w-1/3 p-4 lg:p-6 overflow-y-auto bg-white">
                 <h2 className="text-2xl font-bold mb-6 text-gray-800">Crie o Seu Cartão de Visita</h2>
                 <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Dados do Cartão</h3>
                    <Input label="Nome Completo" name="name" value={data.name} onChange={handleInputChange} error={errors.name} />
                    <Input label="Cargo" name="title" value={data.title} onChange={handleInputChange} error={errors.title} />
                    <Input label="Empresa" name="company" value={data.company} onChange={handleInputChange} />
                    <Input label="Telemóvel" name="phone" value={data.phone} onChange={handleInputChange} error={errors.phone} />
                    <Input label="Email" name="email" value={data.email} onChange={handleInputChange} type="email" error={errors.email} />
                    <Input label="Website" name="website" value={data.website} onChange={handleInputChange} />
                    <Input label="Morada" name="address" value={data.address} onChange={handleInputChange} />
                 </div>
                 <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">Redes Sociais</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="LinkedIn" name="linkedin" value={data.linkedin || ''} onChange={handleInputChange} placeholder="username" />
                        <Input label="Instagram" name="instagram" value={data.instagram || ''} onChange={handleInputChange} placeholder="@username" />
                        <Input label="Facebook" name="facebook" value={data.facebook || ''} onChange={handleInputChange} placeholder="username" />
                        <Input label="X (Twitter)" name="twitter" value={data.twitter || ''} onChange={handleInputChange} placeholder="@username" />
                    </div>
                 </div>
                 <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Imagem (Foto/Logo)</h3>
                    {!profileImage ? (
                        <label className="w-full flex items-center justify-center p-3 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                           <UploadIcon className="w-5 h-5 mr-2" /> Carregar Imagem
                           <input type="file" accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
                        </label>
                    ) : (
                        <div className="flex items-center gap-4">
                            <img src={profileImage} alt="Preview" className="w-16 h-16 rounded-lg object-cover border" />
                            <button onClick={handleRemoveProfileImage} className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition">
                               <TrashIcon className="w-4 h-4 mr-1.5" /> Remover
                            </button>
                        </div>
                    )}
                 </div>
                 <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Estilos de Cartão</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(templateConfig).map(([key, config]) => (
                            <button 
                                key={key}
                                onClick={() => handleTemplateChange(key as TemplateKey)} 
                                className={`p-3 text-center text-sm rounded-lg border-2 transition-all ${activeTemplate === key ? 'border-blue-600 bg-blue-50 font-semibold text-blue-700' : 'bg-white border-gray-200 hover:border-blue-400'}`}
                            >
                                {config.name}
                            </button>
                        ))}
                    </div>
                </div>
                 <div className="mt-6 border-t pt-4 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Design Personalizado</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <ColorInput label="Cor Primária" name="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
                        <ColorInput label="Cor do Fundo" name="backgroundColor" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Padrão de Fundo</label>
                        <div className="grid grid-cols-3 gap-2">
                            {patterns.map(p => (
                                <button key={p.id} onClick={() => { setActivePatternId(p.id); setUploadedBgImage(null); }} className={`p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${activePatternId === p.id ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200'}`}>
                                    <div className="w-full h-10 rounded-md" style={{backgroundImage: p.style, backgroundColor: '#e5e7eb', opacity: 0.5}}></div>
                                    <span className="block text-xs text-gray-600 mt-1">{p.name}</span>
                                </button>
                            ))}
                        </div>
                     </div>
                 </div>
                 <div className="mt-6 border-t pt-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Imagem de Fundo</h3>
                    {!uploadedBgImage ? (
                        <label className="w-full flex items-center justify-center p-3 text-blue-600 border-2 border-dashed border-blue-400 rounded-md hover:bg-blue-50 transition cursor-pointer">
                           <UploadIcon className="w-5 h-5 mr-2" /> Carregar Imagem de Fundo
                           <input type="file" accept="image/*" className="hidden" onChange={handleBgImageUpload} />
                        </label>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <img src={uploadedBgImage} alt="Background Preview" className="w-16 h-16 rounded-lg object-cover border" />
                                <button onClick={handleRemoveBgImage} className="flex items-center px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-md hover:bg-red-200 transition">
                                   <TrashIcon className="w-4 h-4 mr-1.5" /> Remover
                                </button>
                            </div>
                            <div>
                                <label htmlFor="bgOpacity" className="block text-sm font-medium text-gray-700 mb-1">Transparência da Imagem de Fundo</label>
                                <input 
                                    type="range" 
                                    id="bgOpacity" 
                                    min="0.05" 
                                    max="1" 
                                    step="0.05" 
                                    value={uploadedBgOpacity} 
                                    onChange={(e) => setUploadedBgOpacity(parseFloat(e.target.value))} 
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Desktop Preview Panel */}
            <div className="hidden lg:flex lg:w-2/3 items-center justify-center p-8 bg-gray-100 overflow-y-auto">
                {renderPreviewContent()}
            </div>
            
             {/* Mini Preview Popup for Mobile */}
            {!isPreviewOpen && !miniPreviewDismissed && (
                <div className="lg:hidden fixed bottom-20 right-4 z-20 w-40 aspect-[8/5] bg-white rounded-lg shadow-2xl border animate-fade-in-up overflow-hidden">
                     <button 
                        onClick={() => setMiniPreviewDismissed(true)} 
                        className="absolute top-1 right-1 z-30 p-1 bg-gray-800 text-white bg-opacity-50 rounded-full hover:bg-opacity-75" 
                        aria-label="Fechar pré-visualização rápida"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                    <div className="h-full w-full pointer-events-none">
                        <div style={{ transform: 'scale(0.3125)', transformOrigin: 'top left', width: '320%', height: '320%' }}>
                            <ActiveTemplateComponent 
                               data={data} 
                               primaryColor={primaryColor} 
                               backgroundColor={backgroundColor} 
                               backgroundPattern={patternStyle} 
                               textColor={textColor}
                               profileImage={profileImage}
                               uploadedBackgroundImage={uploadedBgImage}
                               uploadedBackgroundImageOpacity={uploadedBgOpacity}
                            />
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
                aria-label="Abrir painel de pré-visualização e download do cartão de visita"
            >
                Pré-visualizar / Baixar
            </button>
        </div>
    );
};

// Helper Input Component
const Input: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, error?: string, placeholder?: string}> = ({ label, name, value, onChange, type = 'text', error, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full px-3 py-2 border rounded-md shadow-sm transition duration-150 ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}`} />
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
);

const ColorInput: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input type="color" id={name} name={name} value={value} onChange={onChange} className="w-full h-10 border-gray-300 rounded-md cursor-pointer" />
    </div>
);

export default BusinessCardCreator;