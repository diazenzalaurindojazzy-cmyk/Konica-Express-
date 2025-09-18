import React, { useEffect, useRef, useState } from 'react';

// --- ICONS ---
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const SpinnerIcon: React.FC<{className?: string}> = ({className}) => (<svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);


const ADOBE_CLIENT_ID = "35d97c69a0d34ad0a892a3217e58f583"; 

interface AdobeViewerProps {
    pdfBlob: Blob;
    fileName: string;
    onClose: () => void;
}

const AdobeViewer: React.FC<AdobeViewerProps> = ({ pdfBlob, fileName, onClose }) => {
    const viewerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!viewerRef.current || !pdfBlob) return;

        // Use a unique ID for each viewer instance to avoid conflicts
        const viewerId = `adobe-viewer-${Date.now()}`;
        if(viewerRef.current) {
            viewerRef.current.id = viewerId;
        }
        
        // Ensure AdobeDC is available
        const AdobeDC = (window as any).AdobeDC;
        if (!AdobeDC) {
            console.error("AdobeDC View SDK is not available.");
            setIsLoading(false);
            return;
        }

        const viewConfig = {
            clientId: ADOBE_CLIENT_ID,
            divId: viewerId,
        };

        const adobeDCView = new AdobeDC.View(viewConfig);

        // Register an event listener to know when the document is saved.
        // This is the correct way to listen for events, instead of using getAPIs().
        adobeDCView.registerCallback(
            AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            (event: any) => {
                if (event.type === "DOCUMENT_SAVED") {
                    console.log('Document saved by the user locally.');
                }
            }
        );

        const previewFilePromise = adobeDCView.previewFile({
            content: { promise: Promise.resolve(pdfBlob.arrayBuffer()), fileName: fileName },
            metaData: { fileName: fileName }
        }, {
            embedMode: "SIZED_CONTAINER",
            showAnnotationTools: true,
            showDownloadPDF: true,
            showPrintPDF: true,
            showLeftHandPanel: false, // Start with a cleaner view
            showPageControls: true,
            dockPageControls: false,
            uiConfig: {
                // Hides promotional elements for a cleaner look
                hideAdobeLogo: true,
                hideViewerLogo: true,
            },
            defaultViewMode: "FIT_WIDTH",
        });

        previewFilePromise.then(() => {
            setIsLoading(false);
        }).catch((error: any) => {
            console.error("Adobe Viewer Error:", error);
            setIsLoading(false);
        });
        
    }, [pdfBlob, fileName]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex flex-col p-2 sm:p-4 animate-fade-in-up">
            <header className="flex justify-between items-center mb-2 flex-shrink-0 text-white">
                <h3 className="text-lg font-semibold truncate pr-4">{fileName}</h3>
                <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors">
                    <CloseIcon className="w-6 h-6"/>
                </button>
            </header>
            <main className="flex-1 w-full h-full bg-gray-200 rounded-md relative">
                 {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-200/50">
                        <SpinnerIcon className="w-12 h-12 text-blue-500" />
                        <p className="ml-4 text-gray-700 font-semibold">A carregar o editor da Adobe...</p>
                    </div>
                )}
                <div ref={viewerRef} className="w-full h-full"></div>
            </main>
        </div>
    );
};

export default AdobeViewer;